/*
  Warnings:

  - Added the required column `endDate` to the `project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "project" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "startDate" DROP DEFAULT;
