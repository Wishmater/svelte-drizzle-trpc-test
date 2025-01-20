import * as v from 'valibot';
import { UserInsertSchema } from '$lib/common/validations/user';
import { db } from '$lib/server/db/db';

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
