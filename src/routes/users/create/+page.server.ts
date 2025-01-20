import type { PageServerLoad, Actions } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { UserInsertSchema } from '$lib/common/validations/user';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

export const load = (async (event) => {
	const form = await superValidate(valibot(UserInsertSchema));
	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		console.log('PASS');
		const form = await superValidate(request, valibot(UserInsertSchema));
		console.log(form);

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(422, { form });
		}

		// TODO: Do something with the validated form.data

		// Display a success status message
		return message(form, 'User created successfully');
	}
} satisfies Actions;
