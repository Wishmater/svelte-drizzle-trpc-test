import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from "drizzle-orm";
import { type Roles, userTypes } from '../../../common/models/enums'; // $lib imports break drizzle-kit :((
import { createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';


// Drizzle ORM schema declaration useful links:
// https://orm.drizzle.team/docs/sql-schema-declaration
// https://orm.drizzle.team/docs/column-types/sqlite
// https://orm.drizzle.team/docs/relations


export const users = sqliteTable('user', {
	id: integer('id').primaryKey({autoIncrement: true}),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	age: integer('age').notNull(),
	active: integer('active', {mode: 'boolean'}).notNull(),
	role: integer('role').$type<Roles>().notNull(),
	type: text('type', {enum: userTypes}).notNull(),
	selectedDate: integer('selectedDate', {mode: 'timestamp'}).notNull(),
	createdAt: integer('createdAt', {mode: 'timestamp_ms'}).notNull().default(sql`(CURRENT_TIMESTAMP)`),
});


// Create Valibot schema from DB declaration:
// https://orm.drizzle.team/docs/valibot
export const UserSelectSchema = createSelectSchema(users);

export type User = v.InferOutput<typeof UserSelectSchema>;
