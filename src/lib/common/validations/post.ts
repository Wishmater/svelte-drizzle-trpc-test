import * as v from 'valibot';
import type { Post, PostInsert } from '$lib/server/db/schema/post';
import { initCustomErrorMessages } from '$lib/common/validations/_valibot';
import { TagMinimalSchema, TagSchema } from '$lib/common/validations/tag';

initCustomErrorMessages(); // must be called on every validation file to ensure it is imported, will only run once

export const PostSchema = v.object({
	id: v.number(),
	authorId: v.number(),
	content: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.maxLength(255)),
	createdAt: v.date(),
	tags: v.array(TagMinimalSchema)
}) satisfies v.GenericSchema<Post>;

export const PostInsertSchema = v.omit(PostSchema, [
	'id',
	'createdAt'
]) satisfies v.GenericSchema<PostInsert>;
