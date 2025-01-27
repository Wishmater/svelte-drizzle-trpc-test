<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import ThemeSwitcher from '$lib/client/widgets/theme_switcher.svelte';
	import { Toaster } from '$lib/client/components/ui/sonner/index.js';
	import { page } from '$app/stores';
	import { checkForServerToastMessage } from '$lib/client/util/toast_message';
	import { route } from '$lib/ROUTES';

	let { children } = $props();

	$effect(() => {
		$page; // listen to every change in page
		checkForServerToastMessage();
	});
</script>

<svelte:head>
	<title>SvelteKit Demo</title>
</svelte:head>

<ModeWatcher />
<Toaster />
<div class="min-h-screen bg-background font-sans">
	<header>
		<a href={route('/')}>
			<h1>SvelteKit FullStack Test</h1>
		</a>
	</header>

	{@render children()}

	<footer>
		<ThemeSwitcher></ThemeSwitcher>
	</footer>
</div>
