import * as v from 'valibot';
import { getAllQueryParams, getErrorMessage } from '$lib/server/validations/_route_params';
import { type UserMinimal } from '$lib/common/validations/user';
import { error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';

const QueryParamsSchema = v.object({
	query: v.optional(v.string())
});
export type QueryParams = v.InferOutput<typeof QueryParamsSchema>;

export type ReturnType = UserMinimal;

export const GET: RequestHandler = async ({ url }) => {
	const queryParams = v.safeParse(QueryParamsSchema, getAllQueryParams(url));
	if (!queryParams.success) return error(400, { message: getErrorMessage(queryParams) });
	const { query } = queryParams.output;

	await new Promise((resolve) => setTimeout(resolve, 1000));
	const users = db.query.users.findMany({
		columns: {
			id: true,
			username: true,
			email: true
		},
		// this should be a prepared statement, for performance and organization
		where: !query
			? undefined
			: (t, { like }) => {
					return like(t.username, `%${query}%`);
				},
		limit: 20
	});

	return new Response(JSON.stringify(await users));
};
