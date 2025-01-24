import { integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const timestampColumns = {
	createdAt: integer({ mode: 'timestamp_ms' })
		.$type<Date>()
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
};
