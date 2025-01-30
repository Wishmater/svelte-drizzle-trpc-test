import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { UserUpdateSchema } from '$lib/common/validations/user';
import { valibot } from 'sveltekit-superforms/adapters';
import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import { type User, users } from '$lib/server/db/schema/user';
import { IntegerRouteParam } from '$lib/server/validations/_route_params';
import { route } from '$lib/ROUTES';
import * as v from 'valibot';
import { logger } from '$lib/common/logging';
import { eq } from 'drizzle-orm';
import { type ToastMessage } from '$lib/common/util/toast_message';
import { redirectWithMessage } from '$lib/server/util/toast_message';
import { dev } from '$app/environment';
import { writeFile } from '$lib/server/util/files';
import { userAvatarsDir } from '../../../../hooks.server';

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

		let result: User[] | undefined;
		const dbQuery = db
			.update(users)
			.set(form.data)
			.where(eq(users.id, id.output))
			.returning()
			.execute();
		let fileWrite: Promise<any> | undefined;
		if (form.data.avatar) {
			fileWrite = writeFile(`${userAvatarsDir}/${id.output}.png`, form.data.avatar);
		}
		if (fileWrite) {
			result = (await Promise.all([dbQuery, fileWrite]))[0];
		} else {
			result = await dbQuery;
		}

		const message: ToastMessage = {
			type: 'success',
			message: `User "${result![0].username}" edited successfully.`
		};
		logger.log({
			level: 'trace',
			message: message.message
		});
		return redirectWithMessage(303, route('/users'), cookies, message);
	}
} satisfies Actions;
