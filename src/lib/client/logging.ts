import { setLogger, initLoggerDev } from '$lib/common/logging';
import { Logger, LokiFormat, LokiSender, Pipeline, Scope } from 'loggerjs';
import { building, dev } from '$app/environment';

const minLevel = 'trace'; // TODO 1 move to .env
const scopes: Scope[] = [
	{ type: 'ServerHtmlResponse', level: 'trace' },
	{ type: 'ServerAPIResponse', level: 'trace' }
];

// called in src/hooks.client.ts before doing anything else
export function initLogger() {
	if (dev || building) {
		initLoggerDev();
	} else {
		const logger = new Logger(
			minLevel,
			[
				new Pipeline(new LokiFormat({ job: 'mpg_web_frontend' }), [
					new LokiSender({
						url: 'https://190.92.122.228/loki/api/v1/push',
						username: 'loki',
						password: 'loki-access'
					})
				])
			],
			scopes
		);
		setLogger(logger);
	}
}
