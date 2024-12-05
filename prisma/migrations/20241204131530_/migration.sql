/*
  Warnings:

  - You are about to drop the `client` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[fabricatorId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "client" DROP CONSTRAINT "client_fabricatorId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT DEFAULT 'Old',
ADD COLUMN     "alt_landline" VARCHAR(20) DEFAULT 'Old',
ADD COLUMN     "alt_phone" VARCHAR(20) DEFAULT 'Old',
ADD COLUMN     "city" TEXT DEFAULT 'Old',
ADD COLUMN     "country" TEXT DEFAULT 'Old',
ADD COLUMN     "designation" VARCHAR(50) NOT NULL DEFAULT 'Old',
ADD COLUMN     "fabricatorId" UUID,
ADD COLUMN     "landline" VARCHAR(20) DEFAULT 'Old',
ADD COLUMN     "state" TEXT DEFAULT 'Old',
ADD COLUMN     "zip_code" TEXT DEFAULT 'Old';

-- DropTable
DROP TABLE "client";

-- CreateTable
CREATE TABLE "_FabricatorUsers" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FabricatorUsers_AB_unique" ON "_FabricatorUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_FabricatorUsers_B_index" ON "_FabricatorUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "users_fabricatorId_key" ON "users"("fabricatorId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_fabricatorId_fkey" FOREIGN KEY ("fabricatorId") REFERENCES "fabricators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FabricatorUsers" ADD CONSTRAINT "_FabricatorUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "fabricators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FabricatorUsers" ADD CONSTRAINT "_FabricatorUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
