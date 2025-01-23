import type { Cookies } from '@sveltejs/kit';

export const fullSSRKey = 'FullSSR';

export function isFullSSR(cookies: Cookies) {
	return cookies.get(fullSSRKey) == 'true';
}
