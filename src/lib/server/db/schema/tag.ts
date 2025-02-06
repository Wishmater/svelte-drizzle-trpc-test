import { sqliteTable, text, integer, real, primaryKey } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';
import * as v from 'valibot';
import { timestampColumns } from '../util';
import { posts } from './post';
import { relations } from 'drizzle-orm';

export const tags = sqliteTable('tag', {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	...timestampColumns
});

export const tagsRelations = relations(tags, ({ many }) => ({
	tagPosts: many(postTags),
	details: many(tagDetails)
}));

export const postTags = sqliteTable(
	'postTags',
	{
		postId: integer()
			.notNull()
			.references(() => posts.id),
		tagId: integer()
			.notNull()
			.references(() => tags.id)
	},
	(t) => [primaryKey({ columns: [t.postId, t.tagId] })]
);

export const postsTagsRelations = relations(postTags, ({ one }) => ({
	posts: one(posts, {
		fields: [postTags.postId],
		references: [posts.id]
	}),
	tags: one(tags, {
		fields: [postTags.tagId],
		references: [tags.id]
	})
}));

const TagSchema = createSelectSchema(tags);
export type Tag = v.InferOutput<typeof TagSchema>;

const TagInsertSchema = createInsertSchema(tags);
export type TagInsert = v.InferOutput<typeof TagInsertSchema>;

const TagUpdateSchema = createUpdateSchema(tags);
export type TagUpdate = v.InferOutput<typeof TagUpdateSchema>;

export const tagDetails = sqliteTable('tagDetails', {
	id: integer().primaryKey({ autoIncrement: true }),
	tagId: integer()
		.notNull()
		.references(() => tags.id),
	detailNumber: real(),
	detailText: text()
});

export const tagDetailsRelations = relations(tagDetails, ({ one }) => ({
	tag: one(tags, {
		fields: [tagDetails.tagId],
		references: [tags.id]
	})
}));

const TagDetailsSchema = createSelectSchema(tagDetails);
export type TagDetails = v.InferOutput<typeof TagDetailsSchema>;

const TagDetailsInsertSchema = createInsertSchema(tagDetails);
export type TagDetailsInsert = v.InferOutput<typeof TagDetailsInsertSchema>;

const TagDetailsUpdateSchema = createUpdateSchema(tagDetails);
export type TagDetailsUpdate = v.InferOutput<typeof TagDetailsUpdateSchema>;
