import * as v from 'valibot';

export const IntegerRouteParam = v.pipe(
	v.string(),
	v.transform((input) => Number(input)),
	v.integer()
);

export const DeletePostData = v.object({
	id: v.pipe(v.number(), v.integer())
});
