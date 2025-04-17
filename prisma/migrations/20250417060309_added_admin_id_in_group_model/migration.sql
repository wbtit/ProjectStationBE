/*
  Warnings:

  - You are about to drop the column `memberId` on the `group` table. All the data in the column will be lost.
  - Added the required column `adminId` to the `group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "group" DROP COLUMN "memberId",
ADD COLUMN     "adminId" UUID NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "group" ADD CONSTRAINT "group_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
