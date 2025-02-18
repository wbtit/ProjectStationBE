/*
  Warnings:

  - The `department` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "department",
ADD COLUMN     "department" UUID;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_department_fkey" FOREIGN KEY ("department") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
