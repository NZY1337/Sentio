import { Request, Response } from "express";
import { prismaClient } from "../services/prismaClient";
import { z } from "zod";
import { analyzeJournalWithOpenAI, extractPlainText } from "../services/openai/journalAnalysis";
import { createJournalEmbedding, detectQueryEmotion, generateJournalSearchAnswer, rerankJournalContexts } from "../services/openai/journalEmbedding";

const JournalEntryValidator = z.object({
    content: z.string().min(1, "Content is required"),
    status: z.enum(["draft", "submitted"]).optional(),
});

const JournalSearchValidator = z.object({
    query: z.string().min(2, "Search query is required"),
    limit: z.number().int().min(1).max(10).optional(),
});

type AiAnalysisStatus = {
    status: "completed" | "pending";
    message?: string;
};

type JournalAiStatus = "completed" | "pending" | "not_requested";

const getJournalAiStatus = (entry: { status: string; analysis: unknown }): JournalAiStatus => {
    if (entry.analysis) return "completed";
    if (entry.status === "submitted") return "pending";
    return "not_requested";
};

const upsertJournalEmbedding = async (journalEntryId: string, content: string) => {
    try {
        const embedding = await createJournalEmbedding(content);

        await prismaClient.journalEntry.update({
            where: { id: journalEntryId },
            data: { embedding },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Embedding generation failed";
        console.warn(`[journal] Embedding pending for ${journalEntryId}: ${message}`);
    }
};

const upsertAiAnalysis = async (journalEntryId: string, content: string) => {
    try {
        const analysis = await analyzeJournalWithOpenAI(content);

        await prismaClient.emotionalAnalysis.upsert({
            where: { journalEntryId },
            create: {
                journalEntryId,
                dominantEmotion: analysis.dominantEmotion,
                cognitiveDistortion: analysis.cognitiveDistortion,
                riskScore: analysis.riskScore,
            },
            update: {
                dominantEmotion: analysis.dominantEmotion,
                cognitiveDistortion: analysis.cognitiveDistortion,
                riskScore: analysis.riskScore,
            },
        });

        return {
            status: "completed",
        } satisfies AiAnalysisStatus;
    } catch (error) {
        const message = error instanceof Error ? error.message : "OpenAI analysis failed";
        console.warn(`[journal] OpenAI analysis pending for ${journalEntryId}: ${message}`);

        return {
            status: "pending",
            message,
        } satisfies AiAnalysisStatus;
    }
};

const schedulePendingAnalysisRetry = (
    entries: Array<{ id: string; content: string; status: string; analysis: unknown }>,
) => {
    const pendingEntries = entries.filter((entry) => entry.status === "submitted" && !entry.analysis);

    if (!pendingEntries.length) return;

    void Promise.allSettled(
        pendingEntries.map((entry) => upsertAiAnalysis(entry.id, entry.content)),
    );
};

export const getJournalEntries = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
        prismaClient.journalEntry.findMany({
            where: { userId: req.auth.userId },
            include: { analysis: true },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prismaClient.journalEntry.count({
            where: { userId: req.auth.userId },
        }),
    ]);

    const totalPages = Math.ceil(total / limit);

    schedulePendingAnalysisRetry(entries);

    res.status(200).json({
        journalEntries: entries.map((entry) => ({
            ...entry,
            aiAnalysisStatus: getJournalAiStatus(entry),
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    });
};

export const getJournalEntryById = async (req: Request, res: Response) => {
    const { journalEntryId } = req.params;
    const entry = await prismaClient.journalEntry.findFirst({
        where: { id: journalEntryId, userId: req.auth.userId },
        include: { analysis: true },
    });
    if (!entry) return res.status(404).json({ error: "Journal entry not found" });

    schedulePendingAnalysisRetry([entry]);

    res.status(200).json({
        journalEntry: {
            ...entry,
            aiAnalysisStatus: getJournalAiStatus(entry),
        },
    });
};

export const createJournalEntry = async (req: Request, res: Response) => {
    const { userId } = req.auth;
    const validation = JournalEntryValidator.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ error: validation.error.flatten() });
    }

    let entry = await prismaClient.journalEntry.create({
        data: {
            userId,
            content: validation.data.content,
            status: validation.data.status || 'draft',
        },
        include: { analysis: true },
    });

    let aiAnalysisStatus: AiAnalysisStatus | undefined;

    await upsertJournalEmbedding(entry.id, entry.content);

    if (entry.status === "submitted") {
        aiAnalysisStatus = await upsertAiAnalysis(entry.id, entry.content);

        if (aiAnalysisStatus.status === "completed") {
            entry = await prismaClient.journalEntry.findUniqueOrThrow({
                where: { id: entry.id },
                include: { analysis: true },
            });
        }
    }

    res.status(201).json({ journalEntry: entry, aiAnalysisStatus });
};

export const updateJournalEntry = async (req: Request, res: Response) => {
    const { journalEntryId } = req.params;

    const validation = JournalEntryValidator.partial().safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ error: validation.error.flatten() });
    }

    const existingEntry = await prismaClient.journalEntry.findFirst({
        where: { id: journalEntryId, userId: req.auth.userId },
        include: { analysis: true },
    });

    if (!existingEntry) {
        return res.status(404).json({ error: "Journal entry not found" });
    }

    let entry = await prismaClient.journalEntry.update({
        where: { id: journalEntryId },
        data: {
            ...validation.data,
            status: validation.data.status || undefined,
        },
        include: { analysis: true },
    });

    let aiAnalysisStatus: AiAnalysisStatus | undefined;

    if (typeof validation.data.content === "string") {
        await upsertJournalEmbedding(entry.id, entry.content);
    }

    if (entry.status === "submitted") {
        aiAnalysisStatus = await upsertAiAnalysis(entry.id, entry.content);

        if (aiAnalysisStatus.status === "completed") {
            entry = await prismaClient.journalEntry.findUniqueOrThrow({
                where: { id: entry.id },
                include: { analysis: true },
            });
        }
    }

    res.status(200).json({ journalEntry: entry, aiAnalysisStatus });
};

