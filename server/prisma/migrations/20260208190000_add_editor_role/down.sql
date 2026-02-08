-- Manual rollback for adding 'editor' to Role enum.
-- Postgres does not support dropping enum values directly.
-- This recreates the enum without 'editor' and rewires dependent columns.

BEGIN;
CREATE TYPE "Role_new" AS ENUM ('admin', 'user');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
DROP TYPE "Role";
ALTER TYPE "Role_new" RENAME TO "Role";
COMMIT;
