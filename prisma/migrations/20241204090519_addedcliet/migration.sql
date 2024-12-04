-- CreateTable
CREATE TABLE "client" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" VARCHAR(150),
    "f_name" VARCHAR(50) NOT NULL,
    "m_name" VARCHAR(50),
    "l_name" VARCHAR(50),
    "phone" VARCHAR(20) NOT NULL,
    "alt_phone" VARCHAR(20),
    "designation" VARCHAR(50) NOT NULL,
    "address" VARCHAR(150),
    "city" VARCHAR(50),
    "state" VARCHAR(50),
    "country" VARCHAR(50),
    "zip_code" VARCHAR(10),
    "role" "UserRole" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_staff" BOOLEAN NOT NULL DEFAULT false,
    "is_superuser" BOOLEAN NOT NULL DEFAULT false,
    "is_firstLogin" BOOLEAN NOT NULL DEFAULT true,
    "fabricatorId" UUID NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_username_key" ON "client"("username");

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_fabricatorId_fkey" FOREIGN KEY ("fabricatorId") REFERENCES "fabricators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
