/*
  Warnings:

  - You are about to drop the column `consent` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SpaceType" AS ENUM ('LIVING_ROOM', 'BEDROOM', 'KITCHEN', 'BATHROOM', 'DINING_ROOM', 'HOME_OFFICE', 'KIDS_ROOM', 'HALLWAY_CORRIDOR', 'BALCONY_TERRACE', 'GAME_ROOM', 'STUDY');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('DESIGN_GENERATOR', 'DESIGN_EDITOR');

-- CreateEnum
CREATE TYPE "DesignTheme" AS ENUM ('MODERN', 'CONTEMPORARY', 'MINIMALIST', 'SCANDINAVIAN', 'INDUSTRIAL', 'MID_CENTURY_MODERN', 'TRADITIONAL', 'CLASSIC', 'BAROQUE', 'JAPANESE_ZEN', 'WABI_SABI', 'FARMHOUSE', 'RUSTIC', 'BOHEMIAN', 'ART_DECO', 'VICTORIAN', 'COASTAL', 'TROPICAL', 'URBAN', 'MAXIMALIST', 'FUTURISTIC');

-- CreateEnum
CREATE TYPE "OutputFormat" AS ENUM ('PNG', 'JPEG', 'WEBP');

-- CreateEnum
CREATE TYPE "QualityFormat" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "SizeImage" AS ENUM ('SIZE_1024x1024', 'SIZE_1024x1536', 'SIZE_1536x1024', 'AUTO');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "consent";

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "embedding" DOUBLE PRECISION[],

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmotionalAnalysis" (
    "id" TEXT NOT NULL,
    "journalEntryId" TEXT NOT NULL,
    "dominantEmotion" TEXT NOT NULL,
    "cognitiveDistortion" TEXT,
    "riskScore" INTEGER,

    CONSTRAINT "EmotionalAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmotionalAnalysis_journalEntryId_key" ON "EmotionalAnalysis"("journalEntryId");

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmotionalAnalysis" ADD CONSTRAINT "EmotionalAnalysis_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
