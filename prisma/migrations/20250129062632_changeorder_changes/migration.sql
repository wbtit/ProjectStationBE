/*
  Warnings:

  - Added the required column `sender` to the `changeorder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "changeorder" ADD COLUMN     "sender" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "changeorder" ADD CONSTRAINT "changeorder_sender_fkey" FOREIGN KEY ("sender") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
