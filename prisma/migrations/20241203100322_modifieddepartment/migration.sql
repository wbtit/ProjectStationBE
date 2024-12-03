-- AlterTable
ALTER TABLE "department" ADD COLUMN     "createdById" UUID;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
