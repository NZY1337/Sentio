import express from "express";
import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { authorize, requireProjectOwner } from "../middlewares/permissionMiddleware";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { getAuth } from "@clerk/express";
import { prismaClient } from "../services/prismaClient";
import { Role } from "@prisma/client";

vi.mock("@clerk/express", () => ({
    getAuth: vi.fn(),
}));

const buildApp = (middleware: express.RequestHandler, roles?: Role[]) => {
    const app = express();
    if (roles?.length) {
        app.use((req, _res, next) => {
            (req as any).userRoles = roles;
            next();
        });
    }
    app.get("/test/:projectId?", middleware, (_req, res) => {
        res.status(200).json({ ok: true });
    });
    app.use(errorMiddleware);
    return app;
};

describe("permissionMiddleware integration", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const createUser = async (id: string, role: Role) => {
        return prismaClient.user.create({
            data: {
                id,
                username: `${id}_name`,
                email: `${id}@example.com`,
                role,
            },
        });
    };

    const createProject = async (userId: string) => {
        return prismaClient.project.create({
            data: {
                userId,
                prompt: "test prompt",
            },
        });
    };

    it("returns 401 when unauthenticated", async () => {
        (getAuth as any).mockReturnValue({});

        const app = buildApp(authorize("read"));
        const res = await request(app).get("/test");

        expect(res.status).toBe(401);
        expect(res.body.error).toBe("You need to login first");
    });

    it("allows admin role for delete", async () => {
        await createUser("user_1", Role.admin);
        (getAuth as any).mockReturnValue({ userId: "user_1" });

        const app = buildApp(authorize("delete"), [Role.admin]);
        const res = await request(app).get("/test");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ ok: true });
    });

    it("blocks non-owner when not admin", async () => {
        await createUser("user_1", Role.user);
        await createUser("user_2", Role.user);
        const project = await createProject("user_2");
        (getAuth as any).mockReturnValue({ userId: "user_1" });

        const app = buildApp(requireProjectOwner, [Role.user]);
        const res = await request(app).get(`/test/${project.id}`);

        expect(res.status).toBe(401);
        expect(res.body.error).toBe("Forbidden");
    });

    it("allows admin even when not owner", async () => {
        await createUser("user_1", Role.admin);
        await createUser("user_2", Role.user);
        const project = await createProject("user_2");
        (getAuth as any).mockReturnValue({ userId: "user_1" });

        const app = buildApp(requireProjectOwner, [Role.admin]);
        const res = await request(app).get(`/test/${project.id}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ ok: true });
    });
});
