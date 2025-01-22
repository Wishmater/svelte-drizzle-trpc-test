<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import ThemeSwitcher from '$lib/client/widgets/theme_switcher.svelte';

	let { children } = $props();
</script>

<ModeWatcher />
<div class="min-h-screen bg-background font-sans">
	{@render children()}

	<footer>
		<ThemeSwitcher></ThemeSwitcher>
	</footer>
</div>
