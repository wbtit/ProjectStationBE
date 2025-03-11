-- DropForeignKey
ALTER TABLE "taskBreakDown" DROP CONSTRAINT "taskBreakDown_jobstudyId_fkey";

-- AddForeignKey
ALTER TABLE "taskBreakDown" ADD CONSTRAINT "taskBreakDown_jobstudyId_fkey" FOREIGN KEY ("jobstudyId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
