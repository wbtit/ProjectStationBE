/*
  Warnings:

  - The `files` column on the `project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "project" DROP COLUMN "files",
ADD COLUMN     "files" JSONB NOT NULL DEFAULT '[]';
