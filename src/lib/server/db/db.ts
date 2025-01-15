import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';

// using drizzle ORM with SQLite for db management.
// https://orm.drizzle.team/docs/get-started-sqlite

// !!! move to queries
// https://orm.drizzle.team/docs/rqb

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = createClient({ url: env.DATABASE_URL });

export const db = drizzle(client);
