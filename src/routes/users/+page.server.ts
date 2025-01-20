import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/db';
import type { User } from '$lib/server/db/schema/schema';

export const load = (async (event) => {
	return {
		datetime: Date.now().toString(),
		users: getUsers()
	};
}) satisfies PageServerLoad;

async function getUsers(): Promise<User[]> {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return db.query.users.findMany();
}
