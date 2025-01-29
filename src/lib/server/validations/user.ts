import * as v from 'valibot';
import { UserInsertSchema } from '$lib/common/validations/user';
import { db } from '$lib/server/db/db';
import type { UserType } from '$lib/common/enums/user_types';

export const UserInsertSchemaBackend = v.pipeAsync(
	UserInsertSchema,
	v.forwardAsync(
		v.checkAsync(async (input) => {
			const existingUser = await db.query.users
				.findFirst({
					columns: { id: true },
					where: (users, op) => op.eq(users.username, input.username)
				})
				.execute();
			return !existingUser;
		}, 'Username already exists'),
		['username']
	),
	v.forwardAsync(
		v.checkAsync(async (input) => {
			const existingUser = await db.query.users
				.findFirst({
					columns: { id: true },
					where: (users, op) => op.eq(users.email, input.email)
				})
				.execute();
			return !existingUser;
		}, 'Email already exists'),
		['email']
	)
);

export const userDefaults = v.getDefaults(UserInsertSchema) as unknown as v.InferOutput<
	typeof UserInsertSchema
>;
userDefaults.type = '' as unknown as UserType; // select fields need to be set as empty string, or they will insta-taint the form
