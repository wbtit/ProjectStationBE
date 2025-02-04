/*
  Warnings:

  - The values [RJFC] on the enum `Stage` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Stage_new" AS ENUM ('RFI', 'IFA', 'BFA', 'BFA_M', 'RIFA', 'RBFA', 'IFC', 'BFC', 'RIFC', 'REV', 'CO', 'COMPLETED');
ALTER TABLE "project" ALTER COLUMN "stage" DROP DEFAULT;
ALTER TABLE "project" ALTER COLUMN "stage" TYPE "Stage_new" USING ("stage"::text::"Stage_new");
ALTER TYPE "Stage" RENAME TO "Stage_old";
ALTER TYPE "Stage_new" RENAME TO "Stage";
DROP TYPE "Stage_old";
ALTER TABLE "project" ALTER COLUMN "stage" SET DEFAULT 'RFI';
COMMIT;

-- AlterEnum
ALTER TYPE "Tools" ADD VALUE 'PEMB';
