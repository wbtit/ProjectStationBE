-- CreateTable
CREATE TABLE "Team" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "managerID" UUID NOT NULL,
    "members" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_managerID_fkey" FOREIGN KEY ("managerID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
