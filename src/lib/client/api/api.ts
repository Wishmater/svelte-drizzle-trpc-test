import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { svelteQueryWrapper } from 'trpc-svelte-query-adapter';
import type { Router } from '$lib/server/api/router';
import { QueryClient } from '@tanstack/svelte-query';

const client = createTRPCProxyClient<Router>({
	links: [
		httpBatchLink({
			url: '/api/',
		}),
	],
});

export function initTrpc(queryClient: QueryClient) {
	trpc = svelteQueryWrapper<Router>({
		client,
		queryClient,
	});
}

export let trpc: ReturnType<typeof svelteQueryWrapper<Router>>;

