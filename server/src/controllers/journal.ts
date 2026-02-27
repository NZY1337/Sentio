import { Request, Response } from "express";
import { prismaClient } from "../services/prismaClient";
import { z } from "zod";

const JournalEntryValidator = z.object({
    content: z.string().min(1, "Content is required"),
    status: z.string().optional(),
});

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

    res.status(200).json({
        journalEntries: entries,
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
    res.status(200).json({ journalEntry: entry });
};

export const createJournalEntry = async (req: Request, res: Response) => {
    const { userId } = req.auth;
    const validation = JournalEntryValidator.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error.flatten() });
    }
    const entry = await prismaClient.journalEntry.create({
        data: {
            userId,
            content: validation.data.content,
            status: validation.data.status || 'draft',
        },
    });
    res.status(201).json({ journalEntry: entry });
};

export const updateJournalEntry = async (req: Request, res: Response) => {
    const { journalEntryId } = req.params;
    const validation = JournalEntryValidator.partial().safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error.flatten() });
    }
    const entry = await prismaClient.journalEntry.update({
        where: { id: journalEntryId },
        data: {
            ...validation.data,
            status: validation.data.status || undefined,
        },
    });
    res.status(200).json({ journalEntry: entry });
};

export const deleteJournalEntry = async (req: Request, res: Response) => {
    const { journalEntryId } = req.params;
    await prismaClient.journalEntry.delete({
        where: { id: journalEntryId },
    });
    res.status(200).json({ message: "Journal entry deleted" });
};
