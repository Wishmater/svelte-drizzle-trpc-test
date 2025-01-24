<script lang="ts">
	import type { PageData } from '../../../../../.svelte-kit/types/src/routes';
	import { dev } from '$app/environment';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { UserUpdateSchema } from '$lib/common/validations/user';
	import { Button } from '$lib/client/components/ui/button';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
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

<svelte:head>
	<title>Edit User - SvelteKit Demo</title>
</svelte:head>

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

	<div class="mt-8">
		{#if $delayed}
			<Button disabled>
				<LoaderCircle size={34} class="animate-spin"></LoaderCircle>
				Create User
			</Button>
		{:else}
			<Button type="submit">Create User</Button>
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
