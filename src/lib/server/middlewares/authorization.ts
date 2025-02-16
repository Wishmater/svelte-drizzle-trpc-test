import type { Handle } from '@sveltejs/kit';

// return the appropriate response if the user isn't authorized to access the requested resource
export const authorizationMiddleware: Handle = async ({ event, resolve }) => {
	return resolve(event);
};
