/*
  Warnings:

  - The `files` column on the `fabricators` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "fabricators" DROP COLUMN "files",
ADD COLUMN     "files" JSONB NOT NULL DEFAULT '[]';
