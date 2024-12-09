/*
  Warnings:

  - The `stage` column on the `project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('RFI', 'IFA', 'BFA', 'BFA_M', 'RIFA', 'RBFA', 'IFC', 'BFC', 'RJFC', 'REV', 'CO');

-- CreateEnum
CREATE TYPE "Tools" AS ENUM ('TEKLA', 'SDS2');

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "tools" "Tools" NOT NULL DEFAULT 'TEKLA',
DROP COLUMN "stage",
ADD COLUMN     "stage" "Stage" NOT NULL DEFAULT 'RFI';

-- DropEnum
DROP TYPE "stage";
