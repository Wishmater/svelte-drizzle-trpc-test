<script lang="ts">
	interface Props {
		value: string;
		errors: string[] | undefined;
		constraints: any;
	}
	let { value = $bindable(''), errors, constraints }: Props = $props();
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
