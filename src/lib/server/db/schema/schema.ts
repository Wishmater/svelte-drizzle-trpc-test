import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from "drizzle-orm";
import { type Roles, userTypes } from '../../../common/models/enums';
import { createSelectSchema } from 'drizzle-valibot'; // $lib imports break drizzle-kit :((


// Drizzle ORM schema declaration useful links:
// https://orm.drizzle.team/docs/sql-schema-declaration
// https://orm.drizzle.team/docs/column-types/sqlite
// https://orm.drizzle.team/docs/relations


export const users = sqliteTable('user', {
	id: integer('id').primaryKey({autoIncrement: true}),
	username: text('username').unique(),
	email: text('email').unique(),
	age: integer('age'),
	active: integer('active', {mode: 'boolean'}),
	role: integer('role').$type<Roles>(),
	type: text('type', {enum: userTypes}),
	selectedDate: integer('selectedDate', {mode: 'timestamp'}),
	createdAt: integer('createdAt', {mode: 'timestamp_ms'}).default(sql`(CURRENT_TIMESTAMP)`),
});


// Create Valibot schema from DB declaration:
// https://orm.drizzle.team/docs/valibot
export const userSelectSchema = createSelectSchema(users);
