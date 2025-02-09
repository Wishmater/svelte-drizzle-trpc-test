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

export const ParseNumberSchema = v.pipe(
	v.string(),
	v.transform((input: string) => Number(input)),
	v.check(
		(input) => !Number.isNaN(input),
		"Invalid type: Expected a number but received a string that can't be parsed"
	)
);

export const ParseIntegerSchema = v.config(v.pipe(ParseNumberSchema, v.integer()), {
	abortPipeEarly: true
});

export const DeletePostData = v.object({
	id: v.pipe(v.number(), v.integer())
});
