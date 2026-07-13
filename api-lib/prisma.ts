/**
 * Prisma Client singleton — prevents connection pool exhaustion on Vercel serverless.
 *
 * Problem: each `new PrismaClient()` opens a new DB connection. Vercel cold starts
 * can spin up multiple module instances concurrently; without a singleton, this
 * exhausts Supabase Free's ~60 connection pool under load.
 *
 * Pattern: attach the client to globalThis in dev (survives HMR) and reuse a
 * single instance in production.
 *
 * Usage:
 *   import { prisma } from '../prisma';
 *
 * Also re-exports Prisma namespace for tagged-template raw queries:
 *   import { prisma, Prisma } from '../prisma';
 *   await prisma.$queryRaw`SELECT ... WHERE id = ${id}`;
 */

import { PrismaClient, Prisma } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'stdout', level: 'error' },
      ...(process.env.NODE_ENV !== 'production' ? [{ emit: 'stdout' as const, level: 'warn' as const }] : []),
    ],
  });

  // Log queries slower than 200ms — helps identify Prisma/Supabase bottlenecks.
  client.$on('query', (e: Prisma.QueryEvent) => {
    if (e.duration >= 200) {
      console.warn(`SLOW_QUERY ${e.duration}ms | ${e.query.slice(0, 120)}`);
    }
  });

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export { Prisma };
