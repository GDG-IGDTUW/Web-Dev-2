// const { PrismaClient } = require('@prisma/client')

// export const prisma = new PrismaClient()
// lib/prisma.ts

//lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const db = prisma;

export default prisma;