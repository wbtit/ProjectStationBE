-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STAFF', 'CLIENT', 'VENDOR');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'ON_HOLD', 'INACTIVE', 'DELAY', 'COMPLETE');

-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('RFI', 'IFA', 'BFA', 'BFA_M', 'RIFA', 'RBFA', 'IFC', 'BFC', 'RJFC', 'REV', 'CO');

-- CreateEnum
CREATE TYPE "Tools" AS ENUM ('TEKLA', 'SDS2');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" VARCHAR(150),
    "f_name" VARCHAR(50) NOT NULL,
    "m_name" VARCHAR(50),
    "l_name" VARCHAR(50),
    "phone" VARCHAR(20) NOT NULL,
    "landline" VARCHAR(20) DEFAULT '',
    "alt_landline" VARCHAR(20) DEFAULT '',
    "alt_phone" VARCHAR(20) DEFAULT '',
    "designation" VARCHAR(50) DEFAULT '',
    "city" TEXT DEFAULT '',
    "zip_code" TEXT DEFAULT '',
    "state" TEXT DEFAULT '',
    "country" TEXT DEFAULT '',
    "address" TEXT DEFAULT '',
    "role" "UserRole" NOT NULL,
    "emp_code" TEXT DEFAULT 'WBT',
    "department" JSONB DEFAULT '{}',
    "is_sales" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_staff" BOOLEAN NOT NULL DEFAULT false,
    "is_superuser" BOOLEAN NOT NULL DEFAULT false,
    "is_firstLogin" BOOLEAN NOT NULL DEFAULT true,
    "fabricatorId" UUID,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fabricators" (
    "id" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "fabName" TEXT NOT NULL DEFAULT '',
    "headquaters" JSONB NOT NULL DEFAULT '{}',
    "website" TEXT NOT NULL DEFAULT '',
    "drive" TEXT NOT NULL DEFAULT '',
    "branches" JSONB NOT NULL DEFAULT '[]',
    "files" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_bin" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fabricators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "managerId" UUID,
    "createdById" UUID,
    "isBin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "managerID" UUID NOT NULL,
    "members" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

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
    "stage" "Stage" NOT NULL DEFAULT 'RFI',
    "tools" "Tools" NOT NULL DEFAULT 'TEKLA',
    "files" JSONB NOT NULL DEFAULT '[]',
    "connectionDesign" BOOLEAN NOT NULL DEFAULT true,
    "miscDesign" BOOLEAN NOT NULL DEFAULT true,
    "customerDesign" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvalDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimatedHours" INTEGER NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "attachment" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3) NOT NULL,
    "duration" TEXT NOT NULL,
    "project_id" UUID NOT NULL,
    "fabricator_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assigned_list" (
    "id" UUID NOT NULL,
    "approved_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT NOT NULL,
    "task_id" UUID NOT NULL,
    "assigned_by" UUID NOT NULL,
    "assigned_to" UUID NOT NULL,
    "approved_by" UUID NOT NULL,

    CONSTRAINT "Assigned_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FabricatorUsers" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_fabricatorId_key" ON "users"("fabricatorId");

-- CreateIndex
CREATE UNIQUE INDEX "department_name_key" ON "department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "team_name_key" ON "team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "project_name_key" ON "project"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_FabricatorUsers_AB_unique" ON "_FabricatorUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_FabricatorUsers_B_index" ON "_FabricatorUsers"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_fabricatorId_fkey" FOREIGN KEY ("fabricatorId") REFERENCES "fabricators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fabricators" ADD CONSTRAINT "fabricators_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_fabricator_id_fkey" FOREIGN KEY ("fabricator_id") REFERENCES "fabricators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assigned_list" ADD CONSTRAINT "Assigned_list_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assigned_list" ADD CONSTRAINT "Assigned_list_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assigned_list" ADD CONSTRAINT "Assigned_list_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assigned_list" ADD CONSTRAINT "Assigned_list_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FabricatorUsers" ADD CONSTRAINT "_FabricatorUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "fabricators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FabricatorUsers" ADD CONSTRAINT "_FabricatorUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
