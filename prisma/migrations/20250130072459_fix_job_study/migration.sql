/*
  Warnings:

  - You are about to drop the column `jobstudyId` on the `taskBreakDown` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `taskBreakDown` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "taskBreakDown" DROP CONSTRAINT "taskBreakDown_jobstudyId_fkey";

-- AlterTable
ALTER TABLE "taskBreakDown" DROP COLUMN "jobstudyId",
ADD COLUMN     "projectId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "taskBreakDown" ADD CONSTRAINT "taskBreakDown_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
