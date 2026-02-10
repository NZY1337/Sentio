import { execSync } from "child_process";
import dotenv from "dotenv";
import { beforeAll, beforeEach, afterAll } from "vitest";
import { prismaClient } from "../services/prismaClient";

let migrated = false;

const ensureTestDb = () => {
    dotenv.config({ path: ".env.test", override: true });

    const url = process.env.DATABASE_URL;
    if (!url) {
        throw new Error("DATABASE_URL is missing for integration tests");
    }

    const directUrl = process.env.DIRECT_URL;
    if (!directUrl) {
        throw new Error("DIRECT_URL is missing for integration tests");
    }

    const allowRemote = String(process.env.ALLOW_REMOTE_TEST_DB).toLowerCase() === "true";
    if (!allowRemote) {
        const isLocalHost = (value: string) => {
            try {
                const parsed = new URL(value);
                return parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
            } catch {
                return false;
            }
        };

        if (!isLocalHost(url) || !isLocalHost(directUrl)) {
            throw new Error(
                "Integration tests require localhost DATABASE_URL and DIRECT_URL. Set ALLOW_REMOTE_TEST_DB=true to override."
            );
        }
    }
};

const migrateOnce = () => {
    if (migrated) {
        return;
    }

    execSync("npx prisma migrate deploy", {
        stdio: "inherit",
        env: {
            ...process.env,
            DATABASE_URL: process.env.DIRECT_URL as string,
        },
    });
    migrated = true;
};

beforeAll(() => {
    ensureTestDb();
    migrateOnce();
});

beforeEach(async () => {
    // With cascade delete, just delete users and projects will be automatically removed
    await prismaClient.user.deleteMany({});
});

afterAll(async () => {
    await prismaClient.$disconnect();
});
