import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';
import * as v from 'valibot';
import { userTypes } from '../../../common/enums/user_types'; // using $lib breaks drizzle-kit :((
import { timestampColumns } from '../util';
import { relations } from 'drizzle-orm';
import { posts } from './post';

// Drizzle ORM schema declaration useful links:
// https://orm.drizzle.team/docs/sql-schema-declaration
// https://orm.drizzle.team/docs/column-types/sqlite
// https://orm.drizzle.team/docs/relations

export const users = sqliteTable('user', {
	id: integer().primaryKey({ autoIncrement: true }),
	username: text().notNull().unique(),
	email: text().notNull().unique(),
	password: text().notNull(),
	age: integer().notNull(),
	active: integer({ mode: 'boolean' }).notNull().default(true),
	type: text({ enum: userTypes }).notNull(),
	// type: integer().$type<UserType>().notNull(), // this doesn't really work because it is exported as a number in types, prefer doing these as string unions
	selectedDate: integer({ mode: 'timestamp' }).$type<Date>(),
	...timestampColumns
});

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts)
}));

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
