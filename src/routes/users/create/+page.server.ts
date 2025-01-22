import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { UserInsertSchema } from '$lib/common/validations/user';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import { users } from '$lib/server/db/schema/schema';
import { route } from '$lib/ROUTES';
import * as v from 'valibot';
import { UserInsertSchemaBackend } from '$lib/server/validations/user';
import { logger } from '$lib/common/logging';

export const load = (async () => {
	const form = await superValidate(valibot(UserInsertSchema), {
		defaults: v.getDefaults(UserInsertSchema) as unknown as v.InferOutput<typeof UserInsertSchema> // hack so all fields are initialized empty, this is a bug in the library that is made for Zod and doesn't work well with Valibot https://superforms.rocks/default-values
	});
	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		console.log('PASS 1');
		const form = await superValidate(request, valibot(UserInsertSchemaBackend));
		if (!form.valid) {
			return fail(422, { form });
		}
		console.log('PASS 2');
		await new Promise((resolve) => setTimeout(resolve, 2000));
		const result = await db.insert(users).values(form.data).returning().execute();
		logger.log({
			level: 'trace',
			message: `User inserted successfully: ${result[0].username}`
		});
		console.log('PASS 3');
		// TODO 1 send success message
		return redirect(303, route('/users'));
	}
} satisfies Actions;
