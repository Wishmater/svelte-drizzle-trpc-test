<script lang="ts">
	import '../app.css';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
	import { initTrpc } from '$lib/client/api/api';

	let { children } = $props();

	const queryClient = new QueryClient();
	initTrpc(queryClient);
</script>

<QueryClientProvider client={queryClient}>
	<div class="bg-gray-100 min-h-screen">
		{@render children()}
	</div>
</QueryClientProvider>
