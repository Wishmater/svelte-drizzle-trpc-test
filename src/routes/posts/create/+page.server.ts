import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { PostInsertSchema } from '$lib/common/validations/post';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import { posts } from '$lib/server/db/schema/post';
import { route } from '$lib/ROUTES';
import * as v from 'valibot';
import { logger } from '$lib/common/logging';
import { type ToastMessage } from '$lib/common/util/toast_message';
import { redirectWithMessage } from '$lib/server/util/toast_message';
import { postTags } from '$lib/server/db/schema/tag';

export const load = (async () => {
	const tags = new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
		db.query.tags.findMany()
	);
	const form = await superValidate(
		{
			authorId: 1 // TODO 1 initialize with logged in user id (waiting for auth implementation)
		},
		valibot(PostInsertSchema),
		{
			errors: false
		}
	);
	return {
		form,
		tags
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, valibot(PostInsertSchema));
		if (!form.valid) {
			return fail(422, { form });
		}
		// TODO 3 we should validate that the post author is the same as logged in user (should be easy with an async val)

		const post = (await db.insert(posts).values(form.data).returning().execute())[0];
		// need to await the post insertion to get the id
		const tagsInsertData = form.data.tags.map((e) => {
			return { postId: post.id, tagId: e.id };
		});
		await db.insert(postTags).values(tagsInsertData).execute();

		const message: ToastMessage = {
			type: 'success',
			message: `Post created successfully.`
		};
		logger.log({
			level: 'trace',
			message: message.message
		});
		return redirectWithMessage(303, route('/posts'), cookies, message);
	}
} satisfies Actions;
