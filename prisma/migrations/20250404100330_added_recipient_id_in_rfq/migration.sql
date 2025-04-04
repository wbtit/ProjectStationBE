/*
  Warnings:

  - Added the required column `recepient_id` to the `rfq` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rfq" ADD COLUMN     "recepient_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "rfq" ADD CONSTRAINT "rfq_recepient_id_fkey" FOREIGN KEY ("recepient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
