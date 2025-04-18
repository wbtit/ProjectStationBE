/*
  Warnings:

  - You are about to drop the column `taggedUsers` on the `message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "message" DROP COLUMN "taggedUsers";

-- CreateTable
CREATE TABLE "_TaggedUsers" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TaggedUsers_AB_unique" ON "_TaggedUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_TaggedUsers_B_index" ON "_TaggedUsers"("B");

-- AddForeignKey
ALTER TABLE "_TaggedUsers" ADD CONSTRAINT "_TaggedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaggedUsers" ADD CONSTRAINT "_TaggedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
