/*
  Warnings:

  - You are about to drop the column `fabDetails` on the `fabricators` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "fabricators" DROP COLUMN "fabDetails",
ADD COLUMN     "branches" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "drive" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "fabName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "files" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "headquaters" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "website" TEXT NOT NULL DEFAULT '';
