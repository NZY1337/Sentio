import OpenAI from "openai";
import { OPENAI_API_KEY, OPENAI_PROJECT_ID } from "../../../secrets";
import { extractPlainText } from "./journalAnalysis";

const openaiClient = OPENAI_API_KEY
    ? new OpenAI({
        apiKey: OPENAI_API_KEY,
        project: OPENAI_PROJECT_ID || undefined,
    })
    : null;

export const createJournalEmbedding = async (content: string): Promise<number[]> => {
    if (!openaiClient) {
        throw new Error("OPENAI_API_KEY is not configured on the server.");
    }

    // 1) Transformăm conținutul (JSON/editor rich text) în text simplu.
    // 2) Tăiem la max ~8000 chars ca să ținem costul și latenta sub control.
    const plainText = extractPlainText(content).slice(0, 8000);

    if (!plainText) {
        return [];
    }

    // AICI trimitem la OpenAI DOAR textul acestui jurnal (sau textul query-ului).
    // OpenAI returnează un vector numeric (embedding) care descrie sensul textului.
    const response = await openaiClient.embeddings.create({
        model: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
        input: plainText,
    });

    return response.data[0]?.embedding ?? [];
};

type JournalContext = {
    journalEntryId: string;
    createdAt: Date;
    content: string;
    similarity: number;
};

export type JournalRerankCandidate = {
    journalEntryId: string;
    createdAt: Date;
    content: string;
    similarity: number;
};

export type JournalRerankResult = {
    journalEntryId: string;
    relevance: number;
    reason: string;
};

export type QueryEmotion = "joy" | "sadness" | "fear" | "anger" | "neutral" | null;

export const generateJournalSearchAnswer = async (
    query: string,
    contexts: JournalContext[],
): Promise<string> => {
    if (!openaiClient) {
        throw new Error("OPENAI_API_KEY is not configured on the server.");
    }

    if (!contexts.length) {
        return "Nu am găsit intrări relevante în jurnal pentru această întrebare.";
    }

    // Trimitem la model doar top contexte deja selectate local.
    // Nu trimitem toată baza de jurnale.
    const contextText = contexts
        .map((entry, index) => {
            const date = new Date(entry.createdAt).toISOString().split("T")[0];
            const preview = extractPlainText(entry.content).slice(0, 500);
            return `${index + 1}. [${date}] ${preview}`;
        })
        .join("\n");

    const completion = await openaiClient.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        temperature: 0.2,
        messages: [
            {
                role: "system",
                content:
                    "Răspunzi scurt și empatic, doar pe baza contextului de jurnal primit. Dacă contextul este insuficient, spune explicit acest lucru. Nu inventa detalii.",
            },
            {
                role: "user",
                content: `Întrebare: ${query}\n\nContext jurnal:\n${contextText}`,
            },
        ],
    });

    return completion.choices[0]?.message?.content?.trim()
        || "Nu am putut genera răspunsul în acest moment.";
};

export const rerankJournalContexts = async (
    query: string,
    candidates: JournalRerankCandidate[],
): Promise<JournalRerankResult[]> => {
    if (!openaiClient) {
        throw new Error("OPENAI_API_KEY is not configured on the server.");
    }

    if (!candidates.length) {
        return [];
    }

    // Rerank = modelul primește doar candidații preselectați local
    // și întoarce ce e mai relevant pentru întrebare.
    const candidateText = candidates.map((candidate, index) => {
        const date = new Date(candidate.createdAt).toISOString().split("T")[0];
        const snippet = extractPlainText(candidate.content).slice(0, 280);
        return `${index + 1}. id=${candidate.journalEntryId}; date=${date}; snippet=${snippet}`;
    }).join("\n");

    const completion = await openaiClient.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
            {
                role: "system",
                content:
                    "You rerank journal entries by relevance to a user question. Return ONLY JSON with key 'results' containing array of objects: journalEntryId (string), relevance (number 0..1), reason (short string). Do not invent IDs; use only provided IDs.",
            },
            {
                role: "user",
                content: `Question: ${query}\n\nCandidates:\n${candidateText}`,
            },
        ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
        return [];
    }

    let parsed: any;
    try {
        parsed = JSON.parse(raw);
    } catch {
        return [];
    }

    const results = Array.isArray(parsed?.results) ? parsed.results : [];
    const validIds = new Set(candidates.map((candidate) => candidate.journalEntryId));

    return results
        .filter((item: any) => typeof item?.journalEntryId === "string" && validIds.has(item.journalEntryId))
        .map((item: any) => ({
            journalEntryId: item.journalEntryId,
            relevance: Math.max(0, Math.min(1, Number(item.relevance ?? 0))),
            reason: typeof item.reason === "string" && item.reason.trim()
                ? item.reason.trim().slice(0, 180)
                : "AI semantic relevance",
        }));
};

export const detectQueryEmotion = async (query: string): Promise<QueryEmotion> => {
    if (!openaiClient) {
        throw new Error("OPENAI_API_KEY is not configured on the server.");
    }

    // Mic pas de clasificare: detectăm dacă întrebarea cere explicit
    // o emoție (ex: joy/sadness/fear/anger), ca să putem filtra candidații.
    const completion = await openaiClient.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
            {
                role: "system",
                content:
                    "Classify the emotional target explicitly asked in a journal search question. Return ONLY JSON with key 'emotion' and one of: joy, sadness, fear, anger, neutral, null. Use null if no explicit emotional target is present.",
            },
            {
                role: "user",
                content: query,
            },
        ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        const emotion = parsed?.emotion;

        if (emotion === "joy" || emotion === "sadness" || emotion === "fear" || emotion === "anger" || emotion === "neutral") {
            return emotion;
        }

        return null;
    } catch {
        return null;
    }
};