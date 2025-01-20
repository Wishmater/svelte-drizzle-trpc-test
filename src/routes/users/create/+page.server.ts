import type { Actions } from './$types';
import * as v from 'valibot';
import { UserInsertSchema } from '$lib/server/db/schema/schema';
import { fail } from '@sveltejs/kit';
import { ValiError } from 'valibot';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const model = v.safeParse(UserInsertSchema, formData);
		try {
		} catch (error) {
			if (error instanceof ValiError) {
				console.log('ValiError');
				console.log(error.issues);
			}
		}
		if (!model.success) {
			console.log('fail');
			fail(422, { validationIssues: model.issues });
		}
		console.log(model.output);
		console.log(model.output);
	}
} satisfies Actions;
