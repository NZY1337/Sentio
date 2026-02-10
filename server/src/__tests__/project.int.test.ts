import express from "express";
import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import projectRouter from "../routes/project";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { getAuth } from "@clerk/express";
import { prismaClient } from "../services/prismaClient";
import { Role } from "@prisma/client";

vi.mock("@clerk/express", () => ({
    getAuth: vi.fn(),
}));

const buildApp = (roles?: Role[]) => {
    const app = express();
    app.use(express.json());
    app.use((req, _res, next) => {
        const auth = (getAuth as any)(req);
        (req as any).auth = auth;
        next();
    });
    if (roles?.length) {
        app.use((req, _res, next) => {
            (req as any).userRoles = roles;
            next();
        });
    }
    app.use("/project", projectRouter);
    app.use(errorMiddleware);
    return app;
};

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

const validProjectBody = {
    prompt: "test prompt",
    category: "DESIGN_GENERATOR",
    designTheme: "MODERN",
    spaceType: "LIVING_ROOM",
    size: "SIZE_1024x1024",
    quality: "MEDIUM",
    outputFormat: "PNG",
    n: 1,
};

describe("project routes integration", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("lists only the current user's projects", async () => {
        await createUser("user_1", Role.admin);
        await createUser("user_2", Role.user);
        const project1 = await createProject("user_1");
        await createProject("user_2");

        (getAuth as any).mockReturnValue({ userId: "user_1" });
        const app = buildApp([Role.admin]);
        const res = await request(app).get("/project");

        expect(res.status).toBe(200);
        expect(res.body.projects.length).toBe(1);
        expect(res.body.projects[0].id).toBe(project1.id);
    });

    it("creates a project for the current user", async () => {
        await createUser("user_1", Role.admin);

        (getAuth as any).mockReturnValue({ userId: "user_1" });
        const app = buildApp([Role.admin]);
        const res = await request(app)
            .post("/project")
            .send(validProjectBody);

        expect(res.status).toBe(201);
        expect(res.body.project.userId).toBe("user_1");
        expect(res.body.project.prompt).toBe(validProjectBody.prompt);
    });

    it("updates a project when owner has permission", async () => {
        await createUser("user_1", Role.admin);
        const project = await createProject("user_1");

        (getAuth as any).mockReturnValue({ userId: "user_1" });
        const app = buildApp([Role.admin]);
        const res = await request(app)
            .put(`/project/${project.id}`)
            .send({ prompt: "updated prompt" });

        expect(res.status).toBe(200);
        expect(res.body.project.prompt).toBe("updated prompt");
    });

    it("blocks update when user is not owner", async () => {
        await createUser("user_1", Role.user);
        await createUser("user_2", Role.user);
        const project = await createProject("user_2");

        (getAuth as any).mockReturnValue({ userId: "user_1" });
        const app = buildApp([Role.user]);
        const res = await request(app)
            .put(`/project/${project.id}`)
            .send({ prompt: "updated prompt" });

        expect(res.status).toBe(401);
        expect(res.body.error).toBe("Forbidden");
    });

    it("deletes a project when owner has permission", async () => {
        await createUser("user_1", Role.admin);
        const project = await createProject("user_1");

        (getAuth as any).mockReturnValue({ userId: "user_1" });
        const app = buildApp([Role.admin]);
        const res = await request(app).delete(`/project/${project.id}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Project deleted successfully");
    });
});
