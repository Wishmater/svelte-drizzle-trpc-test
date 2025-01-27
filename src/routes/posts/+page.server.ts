import type { PageServerLoad } from './$types';
import { postsQuery } from '$lib/server/db/queries/post';

export const load = (async (event) => {
	// TODO 1 get userId and tagId from query params
	const posts = postsQuery.execute({
		userId: null,
		tagId: null
	});
	return {
		posts
	};
}) satisfies PageServerLoad;
