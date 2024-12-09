/*
  Warnings:

  - You are about to drop the column `city` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `zip_code` on the `client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "client" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "state",
DROP COLUMN "zip_code",
ADD COLUMN     "alt_landline" VARCHAR(20),
ADD COLUMN     "landline" VARCHAR(20),
ALTER COLUMN "address" SET DATA TYPE TEXT;
