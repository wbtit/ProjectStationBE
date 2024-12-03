-- CreateTable
CREATE TABLE "department" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "managerId" UUID,
    "isBin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "department_name_key" ON "department"("name");

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
