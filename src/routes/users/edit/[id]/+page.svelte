<script lang="ts">
	import type { PageData } from './$types';
	import { dev } from '$app/environment';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { UserUpdateSchema } from '$lib/common/validations/user';
	import Button from '$lib/client/widgets/button.svelte';
	import Spinner from '$lib/client/widgets/spinner.svelte';
	import AgeInput from '$lib/client/forms/user/AgeInput.svelte';
	import TypeInput from '$lib/client/forms/user/TypeInput.svelte';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	const { form, errors, constraints, enhance, delayed, capture, restore } = superForm(data.form, {
		validators: valibotClient(UserUpdateSchema)
		// customValidity: true // cool, but shows errors one but one, so overall not that good...
	});

	export const snapshot = { capture, restore }; // SvelteKit magic for restoring state to the page after navigation
</script>

<div class="h-16"></div>
<form method="POST" use:enhance class="flex flex-col items-center">
	<TypeInput bind:value={$form.type} errors={$errors.type} constraints={$constraints.type} />

	<label for="active" class="pt-4">Active</label>
	<input
		type="checkbox"
		name="active"
		aria-invalid={$errors.active ? 'true' : undefined}
		bind:checked={$form.active}
		{...$constraints.active}
	/>
	{#if $errors.active}<span class="text-red-500">{$errors.active}</span>{/if}

	<AgeInput bind:value={$form.age} errors={$errors.age} constraints={$constraints.age} />

	<div class="mt-8 flex flex-row items-center gap-4">
		<Button>Edit User</Button>
		{#if $delayed}
			<Spinner size={34}></Spinner>
		{/if}
	</div>
</form>

{#if dev}
	<div class="flex flex-wrap justify-center gap-8 pt-16">
		<div class="min-w-96">
			<SuperDebug data={$form} collapsed={true} collapsible={true} label="Form Data" />
		</div>
		<div class="min-w-96">
			<SuperDebug data={$errors} collapsed={true} collapsible={true} label="Errors" />
		</div>
	</div>
{/if}
