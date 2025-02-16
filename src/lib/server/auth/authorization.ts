import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { authenticate } from '$server/auth/authentication';

// throws redirect (or 403 error when isApi) if there is no logged-in user
export async function requireLogin(event: RequestEvent, isApi: boolean | undefined = undefined) {
	await authenticate(event);
	if (!event.locals.user) {
		if (isApi ?? event.locals.isApi) {
			return error(400, 'You need authentication to use the requested resource');
		} else {
			const redirectTo =
				(event.route?.id?.startsWith('/login') ?? false) ? '/' : event.url.toString();
			return redirect(303, `/login?redirectTo=${redirectTo}`);
		}
	}
}

// call requireLogin(), then throw 403 error if user isn't admin
export async function requireAdmin(event: RequestEvent, isApi: boolean | undefined = undefined) {
	await requireLogin(event, isApi);
	if (event.locals.user!.type != 'Admin') {
		return error(403, 'You are not authorized to use the requested resource');
	}
}