export const deleteJournalEntry = async (req: Request, res: Response) => {
    const { journalEntryId } = req.params;

    const existingEntry = await prismaClient.journalEntry.findFirst({
        where: { id: journalEntryId, userId: req.auth.userId },
        select: { id: true },
    });

    if (!existingEntry) {
        return res.status(404).json({ error: "Journal entry not found" });
    }

    await prismaClient.journalEntry.delete({
        where: { id: journalEntryId },
    });
    res.status(200).json({ message: "Journal entry deleted" });
};

const cosineSimilarity = (vectorA: number[], vectorB: number[]) => {
    if (!vectorA.length || !vectorB.length || vectorA.length !== vectorB.length) {
        return -1;
    }

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

    if (normA === 0 || normB === 0) {
        return -1;
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

const clamp01 = (value: number) => {
    if (value < 0) return 0;
    if (value > 1) return 1;
    return value;
};

const buildContentFingerprint = (content: string) => {
    return extractPlainText(content)
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 280);
};

export const searchJournalEntries = async (req: Request, res: Response) => {
    const validation = JournalSearchValidator.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error.flatten() });
    }

    const { query, limit = 5 } = validation.data;

    // PASUL 1: Facem embedding pentru întrebarea user-ului.
    // Asta înseamnă: întrebarea -> vector numeric.
    const queryEmbedding = await createJournalEmbedding(query);

    // PASUL 2: Detectăm dacă întrebarea țintește o emoție specifică
    // (ex: "nervos" -> anger), ca să reducem candidații greșiți.
    const queryEmotion = await detectQueryEmotion(query);

    const entries = await prismaClient.journalEntry.findMany({
        where: {
            userId: req.auth.userId,
            embedding: { isEmpty: false },
        },
        include: { analysis: true },
        orderBy: { createdAt: "desc" },
        take: 200,
    });

    // PASUL 3: Dacă avem emoție detectată, încercăm întâi doar intrările
    // cu aceeași emoție analizată. Dacă nu găsim nimic, cădem pe toate intrările.
    const emotionScopedEntries = queryEmotion
        ? entries.filter((entry) => entry.analysis?.dominantEmotion?.toLowerCase() === queryEmotion)
        : [];

    const candidatePool = emotionScopedEntries.length > 0 ? emotionScopedEntries : entries;

    // PASUL 4: Similaritate locală (pe server), fără OpenAI.
    // Comparăm embedding query cu embedding-ul fiecărui jurnal (cosine similarity).
    const baseCandidates = candidatePool
        .map((entry) => ({
            ...entry,
            similarity: cosineSimilarity(queryEmbedding, entry.embedding),
        }))
        .filter((entry) => Number.isFinite(entry.similarity))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 30);

    // PASUL 5: Trimitem doar candidații top la AI pentru reranking semantic.
    // Nu trimitem toate jurnalele din DB.
    const aiRerank = await rerankJournalContexts(
        query,
        baseCandidates.map((entry) => ({
            journalEntryId: entry.id,
            createdAt: entry.createdAt,
            content: entry.content,
            similarity: entry.similarity,
        })),
    );

    const uniqueAiRerank: typeof aiRerank = [];
    const seenAiIds = new Set<string>();
    for (const item of aiRerank) {
        if (seenAiIds.has(item.journalEntryId)) continue;
        seenAiIds.add(item.journalEntryId);
        uniqueAiRerank.push(item);
    }

    const aiScoreById = new Map(uniqueAiRerank.map((item) => [item.journalEntryId, item]));

    // PASUL 6: Scor final hibrid.
    // 65% AI rerank + 35% embedding similarity (normalizat în [0..1]).
    const rankedRaw = baseCandidates
        .map((entry) => {
            const ai = aiScoreById.get(entry.id);
            const similarityNormalized = clamp01((entry.similarity + 1) / 2);
            const aiScore = ai?.relevance ?? similarityNormalized;
            const score = (0.65 * aiScore) + (0.35 * similarityNormalized);

            return {
                ...entry,
                score,
                aiReason: ai?.reason ?? "Embedding similarity",
            };
        })
        .sort((a, b) => b.score - a.score);

    // PASUL 7: Scoatem duplicate și păstrăm doar `limit` rezultate finale.
    const ranked: typeof rankedRaw = [];
    const seenRankedIds = new Set<string>();
    const seenContentFingerprints = new Set<string>();
    for (const entry of rankedRaw) {
        if (seenRankedIds.has(entry.id)) continue;
        const fingerprint = buildContentFingerprint(entry.content);
        if (fingerprint && seenContentFingerprints.has(fingerprint)) continue;

        seenRankedIds.add(entry.id);
        if (fingerprint) seenContentFingerprints.add(fingerprint);
        ranked.push(entry);
        if (ranked.length >= limit) break;
    }

    // PASUL 8: Confidence = cât de "solid" pare top-ul de rezultate.
    // E un scor de retrieval quality, NU de "emoție bună/rea".
    const topScores = ranked.slice(0, 3).map((entry) => entry.score);
    const topAverage = topScores.length
        ? topScores.reduce((sum, score) => sum + score, 0) / topScores.length
        : 0;

    const topScore = ranked[0]?.score ?? 0;
    const confidenceScore = clamp01((topAverage + topScore) / 2);

    const confidenceLevel =
        confidenceScore >= 0.75 ? "high"
            : confidenceScore >= 0.5 ? "medium"
                : "low";

    const confidenceRationale = ranked.length === 0
        ? "Nu au fost găsite suficiente intrări relevante cu embedding."
        : queryEmotion && emotionScopedEntries.length > 0
            ? "Rezultatele sunt filtrate pe emoția cerută în întrebare, apoi rerank-uite semantic de AI."
            : "Rezultatele sunt ordonate prin combinație embedding similarity + AI reranking semantic.";

    // PASUL 9: Generăm răspunsul textual din top rezultate.
    const answer = await generateJournalSearchAnswer(
        query,
        ranked.map((entry) => ({
            journalEntryId: entry.id,
            createdAt: entry.createdAt,
            content: entry.content,
            similarity: entry.score,
        })),
    );

    res.status(200).json({
        query,
        queryEmotion,
        answer,
        confidence: {
            score: Number(confidenceScore.toFixed(3)),
            level: confidenceLevel,
            rationale: confidenceRationale,
        },
        evidence: ranked.slice(0, 3).map((entry) => ({
            id: entry.id,
            createdAt: entry.createdAt,
            similarity: Number(entry.score.toFixed(4)),
            dominantEmotion: entry.analysis?.dominantEmotion ?? null,
            snippet: extractPlainText(entry.content).slice(0, 220),
            reason: entry.aiReason,
        })),
        matches: ranked.map((entry) => ({
            id: entry.id,
            createdAt: entry.createdAt,
            status: entry.status,
            content: entry.content,
            similarity: Number(entry.score.toFixed(4)),
            analysis: entry.analysis,
        })),
    });
};
