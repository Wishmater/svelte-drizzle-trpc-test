import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private'; // importing $env doesn't work with drizzle-kit, so we must use node .env :((
import * as userSchema from './schema/user';
import * as postSchema from './schema/post';
import * as tagSchema from './schema/tag';

// using drizzle ORM with SQLite for db management.
// https://orm.drizzle.team/docs/get-started-sqlite

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = createClient({ url: env.DATABASE_URL });

export const db = drizzle(client, {
	schema: {
		...userSchema,
		...postSchema,
		...tagSchema
	}
});
