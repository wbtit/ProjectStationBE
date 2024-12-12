/*
  Warnings:

  - You are about to drop the column `approved` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `approved_by` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `approved_on` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `assigned_by` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `assigned_on` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `assigned_to` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_approved_by_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_assigned_by_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_assigned_to_fkey";

-- AlterTable
ALTER TABLE "task" DROP COLUMN "approved",
DROP COLUMN "approved_by",
DROP COLUMN "approved_on",
DROP COLUMN "assigned_by",
DROP COLUMN "assigned_on",
DROP COLUMN "assigned_to",
DROP COLUMN "comment";

-- CreateTable
CREATE TABLE "Assigned_list" (
    "id" UUID NOT NULL,
    "approved_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT NOT NULL,
    "task_id" UUID NOT NULL,
    "assigned_by" UUID NOT NULL,
    "assigned_to" UUID NOT NULL,
    "approved_by" UUID NOT NULL,

    CONSTRAINT "Assigned_list_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Assigned_list" ADD CONSTRAINT "Assigned_list_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assigned_list" ADD CONSTRAINT "Assigned_list_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assigned_list" ADD CONSTRAINT "Assigned_list_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assigned_list" ADD CONSTRAINT "Assigned_list_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
