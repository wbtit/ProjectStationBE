/*
  Warnings:

  - Added the required column `assigned_to` to the `assigendlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assigendlist" ADD COLUMN     "assigned_to" UUID NOT NULL;

-- AlterTable
ALTER TABLE "assignes" ALTER COLUMN "comment" SET DEFAULT '';

-- AddForeignKey
ALTER TABLE "assigendlist" ADD CONSTRAINT "assigendlist_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
