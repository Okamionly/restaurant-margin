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
  //
  // FIX 2026-09-24 : cet appel etait inconditionnel et faisait tomber 24 tests
  // sur 93. Les suites unitaires remplacent @prisma/client par une classe
  // PrismaClient factice qui n'expose que les modeles dont elles ont besoin, sans
  // `$on` — or ce module instancie le client des l'import, donc tout test
  // important middleware.ts explosait sur "client.$on is not a function".
  // Le defaut vivait depuis des mois sans etre vu, parce que `npm ci` echouait en
  // amont dans le CI : les tests ne s'executaient tout simplement plus.
  //
  // On garde la sonde optionnelle plutot que de rustiner chaque mock : un
  // journal de requetes lentes est un confort d'observabilite, il n'a aucune
  // raison d'empecher le client de se construire. Ainsi un mock, ou un futur
  // changement d'API Prisma, degrade l'observabilite sans casser l'application.
  if (typeof (client as any).$on === 'function') {
    client.$on('query', (e: Prisma.QueryEvent) => {
      if (e.duration >= 200) {
        console.warn(`SLOW_QUERY ${e.duration}ms | ${e.query.slice(0, 120)}`);
      }
    });
  }

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export { Prisma };
