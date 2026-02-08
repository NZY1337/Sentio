import { Request, Response } from "express";
import { clerkClient } from "@clerk/express";
import { prismaClient } from "../services/prismaClient";
import { BadRequestException, ErrorCode } from "../middlewares/errorMiddleware";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Updates a user's public metadata in Clerk.
 *
 * @param userId - The Clerk user ID (e.g., 'user_abc123')
 * @param metadata - An object with public metadata to update (e.g., { role: 'admin' })
 * @returns The updated Clerk user object
 */

// api/users/metadata/updateRole
export const updateUserRole = async (req: Request, res: Response) => {
    const { role, userId } = req.body;

    if (!role || !userId) {
        throw new BadRequestException(400, "Role or userId is required");
    }

    const user = await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: { role: role },
    });
    res.status(200).json(user);
};

export const getUsers = async (req: Request, res: Response) => {
    const users = await prismaClient.user.findMany();
    res.status(200).json(users);
};

export const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
        throw new BadRequestException(400, "Role or userId is required");
    }

    const user = await clerkClient.users.deleteUser(userId);
    res.status(200).json({ message: "User delete sucessfully!" });
};

export const getUserCredits = async (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    console.log("userId: ", userId);
    if (!userId)
        throw new BadRequestException(ErrorCode.BAD_REQUEST, "userId Not Found");

    const user = await prismaClient.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            credits: true,
        },
    });

    if (!user) {
        throw new BadRequestException(ErrorCode.BAD_REQUEST, "User not found");
    }

    res
        .status(200)
        .json({ ammount: (user.credits as Decimal).toNumber().toLocaleString() });
};
