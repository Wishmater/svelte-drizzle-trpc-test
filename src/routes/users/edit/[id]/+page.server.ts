import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { UserUpdateSchema } from '$lib/common/validations/user';
import { valibot } from 'sveltekit-superforms/adapters';
import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import { users } from '$lib/server/db/schema/schema';
import { IntegerRouteParam } from '$lib/server/validations/_route_params';
import { route } from '$lib/ROUTES';
import * as v from 'valibot';
import { logger } from '$lib/common/logging';
import { eq } from 'drizzle-orm';
import { toastMessageKey, type ToastMessage } from '$lib/common/util/toast_message';
import { redirectWithMessage } from '$lib/server/util/toast_message';

export const load = (async ({ params }) => {
	const id = v.safeParse(IntegerRouteParam, params.id);
	if (!id.success) {
		return error(400, { message: `[id] param must be an integer, received: ${params.id}` });
	}

	const user = await db.query.users.findFirst({
		where: (users, op) => op.eq(users.id, id.output)
	});
	if (!user) {
		return error(400, { message: `User with id ${id.output} not found` });
	}

	const form = await superValidate(user, valibot(UserUpdateSchema));
	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ params, request, cookies }) => {
		const id = v.safeParse(IntegerRouteParam, params.id);
		if (!id.success) {
			return error(400, { message: '[id] param must be an integer' });
		}

		const form = await superValidate(request, valibot(UserUpdateSchema));
		if (!form.valid) {
			return fail(422, { form });
		}

		await new Promise((resolve) => setTimeout(resolve, 2000));
		const result = await db
			.update(users)
			.set(form.data)
			.where(eq(users.id, id.output))
			.returning()
			.execute();

		const message: ToastMessage = {
			type: 'success',
			message: `User "${result[0].username}" edited successfully.`
		};
		logger.log({
			level: 'trace',
			message: message.message
		});
		return redirectWithMessage(303, route('/users'), cookies, message);
	}
} satisfies Actions;
