import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';
import * as v from 'valibot';
import { userTypes } from '../../../common/enums/user_types'; // using $lib breaks drizzle-kit :((

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
	// type: integer('type').$type<UserType>().notNull(), // this doesn't really work because it is exported as a number in types, prefer doing these as string unions
	selectedDate: integer('selectedDate', { mode: 'timestamp' }).$type<Date>(),
	createdAt: integer('createdAt', { mode: 'timestamp_ms' })
		.$type<Date>()
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
});

// Create Valibot schema from DB declaration:
// https://orm.drizzle.team/docs/valibot
// we can't use this directly in the client, so we still have to declare the Valibot schema separately,
// but at least this way TS will validate that the types match
const UserSchema = createSelectSchema(users);
export type User = v.InferOutput<typeof UserSchema>;

const UserInsertSchema = createInsertSchema(users);
export type UserInsert = v.InferOutput<typeof UserInsertSchema>;

const UserUpdateSchema = createUpdateSchema(users);
export type UserUpdate = v.InferOutput<typeof UserUpdateSchema>;
