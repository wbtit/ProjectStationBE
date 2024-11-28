-- DropTable
DROP TABLE IF EXISTS "fabricators";
DROP TABLE IF EXISTS "users";

-- Create users table
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" VARCHAR(150),
    "f_name" VARCHAR(50) NOT NULL,
    "m_name" VARCHAR(50),
    "l_name" VARCHAR(50),
    "phone" VARCHAR(20) NOT NULL,
    "role" "UserRole" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_staff" BOOLEAN NOT NULL DEFAULT false,
    "is_superuser" BOOLEAN NOT NULL DEFAULT false,
    "is_firstLogin" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create fabricators table
CREATE TABLE "fabricators" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdById" UUID NOT NULL,  -- Change TEXT to UUID here
    "fabDetails" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fabricators_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "fabricators_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "fabricators_id_key" ON "fabricators"("id");
