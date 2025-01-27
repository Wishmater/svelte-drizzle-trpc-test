import { dev } from '$app/environment';
import { ConsoleOutput, Logger, Pipeline, Scope } from 'loggerjs';

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
	{ type: 'ServerResponse', level: 'trace' },
	{ type: 'ServerAPIResponse', level: 'trace' }
];

export function initLoggerDev() {
	class DebugFormat {
		format(log_obj: any) {
			// TODO 1 move this to logger.js and make it prettier
			return (
				`${log_obj.time} ${log_obj.level} ${log_obj.message}` +
				(!log_obj.error ? '' : `\n  ${log_obj.error}`) +
				(!log_obj.stacktrace ? '' : `\n  ${log_obj.stacktrace}`)
			);
		}
	}
	const logger = new Logger(
		devMinLevel,
		[new Pipeline(new DebugFormat(), [new ConsoleOutput()])],
		devScopes
	);
	setLogger(logger);
}
