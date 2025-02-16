import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/db';
import type { User } from '$lib/server/db/schema/user';
import { isFullSSR } from '$lib/server/util/full_ssr';
import { requireAdmin } from '$server/auth/authorization';

export const load = (async (event) => {
	await requireAdmin(event);
	const users = getUsers();
	return {
		datetime: Date.now().toString(),
		users: isFullSSR(event.cookies) ? await users : users
	};
}) satisfies PageServerLoad;

async function getUsers(): Promise<User[]> {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return db.query.users.findMany({
		orderBy: (users, { asc }) => asc(users.id)
	});
}
