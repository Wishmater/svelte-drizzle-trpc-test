import { ssp } from 'sveltekit-search-params';
import * as v from 'valibot';
import { logger } from '$lib/common/logging';

export type EncodeAndDecodeOptions<T = any> = {
	encode: (value: T) => string | undefined;
	decode: (value: string | null) => T | null;
	defaultValue?: T;
};

export function objectDecoder<T extends object>(
	schema: v.GenericSchema<T>,
	defaultValue?: T
): EncodeAndDecodeOptions<T> {
	const sspObject = ssp.object<T>();
	return {
		defaultValue: defaultValue,
		encode: sspObject.encode,
		decode: (value) => {
			if (!value) {
				return null;
			}
			const decoded = sspObject.decode(value);
			if (!decoded) {
				return null;
			}
			const parsed = v.safeParse(schema, decoded);
			if (!parsed.success) {
				logger.log({ level: 'debug', message: 'Error while parsing arguments' }); // TODO 3 make this log prettier
				return null;
			}
			return parsed.output;
		}
	};
}
