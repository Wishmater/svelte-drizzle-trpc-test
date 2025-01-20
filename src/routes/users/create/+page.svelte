<script lang="ts">
	import type { PageData } from './$types';
	import Button from '$lib/client/widgets/button.svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { dev } from '$app/environment';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { UserInsertSchema } from '$lib/common/validations/user';
	// import { UserSchema } from '$lib/server/db/schema/schema';

	interface Props {
		data: PageData;
	}
	let { data } = $props();

	const { form, errors, constraints, message, enhance } = superForm(data.form, {
		validators: valibotClient(UserInsertSchema)
		// customValidity: true
	});
</script>

{#if $message}<h3 class="pt-4 text-center text-2xl text-green-600">{$message}</h3>{/if}

<div class="h-16"></div>
<form method="POST" use:enhance class="flex flex-col items-center">
	<label for="username" class="pt-4">Username</label>
	<input
		type="text"
		name="username"
		aria-invalid={$errors.username ? 'true' : undefined}
		bind:value={$form.username}
		{...$constraints.username}
	/>
	{#if $errors.username}<span class="text-red-500">{$errors.username}</span>{/if}

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

	<label for="age" class="pt-4">Age</label>
	<input
		type="number"
		name="age"
		aria-invalid={$errors.age ? 'true' : undefined}
		bind:value={$form.age}
		{...$constraints.age}
	/>
	{#if $errors.age}<span class="text-red-500">{$errors.age}</span>{/if}

	<label for="type" class="pt-4">Type</label>
	<input
		type="text"
		name="type"
		aria-invalid={$errors.type ? 'true' : undefined}
		bind:value={$form.type}
		{...$constraints.type}
	/>
	{#if $errors.type}<span class="text-red-500">{$errors.type}</span>{/if}

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
