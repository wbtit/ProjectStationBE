-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "WorkHourStatus" AS ENUM ('START', 'END', 'PAUSE', 'RESUME');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STAFF', 'CLIENT', 'VENDOR');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'ONHOLD', 'INACTIVE', 'DELAY', 'COMPLETE', 'ASSIGNED');

-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('RFI', 'IFA', 'BFA', 'BFAM', 'RIFA', 'RBFA', 'IFC', 'BFC', 'RIFC', 'REV', 'CO', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Tools" AS ENUM ('TEKLA', 'SDS2', 'PEMB');

-- CreateEnum
CREATE TYPE "Activity" AS ENUM ('MODELING', 'DETAILING', 'ERECTION', 'MC', 'DC', 'EC', 'DESIGNER', 'MODEL_CHECKING', 'DETAIL_CHECKING', 'ERECTION_CHECKING', 'DESIGN_CHECKING', 'DWG_CHECKING', 'OTHERS');

-- CreateEnum
CREATE TYPE "State" AS ENUM ('PARTIAL', 'COMPLETE');

-- CreateEnum
CREATE TYPE "RFQStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'CLOSED', 'APPROVED', 'RE_APPROVAL');

-- CreateEnum
CREATE TYPE "SubResStatus" AS ENUM ('APPROVED', 'PARTIAL', 'NOT_APPROVED');

-- CreateEnum
CREATE TYPE "COSTATUS" AS ENUM ('ACCEPT', 'REJECT', 'NOT_REPLIED');

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
    "is_sales" BOOLEAN DEFAULT false,
    "is_manager" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_staff" BOOLEAN NOT NULL DEFAULT false,
    "is_superuser" BOOLEAN NOT NULL DEFAULT false,
    "is_firstLogin" BOOLEAN NOT NULL DEFAULT true,
    "is_pmo" BOOLEAN NOT NULL DEFAULT false,
    "is_oe" BOOLEAN NOT NULL DEFAULT false,
    "fabricatorId" UUID,
    "department" UUID,
    "is_deptmanager" BOOLEAN NOT NULL DEFAULT false,
    "is_hr" BOOLEAN NOT NULL DEFAULT false,
    "is_est" BOOLEAN NOT NULL DEFAULT false,
    "is_disabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fabricators" (
    "id" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "fabName" TEXT NOT NULL DEFAULT '',
    "headquaters" JSONB NOT NULL DEFAULT '{}',
    "website" TEXT DEFAULT '',
    "drive" TEXT DEFAULT '',
    "branches" JSONB NOT NULL DEFAULT '[]',
    "is_bin" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "files" JSONB NOT NULL DEFAULT '[]',

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
    "teamID" UUID,
    "managerID" UUID NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "stage" "Stage" NOT NULL DEFAULT 'RFI',
    "tools" "Tools" NOT NULL DEFAULT 'TEKLA',
    "files" JSONB NOT NULL DEFAULT '[]',
    "connectionDesign" BOOLEAN NOT NULL DEFAULT true,
    "miscDesign" BOOLEAN NOT NULL DEFAULT true,
    "customerDesign" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "approvalDate" TEXT NOT NULL,
    "estimatedHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "modelingHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "modelCheckingHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "detailingHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "detailCheckingHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "executionHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "executionCheckingHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mailReminder" BOOLEAN NOT NULL DEFAULT false,
    "submissionMailReminder" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "Stage" "Stage" NOT NULL DEFAULT 'IFA',
    "priority" INTEGER NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "project_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "start_date" TEXT NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "assigendlist" (
    "id" UUID NOT NULL,
    "approved_on" TIMESTAMP(3),
    "assigned_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved" BOOLEAN NOT NULL,
    "comment" TEXT NOT NULL DEFAULT ' ',
    "task_id" UUID NOT NULL,
    "assigned_by" UUID NOT NULL,
    "approved_by" UUID,
    "assigned_to" UUID NOT NULL,

    CONSTRAINT "assigendlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignes" (
    "id" UUID NOT NULL,
    "approved_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved" BOOLEAN NOT NULL DEFAULT true,
    "comment" TEXT NOT NULL DEFAULT '',
    "task_id" UUID NOT NULL,
    "assigned_by" UUID NOT NULL,
    "assigned_to" UUID NOT NULL,
    "approved_by" UUID,

    CONSTRAINT "assignes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "confirm" (
    "id" UUID NOT NULL,
    "approved_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT NOT NULL,
    "assigned_task_id" UUID NOT NULL,
    "assigned_by" UUID NOT NULL,
    "assigned_to" UUID NOT NULL,
    "approved_by" UUID NOT NULL,

    CONSTRAINT "confirm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" UUID NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" TEXT NOT NULL,
    "task_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "file" JSONB NOT NULL DEFAULT '[]',
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "acknowledgedTime" TIMESTAMP(3),

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submittals" (
    "id" UUID NOT NULL,
    "fabricator_id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" UUID NOT NULL,
    "recepient_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "Stage" "Stage" NOT NULL DEFAULT 'IFA',
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "files" JSONB[] DEFAULT ARRAY[]::JSONB[],

    CONSTRAINT "submittals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submittalsresponse" (
    "id" UUID NOT NULL,
    "files" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "reason" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "respondedAt" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "SubResStatus" NOT NULL DEFAULT 'NOT_APPROVED',
    "userId" UUID NOT NULL,
    "submittalsId" UUID NOT NULL,

    CONSTRAINT "submittalsresponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfi" (
    "id" UUID NOT NULL,
    "fabricator_id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" UUID NOT NULL,
    "recepient_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "files" JSONB[] DEFAULT ARRAY[]::JSONB[],

    CONSTRAINT "rfi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfiresponse" (
    "id" UUID NOT NULL,
    "files" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "responseState" "State" NOT NULL,
    "reason" TEXT NOT NULL DEFAULT '',
    "respondedAt" TEXT NOT NULL DEFAULT '',
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rfiId" UUID NOT NULL,

    CONSTRAINT "rfiresponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfq" (
    "id" UUID NOT NULL,
    "projectName" TEXT NOT NULL,
    "sender_id" UUID NOT NULL,
    "status" "RFQStatus" NOT NULL DEFAULT 'OPEN',
    "reason" TEXT DEFAULT '',
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "files" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recepient_id" UUID NOT NULL,

    CONSTRAINT "rfq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfqResponse" (
    "id" UUID NOT NULL,
    "files" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "description" TEXT NOT NULL DEFAULT '',
    "status" "RFQStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "rfqId" UUID NOT NULL,

    CONSTRAINT "rfqResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" UUID NOT NULL,
    "payload" JSONB NOT NULL,
    "delivered" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workinghour" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "task_id" UUID NOT NULL,
    "status" "WorkHourStatus" NOT NULL,
    "start" TIMESTAMP(3),
    "duration" INTEGER NOT NULL DEFAULT 0,
    "end" TIMESTAMP(3),

    CONSTRAINT "workinghour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "changeorder" (
    "id" UUID NOT NULL,
    "project" UUID NOT NULL,
    "recipients" UUID NOT NULL,
    "remarks" TEXT NOT NULL DEFAULT '',
    "status" "COSTATUS" NOT NULL DEFAULT 'NOT_REPLIED',
    "changeOrder" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT NOT NULL DEFAULT '',
    "reason" TEXT NOT NULL DEFAULT '',
    "sender" UUID NOT NULL,
    "files" JSONB NOT NULL DEFAULT '[]',
    "sentOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "changeorder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "changeordertable" (
    "id" UUID NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "referenceDoc" TEXT NOT NULL DEFAULT '',
    "elements" TEXT NOT NULL DEFAULT '',
    "QtyNo" INTEGER NOT NULL DEFAULT 0,
    "hours" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "CoId" UUID NOT NULL,

    CONSTRAINT "changeordertable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "COResponse" (
    "id" UUID NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL DEFAULT '',
    "CoId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "COResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobStudy" (
    "id" UUID NOT NULL,
    "QtyNo" INTEGER NOT NULL,
    "unitTime" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "execTime" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "projectId" UUID NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "jobStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wbsactivity" (
    "id" UUID NOT NULL,
    "type" "Activity" NOT NULL,
    "stage" "Stage" NOT NULL DEFAULT 'IFA',
    "name" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL DEFAULT '',
    "projectId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "totalQtyNo" INTEGER NOT NULL DEFAULT 0,
    "totalExecHr" INTEGER NOT NULL DEFAULT 0,
    "totalExecHrWithRework" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalCheckHr" INTEGER NOT NULL DEFAULT 0,
    "totalCheckHrWithRework" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "wbsactivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subTasks" (
    "id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "stage" "Stage" NOT NULL DEFAULT 'IFA',
    "unitTime" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "CheckUnitTime" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "QtyNo" INTEGER NOT NULL DEFAULT 0,
    "checkHr" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "execHr" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "parentTemplateKey" TEXT NOT NULL DEFAULT '',
    "projectID" UUID NOT NULL,
    "wbsactivityID" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subTasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "adminId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groupuser" (
    "id" UUID NOT NULL,
    "memberId" UUID NOT NULL,
    "groupId" UUID NOT NULL,

    CONSTRAINT "groupuser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" UUID NOT NULL,
    "content" TEXT,
    "contentCompressed" BYTEA,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" UUID NOT NULL,
    "receiverId" UUID,
    "groupId" UUID,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file" (
    "id" UUID NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAccess" TIMESTAMP(3),
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "projectId" UUID,
    "fabricatorId" UUID,
    "submittalsId" UUID,
    "submittalsResponseId" UUID,
    "rfiId" UUID,
    "rfiResponseId" UUID,
    "rfqId" UUID,
    "rfqResponseId" UUID,
    "CoId" UUID,
    "CoResponseId" UUID,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FabricatorUsers" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_FabricatorUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TaggedUsers" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_TaggedUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "department_name_key" ON "department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "team_name_key" ON "team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "project_name_key" ON "project"("name");

-- CreateIndex
CREATE UNIQUE INDEX "submittalsresponse_submittalsId_key" ON "submittalsresponse"("submittalsId");

-- CreateIndex
CREATE UNIQUE INDEX "rfiresponse_rfiId_key" ON "rfiresponse"("rfiId");

-- CreateIndex
CREATE UNIQUE INDEX "COResponse_CoId_key" ON "COResponse"("CoId");

-- CreateIndex
CREATE UNIQUE INDEX "subTasks_wbsactivityID_parentTemplateKey_stage_key" ON "subTasks"("wbsactivityID", "parentTemplateKey", "stage");

-- CreateIndex
CREATE UNIQUE INDEX "file_hash_key" ON "file"("hash");

-- CreateIndex
CREATE INDEX "_FabricatorUsers_B_index" ON "_FabricatorUsers"("B");

-- CreateIndex
CREATE INDEX "_TaggedUsers_B_index" ON "_TaggedUsers"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_department_fkey" FOREIGN KEY ("department") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_fabricatorId_fkey" FOREIGN KEY ("fabricatorId") REFERENCES "fabricators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fabricators" ADD CONSTRAINT "fabricators_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_managerID_fkey" FOREIGN KEY ("managerID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_departmentID_fkey" FOREIGN KEY ("departmentID") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_fabricatorID_fkey" FOREIGN KEY ("fabricatorID") REFERENCES "fabricators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_managerID_fkey" FOREIGN KEY ("managerID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accepttask" ADD CONSTRAINT "accepttask_fabricator_id_fkey" FOREIGN KEY ("fabricator_id") REFERENCES "fabricators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accepttask" ADD CONSTRAINT "accepttask_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accepttask" ADD CONSTRAINT "accepttask_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigendlist" ADD CONSTRAINT "assigendlist_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigendlist" ADD CONSTRAINT "assigendlist_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigendlist" ADD CONSTRAINT "assigendlist_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigendlist" ADD CONSTRAINT "assigendlist_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignes" ADD CONSTRAINT "assignes_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignes" ADD CONSTRAINT "assignes_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignes" ADD CONSTRAINT "assignes_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignes" ADD CONSTRAINT "assignes_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "confirm" ADD CONSTRAINT "confirm_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "confirm" ADD CONSTRAINT "confirm_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "confirm" ADD CONSTRAINT "confirm_assigned_task_id_fkey" FOREIGN KEY ("assigned_task_id") REFERENCES "assigendlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "confirm" ADD CONSTRAINT "confirm_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submittals" ADD CONSTRAINT "submittals_fabricator_id_fkey" FOREIGN KEY ("fabricator_id") REFERENCES "fabricators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submittals" ADD CONSTRAINT "submittals_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submittals" ADD CONSTRAINT "submittals_recepient_id_fkey" FOREIGN KEY ("recepient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submittals" ADD CONSTRAINT "submittals_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submittalsresponse" ADD CONSTRAINT "submittalsresponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submittalsresponse" ADD CONSTRAINT "submittalsresponse_submittalsId_fkey" FOREIGN KEY ("submittalsId") REFERENCES "submittals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfi" ADD CONSTRAINT "rfi_fabricator_id_fkey" FOREIGN KEY ("fabricator_id") REFERENCES "fabricators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfi" ADD CONSTRAINT "rfi_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfi" ADD CONSTRAINT "rfi_recepient_id_fkey" FOREIGN KEY ("recepient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfi" ADD CONSTRAINT "rfi_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfiresponse" ADD CONSTRAINT "rfiresponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfiresponse" ADD CONSTRAINT "rfiresponse_rfiId_fkey" FOREIGN KEY ("rfiId") REFERENCES "rfi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq" ADD CONSTRAINT "rfq_recepient_id_fkey" FOREIGN KEY ("recepient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq" ADD CONSTRAINT "rfq_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfqResponse" ADD CONSTRAINT "rfqResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfqResponse" ADD CONSTRAINT "rfqResponse_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "rfq"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workinghour" ADD CONSTRAINT "workinghour_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workinghour" ADD CONSTRAINT "workinghour_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "changeorder" ADD CONSTRAINT "changeorder_project_fkey" FOREIGN KEY ("project") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "changeorder" ADD CONSTRAINT "changeorder_recipients_fkey" FOREIGN KEY ("recipients") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "changeorder" ADD CONSTRAINT "changeorder_sender_fkey" FOREIGN KEY ("sender") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "changeordertable" ADD CONSTRAINT "changeordertable_CoId_fkey" FOREIGN KEY ("CoId") REFERENCES "changeorder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "COResponse" ADD CONSTRAINT "COResponse_CoId_fkey" FOREIGN KEY ("CoId") REFERENCES "changeorder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "COResponse" ADD CONSTRAINT "COResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobStudy" ADD CONSTRAINT "jobStudy_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wbsactivity" ADD CONSTRAINT "wbsactivity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subTasks" ADD CONSTRAINT "subTasks_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subTasks" ADD CONSTRAINT "subTasks_wbsactivityID_fkey" FOREIGN KEY ("wbsactivityID") REFERENCES "wbsactivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group" ADD CONSTRAINT "group_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupuser" ADD CONSTRAINT "groupuser_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupuser" ADD CONSTRAINT "groupuser_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_fabricatorId_fkey" FOREIGN KEY ("fabricatorId") REFERENCES "fabricators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_submittalsId_fkey" FOREIGN KEY ("submittalsId") REFERENCES "submittals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_submittalsResponseId_fkey" FOREIGN KEY ("submittalsResponseId") REFERENCES "submittalsresponse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_rfiId_fkey" FOREIGN KEY ("rfiId") REFERENCES "rfi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_rfiResponseId_fkey" FOREIGN KEY ("rfiResponseId") REFERENCES "rfiresponse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "rfq"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_rfqResponseId_fkey" FOREIGN KEY ("rfqResponseId") REFERENCES "rfqResponse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_CoId_fkey" FOREIGN KEY ("CoId") REFERENCES "changeorder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_CoResponseId_fkey" FOREIGN KEY ("CoResponseId") REFERENCES "COResponse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FabricatorUsers" ADD CONSTRAINT "_FabricatorUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "fabricators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FabricatorUsers" ADD CONSTRAINT "_FabricatorUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaggedUsers" ADD CONSTRAINT "_TaggedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaggedUsers" ADD CONSTRAINT "_TaggedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
