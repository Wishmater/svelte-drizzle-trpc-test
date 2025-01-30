import { initLogger } from '$lib/server/logging';
import type { Handle, HandleServerError, RequestEvent, ServerInit } from '@sveltejs/kit';
import { logger } from '$lib/common/logging';
import { sequence } from '@sveltejs/kit/hooks';
import { db } from '$lib/server/db/db';
import { users } from '$lib/server/db/schema/user';
import * as fs from 'node:fs';
import { dev } from '$app/environment';

initLogger();

export const userAvatarsDir = dev ? './static/user_avatars' : './user_avatars';

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
				password: 'admin.123',
				email: 'admin@fromzero.com',
				age: 69420,
				type: 'Admin'
			})
			.execute();
	}
};

const loggerMiddleware: Handle = async ({ event, resolve }) => {
	event.locals.startTimer = performance.now();
	const response = await resolve(event);
	log({
		status: response.status,
		event: event,
		response: response,
		errorMessage: undefined,
		error: undefined
	});
	return response;
};

export const handle: Handle = sequence(loggerMiddleware);

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	log({
		status: status,
		event: event,
		response: event.locals.response,
		errorMessage: message,
		error: error
	});
	return {
		status,
		message
	};
};

interface LogParams {
	status: number;
	errorMessage: string | undefined;
	event: RequestEvent;
	response: Response | undefined;
	error: unknown | undefined;
}
function log({ status, errorMessage = undefined, event, response = undefined, error }: LogParams) {
	if (event.locals.startTimer == -1) return; // already logged
	const method = event.request.method.toUpperCase();
	const path = event.request.url;
	const elapsed = performance.now() - event.locals.startTimer;
	event.locals.startTimer = -1;
	const responseSize = parseInt(
		response?.headers.get('content-length') ?? errorMessage?.length.toString() ?? '0'
	);
	const isApi = event.request.method != 'GET';
	// TODO 1 API validation errors are being logged as 200, can't figure out an easy way to distinguish them
	logger.log({
		level: status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info',
		message: `${isApi ? 'API ' : ''}RESPONSE ${status} ${method} ${path}${errorMessage ? ` ${errorMessage}` : ''}`,
		type: isApi ? 'ServerResponse' : 'ServerAPIResponse',
		error: status >= 500 ? error : undefined,
		extra: {
			method: method,
			status: status,
			client_ip: event.getClientAddress(),
			path: path,
			response_size: responseSize,
			elapsed: elapsed
			// TODO 1 log user info (and add it to locals all the way down load() to the frontend)
		}
	});
}
