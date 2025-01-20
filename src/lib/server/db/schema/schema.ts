import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';
import * as v from 'valibot';

export const userTypes = ['Type 1', 'Type 2', 'Type 3'] as const;
export type UserType = (typeof userTypes)[number];

// Drizzle ORM schema declaration useful links:
// https://orm.drizzle.team/docs/sql-schema-declaration
// https://orm.drizzle.team/docs/column-types/sqlite
// https://orm.drizzle.team/docs/relations

export const users = sqliteTable('user', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	age: integer('age').notNull(),
	active: integer('active', { mode: 'boolean' }).notNull().default(true),
	type: text('type', { enum: userTypes }).notNull(),
	selectedDate: integer('selectedDate', { mode: 'timestamp' }).$type<Date>(),
	createdAt: integer('createdAt', { mode: 'timestamp_ms' })
		.$type<Date>()
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
});

// Create Valibot schema from DB declaration:
// https://orm.drizzle.team/docs/valibot
export const UserSelectSchema = createSelectSchema(users);

export const UserInsertSchema = createInsertSchema(users, {
	email: (e) => v.pipe(e, v.email())
});

export type User = v.InferOutput<typeof UserSelectSchema>;

export type UserInsert = v.InferOutput<typeof UserInsertSchema>;
