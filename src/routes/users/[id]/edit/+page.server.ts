import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { UserUpdateSchema } from '$lib/common/validations/user';
import { valibot } from 'sveltekit-superforms/adapters';
import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import { type User, users } from '$lib/server/db/schema/user';
import { getErrorMessage, ParseIntegerSchema } from '$lib/server/validations/_route_params';
import { route } from '$lib/ROUTES';
import * as v from 'valibot';
import { logger } from '$lib/common/logging';
import { eq } from 'drizzle-orm';
import { type ToastMessage } from '$lib/common/util/toast_message';
import { redirectWithMessage } from '$lib/server/util/toast_message';
import { writeFile } from '$lib/server/util/files';
import { userAvatarsDir } from '../../../../hooks.server';
import { requireAdmin } from '$server/auth/authorization';

const ParamsSchema = v.object({
	id: ParseIntegerSchema
});

export const load = (async (event) => {
	requireAdmin(event);
	const parsedParams = v.safeParse(ParamsSchema, event.params);
	if (!parsedParams.success) return error(400, { message: getErrorMessage(parsedParams) });
	const { id } = parsedParams.output;

	const user = await db.query.users.findFirst({
		where: (users, op) => op.eq(users.id, id)
	});
	if (!user) {
		return error(400, { message: `User with id ${id} not found` });
	}

	const form = await superValidate(user, valibot(UserUpdateSchema));
	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		requireAdmin(event);
		const parsedParams = v.safeParse(ParamsSchema, event.params);
		if (!parsedParams.success) return error(400, { message: getErrorMessage(parsedParams) });
		const { id } = parsedParams.output;

		const form = await superValidate(event.request, valibot(UserUpdateSchema));
		if (!form.valid) {
			return fail(422, { form });
		}

		let result: User[] | undefined;
		const dbQuery = db.update(users).set(form.data).where(eq(users.id, id)).returning().execute();
		let fileWrite: Promise<any> | undefined;
		if (form.data.avatar) {
			fileWrite = writeFile(`${userAvatarsDir}/${id}.png`, form.data.avatar);
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
		return redirectWithMessage(303, route('/users'), event.cookies, message);
	}
} satisfies Actions;
