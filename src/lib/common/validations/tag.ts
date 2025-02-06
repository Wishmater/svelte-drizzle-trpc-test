import * as v from 'valibot';
import type { Tag, TagDetails, TagInsert } from '$lib/server/db/schema/tag';
import { initCustomErrorMessages } from '$lib/common/validations/_valibot';

initCustomErrorMessages(); // must be called on every validation file to ensure it is imported, will only run once

export const TagDetailsSchema = v.object({
	id: v.optional(v.number()),
	detailNumber: v.optional(v.number()),
	detailText: v.optional(v.string())
});

export const TagSchema = v.object({
	id: v.number(),
	name: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.maxLength(64)),
	createdAt: v.date(),
	details: v.array(TagDetailsSchema)
}) satisfies v.GenericSchema<Tag>;

export const TagInsertSchema = v.omit(TagSchema, [
	'id',
	'createdAt'
]) satisfies v.GenericSchema<TagInsert>;

export const TagMinimalSchema = v.pick(TagSchema, ['id', 'name']);
export type TagMinimal = v.InferOutput<typeof TagMinimalSchema>;
