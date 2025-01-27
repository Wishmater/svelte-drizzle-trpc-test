import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/db';

export const load = (async (event) => {
	const tags = db.query.tags.findMany({
		orderBy: (t) => t.name
	});
	return {
		tags
	};
}) satisfies PageServerLoad;
