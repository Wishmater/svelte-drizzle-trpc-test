import { initLogger } from '$lib/client/logging';
import type { HandleClientError } from '@sveltejs/kit';
import { logger } from '$lib/common/logging';

initLogger();

window.onerror = function (event, source, lineno, colno, error) {
	logger.log({
		level: 'error',
		message: `Error caught by window.onerror`,
		error: error
	});
	return false;
};

window.onunhandledrejection = function (event) {
	logger.log({
		level: 'error',
		message: `Error caught by window.onunhandledrejection`,
		error: event.reason
	});
	return false;
};

export const handleError: HandleClientError = async ({ error, event, status, message }) => {
	const path = event.url;
	logger.log({
		level: 'error',
		message: `Error caught in client hook: ${status} ${path}\m${message}`,
		error: error,
		extra: {
			status: status,
			path: path
		}
	});
	return {
		status,
		message
	};
};
