/*
  Warnings:

  - You are about to drop the column `refresh_token` on the `sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "refresh_token";
