/*
  Warnings:

  - The `role` column on the `client` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `address` on table `client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `zip_code` on table `client` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "client" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "zip_code" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'CLIENT';
