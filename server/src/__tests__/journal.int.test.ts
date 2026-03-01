import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Role } from "@prisma/client";
import { getAuth } from "@clerk/express";
import journalRouter from "../routes/journal";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { prismaClient } from "../services/prismaClient";

const openAiMocks = vi.hoisted(() => ({
    createJournalEmbedding: vi.fn(async () => [1, 0]),
    detectQueryEmotion: vi.fn(async () => null as "joy" | "sadness" | "fear" | "anger" | "neutral" | null),
    generateJournalSearchAnswer: vi.fn(async () => "mocked answer"),
    rerankJournalContexts: vi.fn(async (_query: string, candidates: Array<{ journalEntryId: string; similarity: number }>) => (
        candidates.map((candidate) => ({
            journalEntryId: candidate.journalEntryId,
            relevance: Math.max(0, Math.min(1, candidate.similarity)),
            reason: "mock rerank",
        }))
    )),
    analyzeJournalWithOpenAI: vi.fn(async () => ({
        dominantEmotion: "sadness",
        cognitiveDistortion: null,
        riskScore: 35,
    })),
}));

vi.mock("@clerk/express", () => ({
    getAuth: vi.fn(),
}));

vi.mock("../services/openai/journalEmbedding", () => ({
    createJournalEmbedding: openAiMocks.createJournalEmbedding,
    detectQueryEmotion: openAiMocks.detectQueryEmotion,
    generateJournalSearchAnswer: openAiMocks.generateJournalSearchAnswer,
    rerankJournalContexts: openAiMocks.rerankJournalContexts,
}));

vi.mock("../services/openai/journalAnalysis", async () => {
    const actual = await vi.importActual<typeof import("../services/openai/journalAnalysis")>("../services/openai/journalAnalysis");

    return {
        ...actual,
        analyzeJournalWithOpenAI: openAiMocks.analyzeJournalWithOpenAI,
    };
});

const buildApp = (roles: Role[] = [Role.user]) => {
    const app = express();
    app.use(express.json());
    app.use((req, _res, next) => {
        const auth = (getAuth as any)(req);
        (req as any).auth = auth;
        (req as any).userRoles = roles;
        next();
    });
    app.use("/journal", journalRouter);
    app.use(errorMiddleware);
    return app;
};

const createUser = async (id: string, role: Role = Role.user) => {
    return prismaClient.user.create({
        data: {
            id,
            username: `${id}_name`,
            email: `${id}@example.com`,
            role,
        },
    });
};

const createJournal = async (input: {
    userId: string;
    content: string;
    status?: "draft" | "submitted";
    embedding?: number[];
    dominantEmotion?: string;
}) => {
    const entry = await prismaClient.journalEntry.create({
        data: {
            userId: input.userId,
            content: input.content,
            status: input.status ?? "draft",
            embedding: input.embedding ?? [0, 0],
        },
    });

    if (input.dominantEmotion) {
        await prismaClient.emotionalAnalysis.create({
            data: {
                journalEntryId: entry.id,
                dominantEmotion: input.dominantEmotion,
                cognitiveDistortion: null,
                riskScore: 20,
            },
        });
    }

    return entry;
};

