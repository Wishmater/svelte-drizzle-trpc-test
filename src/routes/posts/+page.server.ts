import type { PageServerLoad } from './$types';
import { postsQuery } from '$lib/server/db/queries/post';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import { posts } from '$lib/server/db/schema/post';
import type { ToastMessage } from '$lib/common/util/toast_message';
import { logger } from '$lib/common/logging';
import { redirectWithMessage } from '$lib/server/util/toast_message';
import { route } from '$lib/ROUTES';
import type { Actions } from '../../../.svelte-kit/types/src/routes/tags/create/$types';
import {
	DeletePostData,
	getAllQueryParams,
	getErrorMessage,
	ParseObjectSchema
} from '$lib/server/validations/_route_params';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';
import { TagMinimalSchema } from '$lib/common/validations/tag';
import { UserMinimalSchema } from '$lib/common/validations/user';

const QueryParamsSchema = v.object({
	tag: v.optional(v.pipe(ParseObjectSchema, TagMinimalSchema)),
	user: v.optional(v.pipe(ParseObjectSchema, UserMinimalSchema))
});
export type QueryParams = v.InferOutput<typeof QueryParamsSchema>;

export const load = (async ({ url }) => {
	const queryParams = v.safeParse(QueryParamsSchema, getAllQueryParams(url));
	if (!queryParams.success) return error(400, { message: getErrorMessage(queryParams) });
	const { tag, user } = queryParams.output;

	let posts = postsQuery.execute({
		userId: user?.id ?? null,
		tagId: tag?.id ?? null
	});
	if (tag) {
		// sadly drizzle queries are not that good for nested filters,
		// for now, we're just filtering in JS,
		// for good performance, we would need to rewrite the query in SQL
		// new drizzle version apparently improves query API to solve this, but not out yet...
		posts = posts.then((e) => {
			return e.filter((e) => {
				return e.postTags.some((e) => {
					return e.tagId == tag.id;
				});
			});
		});
	}
	const tags = db.query.tags
		.findMany({
			columns: {
				id: true,
				name: true
			}
		})
		.execute();
	return {
		posts,
		tags
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
