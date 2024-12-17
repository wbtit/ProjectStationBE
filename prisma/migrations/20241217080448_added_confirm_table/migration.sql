-- AlterTable
ALTER TABLE "assigendlist" ADD COLUMN     "comment" TEXT NOT NULL DEFAULT ' ';

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

-- AddForeignKey
ALTER TABLE "confirm" ADD CONSTRAINT "confirm_assigned_task_id_fkey" FOREIGN KEY ("assigned_task_id") REFERENCES "assigendlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "confirm" ADD CONSTRAINT "confirm_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "confirm" ADD CONSTRAINT "confirm_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "confirm" ADD CONSTRAINT "confirm_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
