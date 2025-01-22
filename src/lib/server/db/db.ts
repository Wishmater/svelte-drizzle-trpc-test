import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';
import * as schema from '$lib/server/db/schema/schema';
import { users } from '$lib/server/db/schema/schema';

// using drizzle ORM with SQLite for db management.
// https://orm.drizzle.team/docs/get-started-sqlite

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = createClient({ url: env.DATABASE_URL });

export const db = drizzle(client, {
	schema: {
		...schema
	}
});

// TODO find a better way to do db data initialization
if ((await db.$count(users)) == 0) {
	await db
		.insert(users)
		.values({
			username: 'admin',
			password: 'admin.123',
			email: 'admin@fromzero.com',
			age: 69420,
			type: 'Admin'
		})
		.execute();
}
