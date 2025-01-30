import type { PageServerLoad } from './$types';
import { postsQuery } from '$lib/server/db/queries/post';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import { posts } from '$lib/server/db/schema/post';
import type { ToastMessage } from '$lib/common/util/toast_message';
import { logger } from '$lib/common/logging';
import { redirectWithMessage } from '$lib/server/util/toast_message';
import { route } from '$lib/ROUTES';
import type { Actions } from '../../../.svelte-kit/types/src/routes/tags/create/$types';
import { DeletePostData } from '$lib/server/validations/_route_params';
import { eq } from 'drizzle-orm';

export const load = (async (event) => {
	// TODO 1 get userId and tagId from query params
	console.log(postsQuery.getQuery().sql);
	const posts = postsQuery.execute({
		userId: null,
		tagId: null
	});
	return {
		posts
	};
}) satisfies PageServerLoad;

export const actions = {
	delete: async ({ request, cookies }) => {
		const form = await superValidate(request, valibot(DeletePostData));
		if (!form.valid) {
			return fail(422, { form });
		}

		await db.delete(posts).where(eq(posts.id, form.data.id));

		const message: ToastMessage = {
			type: 'success',
			message: `Post deleted successfully.`
		};
		logger.log({
			level: 'trace',
			message: message.message
		});
		return redirectWithMessage(303, route('/posts'), cookies, message);
	}
} satisfies Actions;
