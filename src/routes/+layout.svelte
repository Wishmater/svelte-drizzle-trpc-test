<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import ThemeSwitcher from '$lib/client/widgets/theme_switcher.svelte';
	import { Toaster } from '$lib/client/components/ui/sonner/index.js';
	import { page } from '$app/stores';
	import { checkForServerToastMessage } from '$lib/client/util/toast_message';

	let { children } = $props();

	$effect(() => {
		$page; // listen to every change in page
		checkForServerToastMessage();
	});
</script>

<ModeWatcher />
<Toaster />
<div class="min-h-screen bg-background font-sans">
	{@render children()}

	<footer>
		<ThemeSwitcher></ThemeSwitcher>
	</footer>
</div>
