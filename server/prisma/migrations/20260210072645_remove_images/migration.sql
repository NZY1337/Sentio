/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImageGenerationResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ImageGenerationResponse" DROP CONSTRAINT "ImageGenerationResponse_projectId_fkey";

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "ImageGenerationResponse";

-- DropEnum
DROP TYPE "GeneratedImagesCount";
