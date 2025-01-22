import * as v from 'valibot';

let initialized = false;
export function initCustomErrorMessages() {
	if (initialized) return;
	initialized = true;

	v.setGlobalConfig({ lang: 'en' });

	v.setSpecificMessage(
		v.string,
		(issue) => {
			if (issue.input == null) return 'Field Required';
			return issue.message; // this should never show on form
		},
		'en'
	);

	v.setSpecificMessage(
		v.number,
		(issue) => {
			if (issue.input == null) return 'Field Required';
			return issue.message; // this should never show on form
		},
		'en'
	);

	v.setSpecificMessage(
		v.boolean,
		(issue) => {
			if (issue.input == null) return 'Field Required';
			return issue.message; // this should never show on form
		},
		'en'
	);

	v.setSpecificMessage(
		v.date,
		(issue) => {
			if (issue.input == null) return 'Field Required';
			return issue.message; // this should never show on form
		},
		'en'
	);

	v.setSpecificMessage(
		v.picklist,
		(issue) => {
			if (issue.input == null) return 'Field Required';
			return issue.message; // this should never show on form
		},
		'en'
	);

	v.setSpecificMessage(
		v.nonEmpty,
		(issue) => {
			return 'Field Required';
		},
		'en'
	);
}

export const JsonStringParseSchema = v.pipe(
	v.string(),
	v.transform((input) => {
		try {
			return JSON.parse(input);
		} catch (error) {
			return { jsonStringParseError: error };
		}
	}),
	v.check((input) => !input.jsonParseError, 'Json parsing failed. The string is not a valid json.')
);
