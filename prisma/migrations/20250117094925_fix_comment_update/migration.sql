/*
  Warnings:

  - The `file` column on the `comment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "comment" DROP COLUMN "file",
ADD COLUMN     "file" JSONB NOT NULL DEFAULT '[]';
