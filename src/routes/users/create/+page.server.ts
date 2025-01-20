import type { PageServerLoad, Actions } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { UserInsertSchema } from '$lib/common/validations/user';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import { users } from '$lib/server/db/schema/schema';
import { route } from '$lib/ROUTES';

export const load = (async (event) => {
	const form = await superValidate(valibot(UserInsertSchema));
	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, valibot(UserInsertSchema));

		if (!form.valid) {
			return fail(422, { form });
		}

		db.insert(users).values(form.data);

		// TODO 1 send success message
		return redirect(303, route('/users'));
	}
} satisfies Actions;
