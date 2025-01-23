import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/db';
import type { User } from '$lib/server/db/schema/schema';
import { isFullSSR } from '$lib/server/util/full_ssr';

export const load = (async ({ cookies }) => {
	const users = getUsers();
	return {
		datetime: Date.now().toString(),
		users: isFullSSR(cookies) ? await users : users
	};
}) satisfies PageServerLoad;

async function getUsers(): Promise<User[]> {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return db.query.users.findMany({
		orderBy: (users, { asc }) => asc(users.id)
	});
}
