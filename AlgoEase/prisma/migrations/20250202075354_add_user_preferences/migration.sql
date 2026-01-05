/*
  Warnings:

  - You are about to drop the column `pace` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "pace",
ADD COLUMN     "goals" TEXT,
ADD COLUMN     "learningStyle" TEXT,
ADD COLUMN     "timeCommitment" TEXT;
