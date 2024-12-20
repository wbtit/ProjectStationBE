/*
  Warnings:

  - You are about to drop the `Assigned_list` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Assigned_list" DROP CONSTRAINT "Assigned_list_approved_by_fkey";

-- DropForeignKey
ALTER TABLE "Assigned_list" DROP CONSTRAINT "Assigned_list_assigned_by_fkey";

-- DropForeignKey
ALTER TABLE "Assigned_list" DROP CONSTRAINT "Assigned_list_assigned_to_fkey";

-- DropForeignKey
ALTER TABLE "Assigned_list" DROP CONSTRAINT "Assigned_list_task_id_fkey";

-- DropTable
DROP TABLE "Assigned_list";

-- CreateTable
CREATE TABLE "assigned_list" (
    "id" UUID NOT NULL,
    "approved_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT NOT NULL,
    "task_id" UUID NOT NULL,
    "assigned_by" UUID NOT NULL,
    "assigned_to" UUID NOT NULL,
    "approved_by" UUID NOT NULL,

    CONSTRAINT "assigned_list_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assigned_list" ADD CONSTRAINT "assigned_list_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigned_list" ADD CONSTRAINT "assigned_list_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigned_list" ADD CONSTRAINT "assigned_list_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigned_list" ADD CONSTRAINT "assigned_list_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
