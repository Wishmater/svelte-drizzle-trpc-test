import { invalidateSession } from '$server/auth/sessions';
import { deleteSessionTokenCookie } from '$server/middlewares/authentication';
import type { Actions } from '../../.svelte-kit/types/src/routes/login/$types';
import { route } from '$lib/ROUTES';
import { redirectWithMessage } from '$server/util/toast_message';
import type { ToastMessage } from '$common/util/toast_message';

export const actions = {
	logout: async ({ url, locals, cookies }) => {
		if (locals.session) {
			await invalidateSession(locals.session.id);
		}
		deleteSessionTokenCookie(cookies);
		const message: ToastMessage = {
			message: `Logged out successfully`,
			type: 'info'
		};
		const redirectTo = url.searchParams.get('redirectTo') ?? route('/');
		return redirectWithMessage(303, redirectTo, cookies, message);
	}
} satisfies Actions;
