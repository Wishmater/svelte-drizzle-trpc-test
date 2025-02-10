import * as v from 'valibot';
import { initCustomErrorMessages } from '$lib/common/validations/_valibot';
import { number } from 'valibot';

initCustomErrorMessages();

export function getErrorMessage(parsedParams: v.SafeParseResult<any>) {
	const issues = parsedParams.issues;
	if (issues) {
		return issues
			.map((e) => {
				const key = e.path
					.map((e: any) => `[${e.key}] "${e.value}"`)
					.reduce((p: any, e: any) => `${p}.${e}`);
				return `${key} - ${e.message}`;
			})
			.reduce((p, e) => `${p},\n${e}`);
	} else {
		return 'Unknown validation error';
	}
}

export function getAllQueryParams(url: URL) {
	const entries = url.searchParams.entries();
	const result: any = {};
	while (true) {
		const entry = entries.next();
		if (entry.done) break;
		result[entry.value[0]] = entry.value[1];
	}
	return result;
}

export const ParseNumberSchema = v.pipe(
	v.string(),
	v.transform((input) => Number(input)),
	v.check(
		(input) => !Number.isNaN(input),
		"Invalid type: Expected a number but received a string that can't be parsed"
	)
);

export const ParseIntegerSchema = v.config(v.pipe(ParseNumberSchema, v.integer()), {
	abortPipeEarly: true
});

export const ParseObjectSchema = v.pipe(
	v.string(),
	v.transform((input) => {
		try {
			return JSON.parse(input);
		} catch (e) {
			return null;
		}
	}),
	v.check(
		(input) => input != null,
		"Invalid type: Expected an object but received a string that can't be parsed as JSON"
	)
);

export const DeletePostData = v.object({
	id: v.pipe(v.number(), v.integer())
});
