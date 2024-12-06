/*
  Warnings:

  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_managerID_fkey";

-- DropTable
DROP TABLE "Team";

-- CreateTable
CREATE TABLE "team" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "managerID" UUID NOT NULL,
    "members" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "team_name_key" ON "team"("name");

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_managerID_fkey" FOREIGN KEY ("managerID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
