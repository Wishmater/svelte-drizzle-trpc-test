import type { Handle } from '@sveltejs/kit';
import { createContext, router } from '$lib/server/api/router';
import { createTRPCHandle } from 'trpc-sveltekit';
import { sequence } from '@sveltejs/kit/hooks';


const apiHandle = createTRPCHandle({
	router,
	createContext,
	url: '/api',
	onError: opts => {
		console.error(opts.error);
	}
});

export const handle: Handle = sequence(
	apiHandle,
);
