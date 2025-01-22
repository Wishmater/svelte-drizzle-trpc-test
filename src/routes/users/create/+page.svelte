<script lang="ts">
	import type { PageData } from './$types';
	import { dev } from '$app/environment';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { UserInsertSchema } from '$lib/common/validations/user';
	import { Button } from '$lib/client/components/ui/button';
	import Spinner from '$lib/client/widgets/spinner.svelte';
	import UsernameInput from '$lib/client/forms/user/UsernameInput.svelte';
	import AgeInput from '$lib/client/forms/user/AgeInput.svelte';
	import TypeInput from '$lib/client/forms/user/TypeInput.svelte';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	const { form, errors, constraints, enhance, delayed, capture, restore } = superForm(data.form, {
		validators: valibotClient(UserInsertSchema)
		// customValidity: true // cool, but shows errors one but one, so overall not that good...
	});

	export const snapshot = { capture, restore }; // SvelteKit magic for restoring state to the page after navigation
</script>

<div class="h-16"></div>
<form method="POST" use:enhance class="flex flex-col items-center">
	<UsernameInput
		bind:value={$form.username}
		errors={$errors.username}
		constraints={$constraints.username}
	/>

	<label for="email" class="pt-4">Email</label>
	<input
		type="email"
		name="email"
		aria-invalid={$errors.email ? 'true' : undefined}
		bind:value={$form.email}
		{...$constraints.email}
	/>
	{#if $errors.email}<span class="text-red-500">{$errors.email}</span>{/if}

	<label for="password" class="pt-4">Password</label>
	<input
		type="password"
		name="password"
		aria-invalid={$errors.password ? 'true' : undefined}
		bind:value={$form.password}
		{...$constraints.password}
	/>
	{#if $errors.password}<span class="text-red-500">{$errors.password}</span>{/if}

	<AgeInput bind:value={$form.age} errors={$errors.age} constraints={$constraints.age} />

	<TypeInput bind:value={$form.type} errors={$errors.type} constraints={$constraints.type} />

	<div class="mt-8 flex flex-row items-center gap-4">
		<Button>Create User</Button>
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
