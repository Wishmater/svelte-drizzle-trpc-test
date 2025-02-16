import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { UserInsertSchema } from '$lib/common/validations/user';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import { users } from '$lib/server/db/schema/user';
import { route } from '$lib/ROUTES';
import * as v from 'valibot';
import { userDefaults, UserInsertSchemaBackend } from '$lib/server/validations/user';
import { logger } from '$lib/common/logging';
import { type ToastMessage } from '$lib/common/util/toast_message';
import { redirectWithMessage } from '$lib/server/util/toast_message';
import { hashPassword } from '$server/auth/password';
import { requireAdmin } from '$server/auth/authorization';

export const load = (async (event) => {
	requireAdmin(event);
	const form = await superValidate(valibot(UserInsertSchema), { defaults: userDefaults });
	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		requireAdmin(event);
		const form = await superValidate(event.request, valibot(UserInsertSchemaBackend));
		if (!form.valid) {
			return fail(422, { form });
		}

		await new Promise((resolve) => setTimeout(resolve, 2000));
		form.data.password = hashPassword(form.data.password);
		const result = await db.insert(users).values(form.data).returning().execute();

		const message: ToastMessage = {
			type: 'success',
			message: `User "${result[0].username}" created successfully.`
		};
		logger.log({
			level: 'trace',
			message: message.message
		});
		return redirectWithMessage(303, route('/users'), event.cookies, message);
	}
} satisfies Actions;
