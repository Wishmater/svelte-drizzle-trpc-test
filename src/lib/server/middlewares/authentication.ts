import type { Cookies, Handle, RequestEvent } from '@sveltejs/kit';
import { validateSessionToken } from '$server/auth/sessions';
import { dev } from '$app/environment';

// reads the current user session, validates it, and sets it into event.locals.sessionUser
export const authenticationMiddleware: Handle = async ({ event, resolve }) => {
	// TODO 2 performance: this is being ran even on endpoints that don't need it (and even on static resource requests). Find a way to discern when it's necessary.
	const token = event.cookies.get('session');
	if (token) {
		const { session, user, isRefreshed } = await validateSessionToken(token);
		if (session) {
			event.locals.session = session;
			event.locals.user = user;
			if (isRefreshed) {
				setSessionTokenCookie(event.cookies, token, session.expiresAt);
			}
		} else {
			deleteSessionTokenCookie(event.cookies);
		}
	}
	return resolve(event);
};

export function setSessionTokenCookie(cookies: Cookies, token: string, expiresAt: Date): void {
	cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'strict',
		secure: !dev, // this should probably be added to .env
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(cookies: Cookies): void {
	cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'strict',
		secure: !dev, // this should probably be added to .env
		maxAge: 0,
		path: '/'
	});
}
