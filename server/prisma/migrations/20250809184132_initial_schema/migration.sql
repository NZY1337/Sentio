-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

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

-- CreateEnum
CREATE TYPE "GeneratedImagesCount" AS ENUM ('ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "credits" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "freeCredits" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'DESIGN_GENERATOR',
    "designTheme" "DesignTheme" NOT NULL DEFAULT 'MODERN',
    "spaceType" "SpaceType" NOT NULL DEFAULT 'LIVING_ROOM',
    "size" "SizeImage" NOT NULL DEFAULT 'SIZE_1024x1024',
    "quality" "QualityFormat" NOT NULL DEFAULT 'MEDIUM',
    "background" TEXT NOT NULL DEFAULT 'auto',
    "outputFormat" "OutputFormat" NOT NULL DEFAULT 'PNG',
    "n" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageGenerationResponse" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL,
    "imageTokens" INTEGER NOT NULL,
    "textTokens" INTEGER NOT NULL,
    "outputTokens" INTEGER NOT NULL,
    "totalTokens" INTEGER NOT NULL,
    "imageCost" DOUBLE PRECISION NOT NULL,
    "tokenCost" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ImageGenerationResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Project_userId_category_designTheme_spaceType_idx" ON "Project"("userId", "category", "designTheme", "spaceType");

-- CreateIndex
CREATE UNIQUE INDEX "ImageGenerationResponse_projectId_key" ON "ImageGenerationResponse"("projectId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageGenerationResponse" ADD CONSTRAINT "ImageGenerationResponse_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
