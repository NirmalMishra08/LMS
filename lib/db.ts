// File: lib/db.ts or utils/db.ts
import { PrismaClient } from '@/lib/generated/prisma';

// ✅ This is a type-only declaration (okay to use var here)
declare global {
  var prisma: PrismaClient | undefined;
}

// ✅ Actual logic
const prismaClient = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prismaClient;
}

export const db = prismaClient;

