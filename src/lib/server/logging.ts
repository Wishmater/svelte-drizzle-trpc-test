import { initLoggerDev, setLogger } from '$lib/common/logging';
import { Formats, Logger, Pipeline, Scope } from 'loggerjs';
import { building, dev } from '$app/environment';
import { createWriteStream, WriteStream } from 'node:fs';

const minLevel = 'trace'; // TODO 1 move to .env
const scopes: Scope[] = [
	{ type: 'ServerResponse', level: 'trace' },
	{ type: 'ServerAPIResponse', level: 'trace' }
];

// called in src/hooks.server.ts before doing anything else
export function initLogger() {
	if (dev || building) {
		initLoggerDev();
	} else {
		const logger = new Logger(
			minLevel,
			[new Pipeline(Formats.json(), [new WriteStreamOutput('log.txt')])],
			scopes
		);
		setLogger(logger);
	}
}

class WriteStreamOutput {
	stream;

	constructor(file: any) {
		if (file instanceof WriteStream) {
			this.stream = file;
		} else if (file instanceof String || typeof file === 'string') {
			this.stream = createWriteStream(file.toString());
		} else {
			throw new Error(
				'unsupported argument of type ' + typeof file + ' expected Node fs.WriteStream or a path'
			);
		}
	}

	output(logstr: any) {
		this.stream.write(logstr);
	}
}
