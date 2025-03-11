/*
  Warnings:

  - Added the required column `activity` to the `taskBreakDown` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Activity" AS ENUM ('MODELING', 'DETAILING', 'ERECTION');

-- AlterTable
ALTER TABLE "taskBreakDown" ADD COLUMN     "activity" "Activity" NOT NULL;
