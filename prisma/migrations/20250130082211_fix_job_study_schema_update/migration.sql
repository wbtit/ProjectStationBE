/*
  Warnings:

  - Added the required column `description` to the `jobStudy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jobStudy" ADD COLUMN     "description" TEXT NOT NULL;
