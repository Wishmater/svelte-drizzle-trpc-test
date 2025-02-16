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
import { requireLogin } from '$server/auth/authorization';

export const load = (async (event) => {
	await requireLogin(event);
	const tags = new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
		db.query.tags.findMany()
	);
	const form = await superValidate(
		{
			authorId: event.locals.user!.id
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
	default: async (event) => {
		await requireLogin(event);
		const form = await superValidate(event.request, valibot(PostInsertSchema));
		if (!form.valid) {
			return fail(422, { form });
		}
		form.data.authorId = event.locals.user!.id;

		const post = (await db.insert(posts).values(form.data).returning().execute())[0];
		// need to await the post insertion to get the id
		if (form.data.tags.length) {
			const tagsInsertData = form.data.tags.map((e) => {
				return { postId: post.id, tagId: e.id };
			});
			await db.insert(postTags).values(tagsInsertData).execute();
		}

		const message: ToastMessage = {
			type: 'success',
			message: `Post created successfully.`
		};
		logger.log({
			level: 'trace',
			message: message.message
		});
		return redirectWithMessage(303, route('/posts'), event.cookies, message);
	}
} satisfies Actions;
