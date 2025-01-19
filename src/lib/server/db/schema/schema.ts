import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from "drizzle-orm";
import { type Roles, userTypes } from '../../../common/models/enums'; // $lib imports break drizzle-kit :((, maybe prefer to just declare unions here
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
	role: integer('role').$type<Roles>().notNull(), // this doesn't really work because it is exported as a number in valibot types, prefer doing these as string unions
	type: text('type', {enum: userTypes}).notNull(),
	selectedDate: integer('selectedDate', {mode: 'timestamp'}).notNull().$type<Date>(),
	createdAt: integer('createdAt', {mode: 'timestamp_ms'}).notNull().$type<Date>().default(sql`(select CURRENT_TIMESTAMP)`),
});


// Create Valibot schema from DB declaration:
// https://orm.drizzle.team/docs/valibot
export const UserSelectSchema = createSelectSchema(users, {
	email: (e) => v.pipe(e, v.email()),
});

export type User = v.InferOutput<typeof UserSelectSchema>;
