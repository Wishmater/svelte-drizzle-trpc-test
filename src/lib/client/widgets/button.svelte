<script lang="ts">
	import Ripple from 'material-ripple-effects';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props {
		onclick: () => void;
		ripple: 'light' | 'dark' | null;
		className: string;
	}
	let {
		onclick = () => {},
		ripple = 'light',
		className = '',
		children,
		...rest
	}: Props & HTMLButtonAttributes = $props();

	const rippleEffect: Ripple = new Ripple();

</script>

<button
	{onclick}
	onmousedown={(e) => ripple && rippleEffect.create(e, ripple)}
	{...rest}
	class="	rounded-lg py-3 px-6 text-center align-middle
					bg-gray-900 shadow-md shadow-gray-900/60
					font-sans text-xs font-bold uppercase text-white
					transition-all duration-200
					hover:shadow-lg hover:shadow-gray-900/60
					focus:opacity-[0.85] focus:shadow-md focus:shadow-gray-900/60
					active:opacity-[0.85] active:shadow-sm active:shadow-gray-900/60
					disabled:pointer-events-none disabled:opacity-50 disabled:shadow-sm
					{className}"
>
	{@render children()}
</button>