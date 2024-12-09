-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'ON_HOLD', 'INACTIVE', 'DELAY', 'COMPLETE');

-- CreateEnum
CREATE TYPE "stage" AS ENUM ('RFI', 'IFA', 'BFA', 'BFA_M', 'RIFA', 'RBFA', 'IFC', 'BFC', 'RJFC', 'REV', 'CO');

-- DropForeignKey
ALTER TABLE "department" DROP CONSTRAINT "department_createdById_fkey";

-- DropForeignKey
ALTER TABLE "department" DROP CONSTRAINT "department_managerId_fkey";

-- DropForeignKey
ALTER TABLE "team" DROP CONSTRAINT "team_managerID_fkey";

-- CreateTable
CREATE TABLE "project" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fabricatorID" UUID NOT NULL,
    "departmentID" UUID NOT NULL,
    "teamID" UUID NOT NULL,
    "managerID" UUID NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "stage" "stage" NOT NULL DEFAULT 'RFI',
    "files" TEXT NOT NULL DEFAULT '[]',
    "connectionDesign" BOOLEAN NOT NULL DEFAULT true,
    "miscDesign" BOOLEAN NOT NULL DEFAULT true,
    "customerDesign" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvalDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimatedHours" INTEGER NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_name_key" ON "project"("name");

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_managerID_fkey" FOREIGN KEY ("managerID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_fabricatorID_fkey" FOREIGN KEY ("fabricatorID") REFERENCES "fabricators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_departmentID_fkey" FOREIGN KEY ("departmentID") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_managerID_fkey" FOREIGN KEY ("managerID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
