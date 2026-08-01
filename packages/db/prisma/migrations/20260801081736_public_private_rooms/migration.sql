/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,adminId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inviteCode` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- DropIndex
DROP INDEX "Room_slug_key";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "inviteCode" TEXT NOT NULL,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "visibility" "RoomVisibility" NOT NULL DEFAULT 'PUBLIC';

-- CreateIndex
CREATE UNIQUE INDEX "Room_inviteCode_key" ON "Room"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "Room_slug_adminId_key" ON "Room"("slug", "adminId");
