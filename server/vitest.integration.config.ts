import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        include: ["src/**/__tests__/**/*.int.test.ts"],
        setupFiles: ["src/__tests__/setupTestDb.ts"],
        pool: "forks",
        fileParallelism: false,
    },
});
