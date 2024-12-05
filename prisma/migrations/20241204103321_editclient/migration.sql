-- AlterTable
ALTER TABLE "client" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "zip_code" TEXT,
ALTER COLUMN "address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "fabricators" ADD COLUMN     "is_bin" BOOLEAN NOT NULL DEFAULT true;