describe("journal routes integration", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (getAuth as any).mockReturnValue({ userId: "user_journal_1" });

        openAiMocks.createJournalEmbedding.mockImplementation(async () => [1, 0]);
        openAiMocks.detectQueryEmotion.mockImplementation(async () => null);
        openAiMocks.generateJournalSearchAnswer.mockImplementation(async () => "mocked answer");
        openAiMocks.rerankJournalContexts.mockImplementation(async (_query: string, candidates: Array<{ journalEntryId: string; similarity: number }>) => (
            candidates.map((candidate) => ({
                journalEntryId: candidate.journalEntryId,
                relevance: Math.max(0, Math.min(1, candidate.similarity)),
                reason: "mock rerank",
            }))
        ));
        openAiMocks.analyzeJournalWithOpenAI.mockImplementation(async () => ({
            dominantEmotion: "sadness",
            cognitiveDistortion: null,
            riskScore: 35,
        }));
    });

    it("creates submitted journal and returns pending when AI analysis fails", async () => {
        await createUser("user_journal_1", Role.admin);
        openAiMocks.analyzeJournalWithOpenAI.mockRejectedValueOnce(new Error("openai unavailable"));

        const app = buildApp([Role.admin]);
        const response = await request(app)
            .post("/journal")
            .send({ content: "Azi m-am simtit coplesit.", status: "submitted" });

        expect(response.status).toBe(201);
        expect(response.body.aiAnalysisStatus?.status).toBe("pending");
        expect(response.body.journalEntry.status).toBe("submitted");

        const persisted = await prismaClient.journalEntry.findUnique({
            where: { id: response.body.journalEntry.id },
        });
        expect(persisted).not.toBeNull();
        expect(persisted?.status).toBe("submitted");
    });

    it("returns aiAnalysisStatus mapping for draft/submitted/completed entries", async () => {
        await createUser("user_journal_1");

        await createJournal({
            userId: "user_journal_1",
            content: "draft entry",
            status: "draft",
            embedding: [0.1, 0.2],
        });
        await createJournal({
            userId: "user_journal_1",
            content: "submitted pending entry",
            status: "submitted",
            embedding: [0.2, 0.3],
        });
        await createJournal({
            userId: "user_journal_1",
            content: "submitted completed entry",
            status: "submitted",
            embedding: [0.3, 0.4],
            dominantEmotion: "joy",
        });

        openAiMocks.analyzeJournalWithOpenAI.mockRejectedValue(new Error("keep pending in test"));

        const app = buildApp([Role.user]);
        const response = await request(app).get("/journal");

        expect(response.status).toBe(200);
        const statuses = response.body.journalEntries.map((entry: any) => entry.aiAnalysisStatus).sort();
        expect(statuses).toEqual(["completed", "not_requested", "pending"].sort());
    });

    it("search scopes by detected query emotion when matching emotional analyses exist", async () => {
        await createUser("user_journal_1");

        await createJournal({
            userId: "user_journal_1",
            content: "M-am bucurat de iesirea in natura.",
            status: "submitted",
            embedding: [0.2, 0.8],
            dominantEmotion: "joy",
        });
        await createJournal({
            userId: "user_journal_1",
            content: "M-am enervat tare in trafic.",
            status: "submitted",
            embedding: [0.99, 0.01],
            dominantEmotion: "anger",
        });

        openAiMocks.createJournalEmbedding.mockResolvedValue([1, 0]);
        openAiMocks.detectQueryEmotion.mockResolvedValue("joy");

        const app = buildApp([Role.user]);
        const response = await request(app)
            .post("/journal/search")
            .send({ query: "cand m-am simtit vesel?", limit: 5 });

        expect(response.status).toBe(200);
        expect(response.body.queryEmotion).toBe("joy");
        expect(response.body.matches.length).toBeGreaterThan(0);
        expect(response.body.matches.every((match: any) => match.analysis?.dominantEmotion === "joy")).toBe(true);
    });

    it("search deduplicates highly similar duplicate content entries", async () => {
        await createUser("user_journal_1");

        const duplicateText = "M-am simtit trist si fara energie mare parte din zi.";
        await createJournal({
            userId: "user_journal_1",
            content: duplicateText,
            status: "submitted",
            embedding: [1, 0],
            dominantEmotion: "sadness",
        });
        await createJournal({
            userId: "user_journal_1",
            content: `${duplicateText}   `,
            status: "submitted",
            embedding: [0.98, 0.02],
            dominantEmotion: "sadness",
        });
        await createJournal({
            userId: "user_journal_1",
            content: "M-a ajutat o plimbare scurta sa ma linistesc.",
            status: "submitted",
            embedding: [0.7, 0.3],
            dominantEmotion: "sadness",
        });

        openAiMocks.detectQueryEmotion.mockResolvedValue("sadness");
        openAiMocks.createJournalEmbedding.mockResolvedValue([1, 0]);

        const app = buildApp([Role.user]);
        const response = await request(app)
            .post("/journal/search")
            .send({ query: "ce pattern am cand ma simt trist?", limit: 5 });

        expect(response.status).toBe(200);
        const normalizedMatches = response.body.matches.map((match: any) => String(match.content).toLowerCase().replace(/\s+/g, " ").trim());
        const uniqueNormalized = new Set(normalizedMatches);
        expect(uniqueNormalized.size).toBe(normalizedMatches.length);
        expect(response.body.evidence.length).toBeLessThanOrEqual(3);
    });
});
