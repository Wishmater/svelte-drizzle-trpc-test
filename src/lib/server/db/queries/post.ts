import { db } from '$lib/server/db/db';
import { sql } from 'drizzle-orm';
import placeholder = sql.placeholder;

// use prepare statements for performance benefits and to get type inference safety https://orm.drizzle.team/docs/rqb#prepared-statements
// we can't add this to the schema file, because if we import db.ts from schema a circular dependency error is thrown when running drizzle-kit push

export const postsQuery = db.query.posts
	.findMany({
		columns: {
			authorId: false
		},
		with: {
			author: {
				columns: {
					username: true,
					email: true
				}
			},
			postTags: {
				with: {
					tags: true
				},
				orderBy: (t, { asc }) => asc(t.tagId)
			}
		},
		where: (t, op) => {
			const userId = placeholder('userId');
			return op.or(op.isNull(userId), op.eq(t.authorId, userId));
		},
		// where: (t, op) => {
		// 	const userId = placeholder('userId');
		// 	const tagId = placeholder('tagId');
		// 	return op.and(
		// 		op.or(op.isNull(userId), op.eq(t.authorId, userId)),
		// 		op.or(op.isNull(tagId), op.eq(t., tagId)) // can't get tag from joined table here
		// 	);
		// },
		orderBy: (t, { desc }) => desc(t.createdAt)
	})
	.prepare();

// infer return type from prepared statement
export type PostView = Awaited<ReturnType<typeof postsQuery.execute>>[number];
