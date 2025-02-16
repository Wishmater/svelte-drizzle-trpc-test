import { initLogger } from '$lib/server/logging';
import type { Handle, HandleServerError, ServerInit } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { db } from '$lib/server/db/db';
import { users } from '$lib/server/db/schema/user';
import * as fs from 'node:fs';
import { dev } from '$app/environment';
import { loggerMiddleware, logRequest } from '$server/middlewares/logging';
import { hashPassword } from '$server/auth/password';

initLogger();

export const userAvatarsDir = dev ? './static/user_avatars' : './client/user_avatars';

export const init: ServerInit = async () => {
	if (!fs.existsSync(userAvatarsDir)) {
		fs.mkdirSync(userAvatarsDir);
	}
	// TODO 2 find a better way to do db data initialization
	if ((await db.$count(users)) == 0) {
		await db
			.insert(users)
			.values({
				username: 'admin',
				password: hashPassword('admin.123'),
				email: 'admin@fromzero.com',
				age: 69420,
				type: 'Admin'
			})
			.execute();
	}
};

export const handle: Handle = sequence(loggerMiddleware);

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	logRequest({
		status: status,
		event: event,
		errorMessage: message,
		error: error,
		response: undefined
	});
	return {
		status,
		message
	};
};
