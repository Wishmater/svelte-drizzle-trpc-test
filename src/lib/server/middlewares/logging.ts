import type { Handle, RequestEvent } from '@sveltejs/kit';
import { logger } from '$common/logging';

// logs request and response details
export const loggerMiddleware: Handle = async ({ event, resolve }) => {
	event.locals.startTimer = performance.now();
	const response = await resolve(event);
	logRequest({
		status: response.status,
		event: event,
		response: response,
		errorMessage: undefined,
		error: undefined
	});
	return response;
};

interface LogParams {
	status: number;
	errorMessage: string | undefined;
	event: RequestEvent;
	response: Response | undefined;
	error: unknown | undefined;
}
export function logRequest({
	status,
	errorMessage = undefined,
	event,
	response = undefined,
	error
}: LogParams) {
	if (event.locals.startTimer == -1) return; // already logged
	const method = event.request.method.toUpperCase();
	const path = event.request.url;
	const elapsed = performance.now() - event.locals.startTimer;
	event.locals.startTimer = -1;
	const responseSize = parseInt(
		response?.headers.get('content-length') ?? errorMessage?.length.toString() ?? '0'
	);
	let type: string;
	if (response) {
		switch (response.headers.get('content-type')) {
			case 'text/html':
				type = 'ServerHtmlResponse';
				break;
			case 'text/sveltekit-data':
				type = 'ServerSvelteKitResponse';
				break;
			default:
				type = 'ServerAPIResponse';
				break;
		}
	} else {
		type =
			event.request.method != 'GET' || path.includes('/api')
				? 'ServerAPIResponse'
				: 'ServerHtmlResponse';
	}
	// TODO 1 API validation errors are being logged as 200, can't figure out an easy way to distinguish them
	logger.log({
		level: status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info',
		message: `${status} ${method.padEnd(4)} ${type} ${path}${errorMessage ? ` ${errorMessage}` : ''}`,
		type: type,
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
