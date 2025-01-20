<script lang="ts">
	import type { PageData } from './$types';
	import Button from '$lib/client/widgets/button.svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { dev } from '$app/environment';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { UserInsertSchema } from '$lib/common/validations/user';
	import UsernameInput from '$lib/client/forms/user/UsernameInput.svelte';
	import AgeInput from '$lib/client/forms/user/AgeInput.svelte';
	import TypeInput from '$lib/client/forms/user/TypeInput.svelte';

	interface Props {
		data: PageData;
	}
	let { data } = $props();

	const { form, errors, constraints, enhance } = superForm(data.form, {
		validators: valibotClient(UserInsertSchema)
		// customValidity: true
	});
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

	<Button class="mt-8">Create User</Button>
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
