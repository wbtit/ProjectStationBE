/*
  Warnings:

  - You are about to drop the column `recepient_id` on the `rfq` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "rfq" DROP CONSTRAINT "rfq_recepient_id_fkey";

-- AlterTable
ALTER TABLE "rfq" DROP COLUMN "recepient_id";
