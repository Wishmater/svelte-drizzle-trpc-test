import type { LayoutServerLoad } from './$types';
import { authenticate } from '$server/auth/authentication';

export const load = (async (event) => {
	await authenticate(event);
	return {
		user: event.locals.user
	};
}) satisfies LayoutServerLoad;
