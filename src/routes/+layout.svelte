<script lang="ts">
	import '../app.css';
	import type { LayoutProps } from './$types';
	import { ModeWatcher } from 'mode-watcher';
	import ThemeSwitcher from '$lib/client/widgets/theme_switcher.svelte';
	import { Toaster } from '$lib/client/components/ui/sonner/index.js';
	import { page as pageStore } from '$app/stores';
	import { page } from '$app/state';
	import { checkForServerToastMessage } from '$lib/client/util/toast_message';
	import { route } from '$lib/ROUTES';
	import * as Tooltip from '$lib/client/components/ui/tooltip/index.js';
	import { ProgressBar } from '@prgm/sveltekit-progress-bar';
	import { onNavigate } from '$app/navigation';
	import { Button } from '$lib/client/components/ui/button';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let { data, children }: LayoutProps = $props();

	$effect(() => {
		$pageStore; // listen to every change in page
		checkForServerToastMessage();
	});
</script>

<svelte:head>
	<title>SvelteKit Demo</title>
</svelte:head>

<ModeWatcher />
<Toaster />
<ProgressBar class="text-primary" />
<Tooltip.Provider delayDuration={0}>
	<div class="flex min-h-screen flex-col items-center bg-background font-sans">
		<header
			class="mb-8 flex h-20 w-full flex-row content-center items-center justify-center border-b-2"
		>
			<a href={route('/')} class="text-xl">
				<h1>SvelteKit FullStack Test</h1>
			</a>
			{#if data.user !== undefined}
				<div class="w-16"></div>
				{#if data.user}
					<h6>{data.user.username}</h6>
					<form method="POST" action={route('logout /', { redirectTo: page.url.toString() })}>
						<Button type="submit" variant="ghost">Logout</Button>
					</form>
				{:else}
					<Button variant="ghost" href={route('/login', { redirectTo: page.url.toString() })}>
						Login
					</Button>
				{/if}
			{/if}
		</header>

		<div class="flex flex-grow flex-col items-center">
			{@render children()}
		</div>

		<footer
			class="mt-8 flex h-32 w-full flex-row content-center items-center justify-center border-t-2"
		>
			<ThemeSwitcher></ThemeSwitcher>
		</footer>
	</div>
</Tooltip.Provider>
