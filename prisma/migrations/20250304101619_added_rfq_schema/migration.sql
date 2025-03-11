-- CreateTable
CREATE TABLE "rfq" (
    "id" UUID NOT NULL,
    "projectName" TEXT NOT NULL,
    "recepient_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "files" JSONB[] DEFAULT ARRAY[]::JSONB[],

    CONSTRAINT "rfq_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rfq" ADD CONSTRAINT "rfq_recepient_id_fkey" FOREIGN KEY ("recepient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq" ADD CONSTRAINT "rfq_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
