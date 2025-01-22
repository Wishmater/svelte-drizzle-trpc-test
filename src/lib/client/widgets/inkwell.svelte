<script lang="ts">
	import Ripple from 'material-ripple-effects';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { get } from 'svelte/store';
	import { mode } from 'mode-watcher';

	interface Props {
		onclick: () => void;
		ripple: 'default' | 'light' | 'dark' | 'none';
	}
	let {
		onclick = () => {},
		ripple = 'default',
		children,
		...rest
	}: Props & HTMLButtonAttributes = $props();

	const rippleEffect: Ripple = new Ripple();

	function createRipple<T extends Event>(e: T) {
		e.stopPropagation();
		if (ripple == 'none') return;
		let currentRipple = ripple;
		if (currentRipple == 'default') {
			const themeMode = get(mode);
			currentRipple = themeMode == 'dark' ? 'light' : 'dark';
		}
		rippleEffect.create(e, currentRipple);
	}
</script>

<div
	{onclick}
	onmousedown={createRipple}
	role="button"
	tabindex="0"
	{...rest}
	class="transition-all duration-300
					hover:bg-accent/50
					disabled:bg-transparent
					has-[:hover]:bg-transparent
					{rest.class}"
>
	{@render children()}
</div>
