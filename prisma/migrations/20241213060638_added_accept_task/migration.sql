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
CREATE TABLE "accepttask" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "satus" TEXT NOT NULL,
    "attachment" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3) NOT NULL,
    "duration" TEXT NOT NULL,
    "project_id" UUID NOT NULL,
    "fabricator_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "accepttask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignedlist" (
    "id" UUID NOT NULL,
    "approved_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT NOT NULL,
    "task_id" UUID NOT NULL,
    "assigned_by" UUID NOT NULL,
    "assigned_to" UUID NOT NULL,
    "approved_by" UUID NOT NULL,

    CONSTRAINT "assignedlist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "accepttask" ADD CONSTRAINT "accepttask_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accepttask" ADD CONSTRAINT "accepttask_fabricator_id_fkey" FOREIGN KEY ("fabricator_id") REFERENCES "fabricators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accepttask" ADD CONSTRAINT "accepttask_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignedlist" ADD CONSTRAINT "assignedlist_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignedlist" ADD CONSTRAINT "assignedlist_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignedlist" ADD CONSTRAINT "assignedlist_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignedlist" ADD CONSTRAINT "assignedlist_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
