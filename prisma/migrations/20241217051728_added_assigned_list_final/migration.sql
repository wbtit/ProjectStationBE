/*
  Warnings:

  - You are about to drop the `assignedlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "assignedlist" DROP CONSTRAINT "assignedlist_approved_by_fkey";

-- DropForeignKey
ALTER TABLE "assignedlist" DROP CONSTRAINT "assignedlist_assigned_by_fkey";

-- DropForeignKey
ALTER TABLE "assignedlist" DROP CONSTRAINT "assignedlist_assigned_to_fkey";

-- DropForeignKey
ALTER TABLE "assignedlist" DROP CONSTRAINT "assignedlist_task_id_fkey";

-- DropTable
DROP TABLE "assignedlist";

-- CreateTable
CREATE TABLE "assigendlist" (
    "id" UUID NOT NULL,
    "approved_on" TIMESTAMP(3) NOT NULL,
    "assigned_on" TIMESTAMP(3) NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "task_id" UUID NOT NULL,
    "assigned_by" UUID NOT NULL,
    "approved_by" UUID NOT NULL,

    CONSTRAINT "assigendlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignes" (
    "id" UUID NOT NULL,
    "approved_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT NOT NULL,
    "task_id" UUID NOT NULL,
    "assigned_by" UUID NOT NULL,
    "assigned_to" UUID NOT NULL,
    "approved_by" UUID NOT NULL,

    CONSTRAINT "assignes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assigendlist" ADD CONSTRAINT "assigendlist_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigendlist" ADD CONSTRAINT "assigendlist_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigendlist" ADD CONSTRAINT "assigendlist_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignes" ADD CONSTRAINT "assignes_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignes" ADD CONSTRAINT "assignes_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignes" ADD CONSTRAINT "assignes_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignes" ADD CONSTRAINT "assignes_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
