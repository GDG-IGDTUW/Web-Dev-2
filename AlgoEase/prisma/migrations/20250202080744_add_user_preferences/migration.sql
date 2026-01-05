/*
  Warnings:

  - You are about to drop the column `interests` on the `User` table. All the data in the column will be lost.
  - The `goals` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "interests",
ADD COLUMN     "level" TEXT,
DROP COLUMN "goals",
ADD COLUMN     "goals" TEXT[];
