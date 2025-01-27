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

export const load = (async () => {
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
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, valibot(PostInsertSchema));
		if (!form.valid) {
			return fail(422, { form });
		}
		// TODO 3 we should validate that the post author is the same as logged in user (should be easy with an async val)

		console.log(form.data);
		await db.insert(posts).values(form.data).execute();

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
