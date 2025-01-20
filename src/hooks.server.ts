import { initLogger } from '$lib/server/logging';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { logger } from '$lib/common/logging';
import { sequence } from '@sveltejs/kit/hooks';

initLogger();

const loggerMiddleware: Handle = async ({ event, resolve }) => {
	event.locals.startTimer = performance.now();

	const response = await resolve(event);

	const status = response.status;
	if (status < 400) {
		// we assume all errors will pass thorugh handleError and be logged there with more detail
		const method = event.request.method.toUpperCase();
		const path = event.request.url;
		const elapsed = performance.now() - event.locals.startTimer;
		const responseSize = parseInt(response?.headers.get('content-length') ?? '0');
		const isApi = event.request.method != 'GET';
		// TODO 1 API validation errors are being logged as 200, can't figure out an easy way to distinguish them
		logger.log({
			level: 'info',
			message: `${isApi ? 'API ' : ''}RESPONSE ${status} ${method} ${path}`,
			type: isApi ? 'ServerResponse' : 'ServerAPIResponse',
			extra: {
				method: method,
				status: status,
				client_ip: event.getClientAddress(),
				path: path,
				response_size: responseSize,
				elapsed: elapsed
				// TODO 1 log user info
			}
		});
	}
	return response;
};

export const handle: Handle = sequence(loggerMiddleware);

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	const response = event.locals.response;
	const method = event.request.method.toLocaleUpperCase();
	const path = event.request.url;
	const elapsed = performance.now() - event.locals.startTimer;
	const responseSize = parseInt(
		response?.headers.get('content-length') ?? message.length.toString()
	);
	const isApi = event.request.method != 'GET';
	logger.log({
		level: status >= 500 ? 'error' : 'warn',
		message: `${isApi ? 'API ' : ''}RESPONSE ${status} ${method} ${path} ${message}`,
		error: error,
		type: isApi ? 'ServerResponse' : 'ServerAPIResponse',
		extra: {
			method: method,
			path: path,
			client_ip: event.getClientAddress(),
			status: status,
			response_size: responseSize,
			elapsed: elapsed
		}
	});
	console.error(error);
	return {
		status,
		message
	};
};
