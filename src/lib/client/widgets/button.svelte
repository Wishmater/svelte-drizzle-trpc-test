<script lang="ts">
	import Ripple from 'material-ripple-effects';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props {
		onclick: () => void;
		ripple: 'default' | 'light' | 'dark' | null;
		buttonType: 'raised' | 'ghost' | 'outlined' | 'inkwell';
	}
	let {
		onclick = () => {},
		ripple = 'default',
		buttonType = 'raised',
		children,
		...rest
	}: Props & HTMLButtonAttributes = $props();

	const rippleEffect: Ripple = new Ripple();

	function createRipple<T extends Event>(e: T) {
		if (ripple == 'default') {
			ripple = buttonType == 'raised' ? 'light' : 'dark';
		}
		if (ripple) {
			e.stopPropagation();
			rippleEffect.create(e, ripple);
		}
	}
</script>

{#if buttonType === 'raised'}
	<button
		{onclick}
		onmousedown={createRipple}
		{...rest}
		class="rounded-lg bg-gray-900 px-6 py-3 text-center
					align-middle font-sans text-xs
					font-bold uppercase text-white shadow-md shadow-gray-900/60
					transition-all duration-300
					hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-900/60
					focus:opacity-[0.85] focus:shadow-md focus:shadow-gray-900/60
					active:scale-[0.98] active:opacity-[0.85] active:shadow-sm active:shadow-gray-900/60
					disabled:pointer-events-none disabled:opacity-50 disabled:shadow-sm
					{rest.class}"
	>
		{@render children()}
	</button>
{:else if buttonType === 'inkwell'}
	<div
		{onclick}
		onmousedown={createRipple}
		role="button"
		tabindex="0"
		{...rest}
		class="transition-all duration-300
					hover:bg-slate-100 focus:bg-slate-100
					active:bg-slate-100
					disabled:pointer-events-none
					disabled:opacity-50 disabled:shadow-sm has-[:hover]:bg-transparent
					{rest.class}"
	>
		{@render children()}
	</div>
{:else}
	<button
		{onclick}
		onmousedown={createRipple}
		{...rest}
		class="	rounded-lg bg-transparent px-6 py-3 text-center
					align-middle
					font-sans text-xs font-bold uppercase text-slate-700
					{buttonType === 'outlined' && 'border border-slate-300'}
					transition-all duration-300
					hover:scale-[1.02] hover:bg-slate-200 focus:bg-slate-200
					active:scale-[0.98] active:bg-slate-200
					disabled:pointer-events-none disabled:opacity-50 disabled:shadow-sm
					{rest.class}"
	>
		{@render children()}
	</button>
{/if}
