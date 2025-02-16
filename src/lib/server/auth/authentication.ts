import type { Cookies, Handle, RequestEvent } from '@sveltejs/kit';
import { validateSessionToken } from '$server/auth/sessions';
import { dev } from '$app/environment';
import { logger } from '$common/logging';

// reads the current user session, validates it, and sets it into event.locals.sessionUser
export async function authenticate(event: RequestEvent) {
	if (event.locals.session !== undefined) {
		return; // already authenticated
	}
	if (!event.route.id) {
		return; // don't authenticate on 404, to reduce preformance load and db hits
	}
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
	event.locals.session ??= null;
	event.locals.user ??= null;
}

export function setSessionTokenCookie(cookies: Cookies, token: string, expiresAt: Date): void {
	cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'strict',
		secure: !dev, // TODO 3 this should probably be added to .env
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(cookies: Cookies): void {
	cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'strict',
		secure: !dev, // TODO 3this should probably be added to .env
		maxAge: 0,
		path: '/'
	});
}
