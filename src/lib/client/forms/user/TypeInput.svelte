<script lang="ts">
	interface Props {
		value: string;
		errors: string[] | undefined;
		constraints: any;
	}
	let { value = $bindable(''), errors, constraints }: Props = $props();
</script>

<label for="type" class="pt-4">Type</label>
<input
	type="text"
	name="type"
	aria-invalid={errors ? 'true' : undefined}
	bind:value
	{...constraints}
/>
{#if errors}<span class="text-red-500">{errors}</span>{/if}
