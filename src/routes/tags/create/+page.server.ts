import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { TagInsertSchema } from '$lib/common/validations/tag';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import { tags } from '$lib/server/db/schema/tag';
import { route } from '$lib/ROUTES';
import * as v from 'valibot';
import { logger } from '$lib/common/logging';
import { type ToastMessage } from '$lib/common/util/toast_message';
import { redirectWithMessage } from '$lib/server/util/toast_message';

export const load = (async () => {
	const form = await superValidate(valibot(TagInsertSchema));
	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, valibot(TagInsertSchema));
		if (!form.valid) {
			return fail(422, { form });
		}

		const result = await db.insert(tags).values(form.data).returning().execute();

		const message: ToastMessage = {
			type: 'success',
			message: `Tag "${result[0].name}" created successfully.`
		};
		logger.log({
			level: 'trace',
			message: message.message
		});
		return redirectWithMessage(303, route('/tags'), cookies, message);
	}
} satisfies Actions;
