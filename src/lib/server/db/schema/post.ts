import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';
import * as v from 'valibot';
import { users } from './user';
import { timestampColumns } from '../util';
import { relations } from 'drizzle-orm';
import { postTags } from './tag';

export const posts = sqliteTable('post', {
	id: integer().primaryKey({ autoIncrement: true }),
	authorId: integer()
		.notNull()
		.references(() => users.id),
	content: text().notNull(),
	...timestampColumns
});

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id]
	}),
	postTags: many(postTags)
}));

const PostSchema = createSelectSchema(posts);
export type Post = v.InferOutput<typeof PostSchema>;

const PostInsertSchema = createInsertSchema(posts);
export type PostInsert = v.InferOutput<typeof PostInsertSchema>;
