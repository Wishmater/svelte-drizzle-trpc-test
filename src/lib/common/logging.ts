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
			let result = `${log_obj.time} ${log_obj.level} ${log_obj.message}`;
			if (log_obj.stacktrace) {
				result += `\n${log_obj.stacktrace}`;
			} else if (log_obj.error) {
				// stacktrace already contains the error message, so no need to print again
				result += `\n  ${JSON.stringify(log_obj.error, null, 2)}`;
			}
			return result;
		}
	}
	const logger = new Logger(
		devMinLevel,
		[new Pipeline(new DebugFormat(), [new ConsoleOutput()])],
		devScopes
	);
	setLogger(logger);
}
