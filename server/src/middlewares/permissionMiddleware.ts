import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import {
    ErrorCode,
    NotFoundException,
    UnauthorizedException,
} from "./errorMiddleware";
import { prismaClient } from "../services/prismaClient";
import { Role } from "@prisma/client";

type ActionRole = "create" | "update" | "delete" | "read";
type OwnerResolver = (req: Request) => Promise<string | null>;

const rolePermissions: Record<Role, ActionRole[]> = {
    [Role.admin]: ["create", "update", "delete", "read"],
    [Role.editor]: ["update", "read"],
    [Role.user]: ["read"],
};

const normalizeRoles = (rawRole?: string | string[] | null): Role[] => {
    const roles = Array.isArray(rawRole) ? rawRole : rawRole ? [rawRole] : [];
    return roles
        .map((role) => String(role).toLowerCase())
        .map((role) => (role in Role ? (role as Role) : null))
        .filter((role): role is Role => role !== null);
};

const resolveRoles = async (req: Request, userId: string) => {
    if (req.userRoles?.length) {
        return req.userRoles;
    }

    const user = await prismaClient.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });

    const roles = normalizeRoles(user?.role as string | string[] | null);

    req.userRoles = roles.length ? roles : [Role.user];
    return req.userRoles;
};

export const authorize = (action: ActionRole) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const auth = getAuth(req);

            if (!auth.userId) {
                throw new UnauthorizedException(
                    ErrorCode.UNAUTHORIZED,
                    "You need to login first"
                );
            }

            const roles = await resolveRoles(req, auth.userId);
            console.log(roles);
            const isAllowed = roles.some((role) =>
                rolePermissions[role]?.includes(action)
            );

            if (!isAllowed) {
                throw new UnauthorizedException(ErrorCode.UNAUTHORIZED, "Forbidden");
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export const requireOwner = (
    getOwnerId: OwnerResolver,
    options?: { allowRoles?: Role[]; notFoundMessage?: string }
) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const auth = getAuth(req);

            if (!auth.userId) {
                throw new UnauthorizedException(
                    ErrorCode.UNAUTHORIZED,
                    "You need to login first"
                );
            }

            if (options?.allowRoles?.length) {
                const roles = await resolveRoles(req, auth.userId);
                if (roles.some((role) => options.allowRoles?.includes(role))) {
                    return next();
                }
            }

            const ownerId = await getOwnerId(req);
            if (!ownerId) {
                throw new NotFoundException(
                    ErrorCode.NOT_FOUND,
                    options?.notFoundMessage ?? "Resource not found"
                );
            }

            if (ownerId !== auth.userId) {
                throw new UnauthorizedException(ErrorCode.UNAUTHORIZED, "Forbidden");
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export const requireProjectOwner = requireOwner(
    async (req) => {
        const projectId = req.params.projectId;
        const project = await prismaClient.project.findUnique({
            where: { id: projectId },
            select: { userId: true },
        });
        return project?.userId ?? null;
    },
    { allowRoles: [Role.admin], notFoundMessage: "Project not found" }
);