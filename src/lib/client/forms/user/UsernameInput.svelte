<script lang="ts">
	import type { InputConstraint } from 'sveltekit-superforms';

	interface Props {
		value: string | undefined;
		errors: string[] | undefined;
		constraints: InputConstraint | undefined;
	}
	let { value = $bindable(), errors, constraints }: Props = $props();
</script>

<label for="username" class="pt-4">Username</label>
<input
	type="text"
	name="username"
	aria-invalid={errors ? 'true' : undefined}
	bind:value
	{...constraints}
/>
{#if errors}<span class="text-red-500">{errors}</span>{/if}
