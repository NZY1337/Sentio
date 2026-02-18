import { Request, Response } from "express";
import { clerkClient } from "@clerk/express";
import { prismaClient } from "../services/prismaClient";
import { BadRequestException, ErrorCode } from "../middlewares/errorMiddleware";

/**
 * Updates a user's private metadata in Clerk.
 *
 * @param userId - The Clerk user ID (e.g., 'user_abc123')
 * @param metadata - An object with private metadata to update (e.g., { role: 'admin' })
 * @returns The updated Clerk user object
 */

export const getUser = async (req: Request, res: Response) => {
    const userId = req.auth?.userId;

    const user = await prismaClient.user.findFirst({
        where: { id: userId },
    });

    res.status(200).json(user);
}

export const updateUserRole = async (req: Request, res: Response) => {
    const { role, userId } = req.body;

    if (!role || !userId) {
        throw new BadRequestException(ErrorCode.BAD_REQUEST, "Role or userId is required");
    }

    const user = await prismaClient.user.update({
        where: { id: userId },
        data: { role }
    });

    res.status(200).json(user);
};

export const updateConsentPolicy = async (req: Request, res: Response) => {
    const { userId } = req.body;

    if (!userId) throw new BadRequestException(ErrorCode.BAD_REQUEST, 'user not found');

    await prismaClient.user.update({
        where: { id: userId },
        data: { consent: true }
    });

    res.status(200).json({ message: "User consent policy updated" });
}

export const getUsers = async (req: Request, res: Response) => {
    const users = await prismaClient.user.findMany();
    res.status(200).json(users);
};

export const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
        throw new BadRequestException(ErrorCode.BAD_REQUEST, "Role or userId is required");
    }

    await clerkClient.users.deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully!" });
};
