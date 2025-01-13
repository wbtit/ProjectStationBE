-- CreateTable
CREATE TABLE "submittals" (
    "id" UUID NOT NULL,
    "fabricator_id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" UUID NOT NULL,
    "recepient_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "files" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "submittals_pkey" PRIMARY KEY ("id")
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
    "files" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "rfi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "submittals" ADD CONSTRAINT "submittals_fabricator_id_fkey" FOREIGN KEY ("fabricator_id") REFERENCES "fabricators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submittals" ADD CONSTRAINT "submittals_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submittals" ADD CONSTRAINT "submittals_recepient_id_fkey" FOREIGN KEY ("recepient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submittals" ADD CONSTRAINT "submittals_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfi" ADD CONSTRAINT "rfi_fabricator_id_fkey" FOREIGN KEY ("fabricator_id") REFERENCES "fabricators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfi" ADD CONSTRAINT "rfi_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfi" ADD CONSTRAINT "rfi_recepient_id_fkey" FOREIGN KEY ("recepient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfi" ADD CONSTRAINT "rfi_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
