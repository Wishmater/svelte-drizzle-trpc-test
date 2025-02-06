import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/db';

export const load = (async (event) => {
	const tags = db.query.tags.findMany({
		with: {
			details: {
				columns: {
					id: false,
					tagId: false
				}
			}
		},
		orderBy: (t) => t.name
	});
	return {
		tags
	};
}) satisfies PageServerLoad;
