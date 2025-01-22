<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { type Events, type Props, buttonVariants } from './index.js';
	import { cn } from '$lib/client/utils.js';
	import Ripple from 'material-ripple-effects';

	type $$Props = Props;
	type $$Events = Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';
	export let builders: $$Props['builders'] = [];
	export let ripple: $$Props['ripple'] = 'default';
	export { className as class };

	const rippleEffect: Ripple = new Ripple();
	function createRipple<T extends Event>(e: T) {
		if (ripple == 'none' || variant == 'link') return;
		let currentRipple = ripple;
		const isDarkTheme = false; // TODO 1 how do we know this in JS
		if (currentRipple == 'default') {
			if (isDarkTheme) {
				currentRipple = 'light';
			} else {
				currentRipple =
					variant == 'default' || variant == 'destructive' || variant == 'raised'
						? 'light'
						: 'dark';
			}
		}
		e.stopPropagation();
		rippleEffect.create(e, currentRipple);
	}
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }))}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
	onmousedown={createRipple}
>
	<slot />
</ButtonPrimitive.Root>
