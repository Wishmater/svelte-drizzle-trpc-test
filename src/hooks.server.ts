import { initLogger } from '$lib/server/logging';
import type { Handle, HandleServerError, RequestEvent } from '@sveltejs/kit';
import { logger } from '$lib/common/logging';
import { sequence } from '@sveltejs/kit/hooks';

initLogger();

const loggerMiddleware: Handle = async ({ event, resolve }) => {
	event.locals.startTimer = performance.now();
	const response = await resolve(event);
	log({
		status: response.status,
		event: event,
		response: response,
		errorMessage: undefined
	});
	return response;
};

export const handle: Handle = sequence(loggerMiddleware);

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	log({
		status: status,
		event: event,
		response: event.locals.response,
		errorMessage: message
	});
	return {
		status,
		message
	};
};

function log({
	status,
	errorMessage = undefined,
	event,
	response = undefined
}: {
	status: number;
	errorMessage: string | undefined;
	event: RequestEvent;
	response: Response | undefined;
}) {
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
		level: 'info',
		message: `${isApi ? 'API ' : ''}RESPONSE ${status} ${method} ${path}${errorMessage ? ` ${errorMessage}` : ''}`,
		type: isApi ? 'ServerResponse' : 'ServerAPIResponse',
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
