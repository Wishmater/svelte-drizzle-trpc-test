<script lang="ts">
	import type { InputConstraint } from 'sveltekit-superforms';

	interface Props {
		value: number | undefined;
		errors: string[] | undefined;
		constraints: InputConstraint | undefined;
	}
	let { value = $bindable(), errors, constraints }: Props = $props();
</script>

<label for="age" class="pt-4">Age</label>
<input
	type="number"
	name="age"
	aria-invalid={errors ? 'true' : undefined}
	bind:value
	{...constraints}
/>
{#if errors}<span class="text-red-500">{errors}</span>{/if}
