/*
  Warnings:

  - You are about to drop the column `fabricator_id` on the `task` table. All the data in the column will be lost.
  - Added the required column `start_date` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_fabricator_id_fkey";

-- AlterTable
ALTER TABLE "task" DROP COLUMN "fabricator_id",
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL;
