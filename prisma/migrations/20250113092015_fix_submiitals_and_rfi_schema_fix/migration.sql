/*
  Warnings:

  - The `files` column on the `rfi` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `files` column on the `submittals` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "rfi" DROP COLUMN "files",
ADD COLUMN     "files" JSONB[] DEFAULT ARRAY[]::JSONB[];

-- AlterTable
ALTER TABLE "submittals" DROP COLUMN "files",
ADD COLUMN     "files" JSONB[] DEFAULT ARRAY[]::JSONB[];
