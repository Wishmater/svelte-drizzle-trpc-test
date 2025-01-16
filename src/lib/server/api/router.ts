import type { RequestEvent } from '@sveltejs/kit';
import { initTRPC } from '@trpc/server';
import { dev } from '$app/environment';
import * as v from 'valibot';
import { db } from '$lib/server/db/db';
import { UserSelectSchema } from '$lib/server/db/schema/schema';


export async function createContext(event: RequestEvent) {
	return {
		event // 👈 `event` is now available in your context
	};
}

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
	isDev: dev,
});

export type Router = typeof router;

// Drizzle ORM queries:
// https://orm.drizzle.team/docs/rqb

export const router = t.router({

	hello: t.procedure
		.output((value) => v.parse(v.string(), value))
		.query(async () => {
			return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
		}),

	greeting: t.procedure
		.input((value) => v.parse(v.string(), value))
		.output((value) => v.parse(v.string(), value))
		.query(async ({ input }) => {
			return `Hello, ${input} from tRPC v10 @ ${new Date().toLocaleTimeString()}`;
		}),

	users: t.router({
		all: t.procedure
			.output((value) => v.parse(v.array(UserSelectSchema), value))
			.query(async () => {
				return db.query.users.findMany();
			}),
	}),

});



