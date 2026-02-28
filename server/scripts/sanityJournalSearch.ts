import { prismaClient } from "../src/services/prismaClient/index";
import {
    createJournalEmbedding,
    detectQueryEmotion,
    generateJournalSearchAnswer,
    rerankJournalContexts,
} from "../src/services/openai/journalEmbedding";
import { extractPlainText } from "../src/services/openai/journalAnalysis";

type Emotion = "joy" | "sadness" | "fear" | "anger" | "neutral" | null;

type Entry = {
    id: string;
    userId: string;
    content: string;
    status: string;
    createdAt: Date;
    embedding: number[];
    analysis: {
        dominantEmotion: string;
    } | null;
};

const cosineSimilarity = (vectorA: number[], vectorB: number[]) => {
    if (!vectorA.length || !vectorB.length || vectorA.length !== vectorB.length) return -1;

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let index = 0; index < vectorA.length; index += 1) {
        const a = vectorA[index] ?? 0;
        const b = vectorB[index] ?? 0;
        dot += a * b;
        normA += a * a;
        normB += b * b;
    }

    if (normA === 0 || normB === 0) return -1;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

const clamp01 = (value: number) => {
    if (value < 0) return 0;
    if (value > 1) return 1;
    return value;
};

const tests = [
    "cand m-am simtit cu adevarat vesel?",
    "ce m-a ajutat cand eram anxios?",
    "cand am fost nervos si de ce?",
    "ce am facut ca sa ma calmez?",
    "ce pattern am cand ma simt trist?",
];

const expectedEmotionHints: Record<string, Emotion> = {
    "cand m-am simtit cu adevarat vesel?": "joy",
    "ce m-a ajutat cand eram anxios?": "fear",
    "cand am fost nervos si de ce?": "anger",
    "ce am facut ca sa ma calmez?": null,
    "ce pattern am cand ma simt trist?": "sadness",
};

async function resolveTargetUserId() {
    const grouped = await prismaClient.journalEntry.groupBy({
        by: ["userId"],
        _count: { userId: true },
        orderBy: { _count: { userId: "desc" } },
        take: 1,
    });

    if (!grouped.length) throw new Error("No journal entries found in database.");
    return grouped[0].userId;
}

async function runSingleQuery(userId: string, query: string) {
    const queryEmbedding = await createJournalEmbedding(query);
    const queryEmotion = await detectQueryEmotion(query);

    const entries = await prismaClient.journalEntry.findMany({
        where: { userId, embedding: { isEmpty: false } },
        include: { analysis: true },
        orderBy: { createdAt: "desc" },
        take: 200,
    }) as Entry[];

    const emotionScopedEntries = queryEmotion
        ? entries.filter((entry) => entry.analysis?.dominantEmotion?.toLowerCase() === queryEmotion)
        : [];

    const candidatePool = emotionScopedEntries.length > 0 ? emotionScopedEntries : entries;

    const baseCandidates = candidatePool
        .map((entry) => ({ ...entry, similarity: cosineSimilarity(queryEmbedding, entry.embedding) }))
        .filter((entry) => Number.isFinite(entry.similarity))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 30);

    const aiRerank = await rerankJournalContexts(
        query,
        baseCandidates.map((entry) => ({
            journalEntryId: entry.id,
            createdAt: entry.createdAt,
            content: entry.content,
            similarity: entry.similarity,
        })),
    );

    const aiScoreById = new Map(aiRerank.map((item) => [item.journalEntryId, item]));

    const ranked = baseCandidates
        .map((entry) => {
            const ai = aiScoreById.get(entry.id);
            const similarityNormalized = clamp01((entry.similarity + 1) / 2);
            const aiScore = ai?.relevance ?? similarityNormalized;
            const score = (0.65 * aiScore) + (0.35 * similarityNormalized);

            return {
                ...entry,
                score,
            };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    const topScores = ranked.slice(0, 3).map((entry) => entry.score);
    const topAverage = topScores.length ? topScores.reduce((sum, s) => sum + s, 0) / topScores.length : 0;
    const topScore = ranked[0]?.score ?? 0;
    const confidenceScore = clamp01((topAverage + topScore) / 2);

    const confidenceLevel = confidenceScore >= 0.75 ? "high" : confidenceScore >= 0.5 ? "medium" : "low";

    const answer = await generateJournalSearchAnswer(
        query,
        ranked.map((entry) => ({
            journalEntryId: entry.id,
            createdAt: entry.createdAt,
            content: entry.content,
            similarity: entry.score,
        })),
    );

    const topEmotion = ranked[0]?.analysis?.dominantEmotion?.toLowerCase() ?? null;
    const expectedEmotion = expectedEmotionHints[query];

    const hasEvidence = ranked.length > 0;
    const hasAnswer = answer.trim().length > 10;
    const emotionAligned = expectedEmotion ? queryEmotion === expectedEmotion || topEmotion === expectedEmotion : true;
    const confidenceOk = confidenceLevel !== "low";

    const pass = hasEvidence && hasAnswer && emotionAligned && confidenceOk;

    return {
        query,
        pass,
        queryEmotion,
        expectedEmotion,
        topEmotion,
        confidenceScore: Number(confidenceScore.toFixed(3)),
        confidenceLevel,
        topSnippet: extractPlainText(ranked[0]?.content ?? "").slice(0, 160),
    };
}

async function main() {
    const userId = await resolveTargetUserId();
    console.log(`Running sanity pass for user: ${userId}`);

    const results = [];
    for (const query of tests) {
        const result = await runSingleQuery(userId, query);
        results.push(result);
        console.log(`\n[${result.pass ? "PASS" : "FAIL"}] ${query}`);
        console.log(`  expectedEmotion=${result.expectedEmotion ?? "n/a"} queryEmotion=${result.queryEmotion ?? "null"} topEmotion=${result.topEmotion ?? "null"}`);
        console.log(`  confidence=${result.confidenceScore} (${result.confidenceLevel})`);
        console.log(`  topSnippet=${result.topSnippet}`);
    }

    const passCount = results.filter((item) => item.pass).length;
    console.log(`\nSummary: ${passCount}/${results.length} PASS`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });
