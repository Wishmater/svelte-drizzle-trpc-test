import { dev } from '$app/environment';
import { ConsoleOutput, Formats, Logger, Pipeline, Scope } from 'loggerjs';

export let logger: Logger;

export function setLogger(newLogger: Logger) {
	if (logger) {
		if (dev) {
			newLogger.log({
				level: 'warn',
				message: 'Re-initializing logger, probably due to hot-reload'
			});
		} else {
			throw Error('Trying to initialize logger twice');
		}
	}
	logger = newLogger;
}

const devMinLevel = 'trace';
const devScopes: Scope[] = [
	{ type: 'ServerHtmlResponse', level: 'trace' },
	{ type: 'ServerAPIResponse', level: 'trace' },
	{ type: 'ServerSvelteKitResponse', level: 'trace' }
];

export function initLoggerDev() {
	const logger = new Logger(
		devMinLevel,
		[new Pipeline(Formats.pretty(), [new ConsoleOutput()])],
		devScopes
	);
	setLogger(logger);
}
