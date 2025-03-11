/*
  Warnings:

  - You are about to drop the column `Qty` on the `subTasks` table. All the data in the column will be lost.
  - You are about to drop the column `taskBreakDownid` on the `subTasks` table. All the data in the column will be lost.
  - You are about to drop the `taskBreakDown` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `QtyNo` to the `subTasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectID` to the `subTasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wbsactivityID` to the `subTasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subTasks" DROP CONSTRAINT "subTasks_taskBreakDownid_fkey";

-- DropForeignKey
ALTER TABLE "taskBreakDown" DROP CONSTRAINT "taskBreakDown_projectId_fkey";

-- AlterTable
ALTER TABLE "subTasks" DROP COLUMN "Qty",
DROP COLUMN "taskBreakDownid",
ADD COLUMN     "QtyNo" INTEGER NOT NULL,
ADD COLUMN     "checkHr" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "execHr" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "projectID" UUID NOT NULL,
ADD COLUMN     "wbsactivityID" UUID NOT NULL;

-- DropTable
DROP TABLE "taskBreakDown";

-- CreateTable
CREATE TABLE "wbsactivity" (
    "id" UUID NOT NULL,
    "type" "Activity" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "wbsactivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subTasks" ADD CONSTRAINT "subTasks_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subTasks" ADD CONSTRAINT "subTasks_wbsactivityID_fkey" FOREIGN KEY ("wbsactivityID") REFERENCES "wbsactivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
