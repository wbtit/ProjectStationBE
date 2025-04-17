/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropTable
DROP TABLE "Message";

-- CreateTable
CREATE TABLE "message" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" UUID NOT NULL,
    "receiverId" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "taggedUsers" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
