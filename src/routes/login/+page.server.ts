import { setError, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { userDefaults, UserInsertSchemaBackend } from '$server/validations/user';
import { error, fail } from '@sveltejs/kit';
import { db } from '$server/db/db';
import { users } from '$server/db/schema/user';
import type { ToastMessage } from '$common/util/toast_message';
import { logger } from '$common/logging';
import { redirectWithMessage } from '$server/util/toast_message';
import { route } from '$lib/ROUTES';
import type { Actions, PageServerLoad } from './$types';
import { LoginSchema } from '$common/validations/login';
import { hashPassword } from '$server/auth/password';
import { createSession, generateSessionToken, invalidateSession } from '$server/auth/sessions';
import { deleteSessionTokenCookie, setSessionTokenCookie } from '$server/auth/authentication';

export const load = (async () => {
	const form = await superValidate(valibot(LoginSchema));
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ url, request, cookies }) => {
		const form = await superValidate(request, valibot(LoginSchema));
		if (!form.valid) {
			return fail(422, { form });
		}

		const password = hashPassword(form.data.password);
		const user = await db.query.users.findFirst({
			where: (t, { eq, and, or }) => {
				return and(
					or(eq(t.username, form.data.username), eq(t.email, form.data.username)),
					eq(t.password, password)
				);
			}
		});
		if (!user) {
			return setError(form, 'password', 'Username or password is incorrect');
		}

		const token = generateSessionToken();
		const session = await createSession(token, user.id);
		setSessionTokenCookie(cookies, token, session.expiresAt);

		const message: ToastMessage = {
			type: 'success',
			message: `Welcome, ${user.username}!`
		};
		logger.log({
			level: 'trace',
			message: `Login successful for user: ${user.username}`
		});
		const redirectTo = url.searchParams.get('redirectTo') ?? route('/');
		return redirectWithMessage(303, redirectTo, cookies, message);
	}
} satisfies Actions;
