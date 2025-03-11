-- DropForeignKey
ALTER TABLE "department" DROP CONSTRAINT "department_createdById_fkey";

-- DropForeignKey
ALTER TABLE "department" DROP CONSTRAINT "department_managerId_fkey";

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
