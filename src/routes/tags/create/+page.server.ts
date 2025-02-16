import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { TagInsertSchema } from '$lib/common/validations/tag';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import { tagDetails, type TagDetailsInsert, tags } from '$lib/server/db/schema/tag';
import { route } from '$lib/ROUTES';
import * as v from 'valibot';
import { logger } from '$lib/common/logging';
import { type ToastMessage } from '$lib/common/util/toast_message';
import { redirectWithMessage } from '$lib/server/util/toast_message';
import { requireAdmin } from '$server/auth/authorization';

export const load = (async (event) => {
	await requireAdmin(event);
	const form = await superValidate(
		{
			details: [{}]
		},
		valibot(TagInsertSchema),
		{
			errors: false
		}
	);
	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		await requireAdmin(event);
		const form = await superValidate(event.request, valibot(TagInsertSchema));
		if (!form.valid) {
			return fail(422, { form });
		}

		const result = await db.insert(tags).values(form.data).returning().execute();
		const tagsDetailsData = form.data.details.map((e): TagDetailsInsert => {
			return { tagId: result[0].id, ...e };
		});
		await db.insert(tagDetails).values(tagsDetailsData).execute();

		const message: ToastMessage = {
			type: 'success',
			message: `Tag "${result[0].name}" created successfully.`
		};
		logger.log({
			level: 'trace',
			message: message.message
		});
		return redirectWithMessage(303, route('/tags'), event.cookies, message);
	}
} satisfies Actions;
