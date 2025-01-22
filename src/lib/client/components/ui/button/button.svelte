<script lang="ts" module>
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';
	import Ripple from 'material-ripple-effects';

	export const buttonVariants = tv({
		base: 'ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline: 'border-input bg-background hover:bg-accent hover:text-accent-foreground border',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
				raised:
					'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-gray-900/60 hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-900/60 focus:opacity-[0.85] focus:shadow-md focus:shadow-gray-900/60 active:scale-[0.98] active:shadow-sm active:shadow-gray-900/60'
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];
	export type RippleType = 'default' | 'light' | 'dark' | 'none';

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
			ripple?: RippleType;
		};
</script>

<script lang="ts">
	import { cn } from '$lib/client/utils.js';

	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		ripple = 'default',
		children,
		...restProps
	}: ButtonProps = $props();

	const rippleEffect: Ripple = new Ripple();
	function createRipple<T extends Event>(e: T) {
		e.stopPropagation();
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
		rippleEffect.create(e, currentRipple);
	}
</script>

{#if href}
	<a
		bind:this={ref}
		class={cn(buttonVariants({ variant, size }), className)}
		{href}
		onmousedown={createRipple}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		onmousedown={createRipple}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
