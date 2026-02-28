import OpenAI from "openai";
import { z } from "zod";
import { OPENAI_API_KEY, OPENAI_PROJECT_ID } from "../../../secrets";

const emotionEnum = z.enum(["joy", "sadness", "fear", "anger", "neutral"]);

const aiAnalysisSchema = z.object({
    dominantEmotion: z.string().trim().min(1),
    cognitiveDistortion: z.string().trim().min(1).nullable().optional(),
    riskScore: z.number().int().min(1).max(10),
});

type JournalAnalysis = {
    dominantEmotion: string;
    cognitiveDistortion: string | null;
    riskScore: number;
};

const openaiClient = OPENAI_API_KEY
    ? new OpenAI({
        apiKey: OPENAI_API_KEY,
        project: OPENAI_PROJECT_ID || undefined,
    })
    : null;

const collectText = (value: unknown, acc: string[]) => {
    if (value == null) return;

    if (Array.isArray(value)) {
        value.forEach((item) => collectText(item, acc));
        return;
    }

    if (typeof value === "object") {
        const record = value as Record<string, unknown>;

        if (typeof record.text === "string" && record.text.trim()) {
            acc.push(record.text);
        }

        if (record.content) {
            collectText(record.content, acc);
        }
    }
};

export const extractPlainText = (input: unknown): string => {
    if (typeof input !== "string") {
        const textParts: string[] = [];
        collectText(input, textParts);
        return textParts.join(" ").replace(/\s+/g, " ").trim();
    }

    const raw = input.trim();
    if (!raw) return "";

    try {
        const parsed = JSON.parse(raw);
        const textParts: string[] = [];
        collectText(parsed, textParts);
        const extracted = textParts.join(" ").replace(/\s+/g, " ").trim();
        return extracted || raw;
    } catch {
        return raw.replace(/\s+/g, " ").trim();
    }
};

const normalizeEmotion = (emotion: string) => {
    const normalized = emotion.trim().toLowerCase();
    const parsed = emotionEnum.safeParse(normalized);
    return parsed.success ? parsed.data : "neutral";
};

const parseJsonOutput = (raw: string) => {
    const maybeWrapped = raw.match(/\{[\s\S]*\}/);
    const source = maybeWrapped ? maybeWrapped[0] : raw;
    const parsed = JSON.parse(source);
    return aiAnalysisSchema.parse(parsed);
};

export const analyzeJournalWithOpenAI = async (content: string): Promise<JournalAnalysis> => {
    if (!openaiClient) {
        throw new Error("OPENAI_API_KEY is not configured on the server.");
    }

    const plainText = extractPlainText(content).slice(0, 12000);

    if (!plainText) {
        return {
            dominantEmotion: "neutral",
            cognitiveDistortion: null,
            riskScore: 1,
        };
    }

    const completion = await openaiClient.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
            {
                role: "system",
                content:
                    "You analyze a personal journal entry for emotional self-reflection. Return valid JSON only with keys: dominantEmotion, cognitiveDistortion, riskScore. dominantEmotion must be one of: joy, sadness, fear, anger, neutral. cognitiveDistortion must be a concise label or null if absent. riskScore must be an integer from 1 to 10 where 10 is highest emotional risk.",
            },
            {
                role: "user",
                content: plainText,
            },
        ],
    });

    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent || typeof rawContent !== "string") {
        throw new Error("OpenAI returned an empty analysis payload.");
    }

    const parsed = parseJsonOutput(rawContent);

    return {
        dominantEmotion: normalizeEmotion(parsed.dominantEmotion),
        cognitiveDistortion: parsed.cognitiveDistortion ?? null,
        riskScore: parsed.riskScore,
    };
};