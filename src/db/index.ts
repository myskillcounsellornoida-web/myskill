import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// We initialize the db client lazily so that process.env.DATABASE_URL
// is guaranteed to be loaded by Next.js before we try to connect.
let dbInstance: ReturnType<typeof drizzle> | null = null;

export const getDb = () => {
  if (!dbInstance) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not defined in the environment.");
    }
    const client = postgres(connectionString, { prepare: false });
    dbInstance = drizzle(client, { schema });
  }
  return dbInstance;
};

type DbType = ReturnType<typeof drizzle<typeof schema>>;

// Use a Proxy so we don't have to rewrite every import { db } from '@/db'
export const db = new Proxy({} as DbType, {
  get: (_, prop: string) => {
    const instance = getDb() as any;
    const value = instance[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  }
}) as DbType;
