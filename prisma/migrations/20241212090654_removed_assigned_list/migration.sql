/*
  Warnings:

  - You are about to drop the `assigned_list` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `approved_by` to the `task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assigned_by` to the `task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assigned_to` to the `task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comment` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "assigned_list" DROP CONSTRAINT "assigned_list_approved_by_fkey";

-- DropForeignKey
ALTER TABLE "assigned_list" DROP CONSTRAINT "assigned_list_assigned_by_fkey";

-- DropForeignKey
ALTER TABLE "assigned_list" DROP CONSTRAINT "assigned_list_assigned_to_fkey";

-- DropForeignKey
ALTER TABLE "assigned_list" DROP CONSTRAINT "assigned_list_task_id_fkey";

-- AlterTable
ALTER TABLE "task" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "approved_by" UUID NOT NULL,
ADD COLUMN     "approved_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "assigned_by" UUID NOT NULL,
ADD COLUMN     "assigned_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "assigned_to" UUID NOT NULL,
ADD COLUMN     "comment" TEXT NOT NULL;

-- DropTable
DROP TABLE "assigned_list";

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
