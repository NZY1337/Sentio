import { Request, Response } from "express";
import { Webhook } from "svix";
import { CLERK_WEBHOOK_SIGNING_SECRET } from "../../../secrets";
import {
    BadRequestException,
    InternalException,
    ErrorCode,
} from "../../middlewares/errorMiddleware";
import { prismaClient } from "../../services/prismaClient";
import { Role } from "@prisma/client";
import { clerkClient } from "@clerk/express";

export const clerkWebhook = async (req: Request, res: Response) => {
    console.log("🎯 Webhook endpoint hit!");
    console.log("Headers:", req.headers);
    console.log("Body type:", typeof req.body);
    
    try {
        const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);
        const svixId = req.headers["svix-id"];
        const svixTimestamp = req.headers["svix-timestamp"];
        const svixSignature = req.headers["svix-signature"];

        if (!svixId || !svixTimestamp || !svixSignature) {
            console.error("Error: Missing Svix headers");
            console.error("Available headers:", Object.keys(req.headers));
            throw new BadRequestException(
                ErrorCode.BAD_REQUEST,
                "Missing Svix headers"
            );
        }

        const headers = {
            "svix-id": svixId as string,
            "svix-timestamp": svixTimestamp as string,
            "svix-signature": svixSignature as string,
        };

        const payload = req.body;
        const body = JSON.stringify(payload);
        let evt: any;

        // Verify payload with headers
        try {
            evt = wh.verify(body, headers);
        } catch (err) {
            console.error("Error: Could not verify webhook:", err);
            throw new BadRequestException(
                ErrorCode.BAD_REQUEST,
                "Verification error"
            );
        }

        try {
            console.log("Received event:", evt.type);
            // Handle specific event types
            if (evt.type === "user.created") {
                const { id, email_addresses, username, role, created_at, updated_at } = evt.data;
                await clerkClient.users.updateUserMetadata(id, {
                    publicMetadata: { role: Role.user },
                });

                console.log("User created:", id, email_addresses[0].email_address);
                const user = {
                    id,
                    email: email_addresses[0].email_address,
                    username: username || null,
                    role: Role.user, // default role is user
                    createdAt: new Date(created_at),
                    updatedAt: new Date(updated_at),
                };

                await prismaClient.user.upsert({
                    where: { email: user.email },
                    create: { ...user },
                    update: {
                        id: user.id,
                        username: user.username,
                        updatedAt: user.updatedAt,
                    },
                });
            }

            if (evt.type === "user.updated") {
                console.log('user.updated event received:', evt.data);
                const {
                    id,
                    email_addresses,
                    username,
                    role,
                    created_at,
                    updated_at,
                    public_metadata,
                } = evt.data;

                const user = {
                    id,
                    email: email_addresses[0].email_address,
                    username: username || null,
                    role: public_metadata.role || Role.user,
                    createdAt: new Date(created_at),
                    updatedAt: new Date(updated_at),
                };

                await prismaClient.user.update({
                    where: { id: user.id },
                    data: { ...user },
                });
            }

            if (evt.type === "user.deleted") {
                const { id } = evt.data;
                console.log("---user-deleted");
                await prismaClient.user.delete({
                    where: { id },
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Error verifying webhook:", err);
        // return res.status(500).json({ error: 'Internal server error' });
        throw new InternalException(
            ErrorCode.INTERNAL_EXCEPTION,
            "Internal server error"
        );
    }
};
