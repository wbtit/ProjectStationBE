-- AlterTable
ALTER TABLE "users" ADD COLUMN     "department" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "emp_code" TEXT NOT NULL DEFAULT 'WBT',
ADD COLUMN     "is_sales" BOOLEAN NOT NULL DEFAULT false;
