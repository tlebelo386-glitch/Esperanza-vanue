import { attachDatabasePool } from "@vercel/functions";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/lib/availability-schema";

interface AvailabilityDatabaseState {
  pool?: Pool;
  db?: NodePgDatabase<typeof schema>;
  connectionString?: string;
}

const globalForAvailability = globalThis as typeof globalThis & {
  availabilityDatabase?: AvailabilityDatabaseState;
};

export function getAvailabilityDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || !/^postgres(?:ql)?:\/\//i.test(connectionString)) {
    throw new Error("A PostgreSQL DATABASE_URL is required for venue availability.");
  }

  const existing = globalForAvailability.availabilityDatabase;
  if (existing?.db && existing.connectionString === connectionString) return existing.db;

  const pool = new Pool({ connectionString, max: 5, idleTimeoutMillis: 30_000 });
  attachDatabasePool(pool);
  const db = drizzle(pool, { schema });
  globalForAvailability.availabilityDatabase = { pool, db, connectionString };
  return db;
}
