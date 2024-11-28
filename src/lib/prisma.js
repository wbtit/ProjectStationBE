// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Create a single instance of Prisma Client
const prisma = new PrismaClient();

// Export the instance to be used globally
export default prisma;
