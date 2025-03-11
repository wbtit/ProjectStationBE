-- CreateTable
CREATE TABLE "jobStudy" (
    "id" UUID NOT NULL,
    "QtyNo" INTEGER NOT NULL,
    "unitTime" INTEGER NOT NULL DEFAULT 0,
    "execTime" INTEGER NOT NULL DEFAULT 0,
    "projectId" UUID NOT NULL,

    CONSTRAINT "jobStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taskBreakDown" (
    "id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "QtyNo" INTEGER NOT NULL DEFAULT 0,
    "execTime" INTEGER NOT NULL DEFAULT 0,
    "checkingHour" INTEGER NOT NULL DEFAULT 0,
    "jobstudyId" UUID NOT NULL,

    CONSTRAINT "taskBreakDown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subTasks" (
    "id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "Qty" INTEGER NOT NULL,
    "unitTime" INTEGER NOT NULL DEFAULT 0,
    "CheckUnitTime" INTEGER NOT NULL DEFAULT 0,
    "taskBreakDownid" UUID NOT NULL,

    CONSTRAINT "subTasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "jobStudy" ADD CONSTRAINT "jobStudy_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taskBreakDown" ADD CONSTRAINT "taskBreakDown_jobstudyId_fkey" FOREIGN KEY ("jobstudyId") REFERENCES "jobStudy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subTasks" ADD CONSTRAINT "subTasks_taskBreakDownid_fkey" FOREIGN KEY ("taskBreakDownid") REFERENCES "taskBreakDown"("id") ON DELETE CASCADE ON UPDATE CASCADE;
