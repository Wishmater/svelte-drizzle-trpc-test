<script lang="ts">
	import type { PageData } from './$types';
	import { browser, dev } from '$app/environment';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { UserInsertSchema } from '$lib/common/validations/user';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import UsernameInput from '$lib/client/forms/user/UsernameInput.svelte';
	import AgeInput from '$lib/client/forms/user/AgeInput.svelte';
	import TypeInput from '$lib/client/forms/user/TypeInput.svelte';
	import * as Form from '$lib/client/components/ui/form/index.js';
	import { Input } from '$lib/client/components/ui/input';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: valibotClient(UserInsertSchema)
	});
	const { form: formData, constraints, errors, enhance, delayed, timeout, capture, restore } = form;

	export const snapshot = { capture, restore }; // SvelteKit magic for restoring state to the page after navigation

	// remove constraints on hydration, to show prettier JS objects. While JS is loading, html constraints still work
	if (browser) {
		const constraintsValue = $constraints;
		for (const key1 in constraintsValue) {
			for (const key2 in constraintsValue[key1]) {
				constraintsValue[key1]![key2] = false;
			}
		}
	}
</script>

<svelte:head>
	<title>Create User - SvelteKit Demo</title>
</svelte:head>

<div class="h-16"></div>
<form method="POST" use:enhance class="flex flex-col items-center">
	<Form.Field {form} name="username">
		<UsernameInput />
	</Form.Field>

	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Input {...props} type="email" bind:value={$formData.email} {...$constraints?.email} />
			{/snippet}
		</Form.Control>
		<Form.Description class="sr-only">
			User email. A confirmation will be sent, make sure you have access to this email.
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password</Form.Label>
				<Input
					{...props}
					type="password"
					bind:value={$formData.password}
					{...$constraints?.password}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<!--	<AgeInput bind:value={$form.age} errors={$errors.age} constraints={$constraints.age} />-->

	<!--	<TypeInput bind:value={$form.type} errors={$errors.type} constraints={$constraints.type} />-->

	<div class="mt-8">
		{#if $delayed && !$timeout}
			<Form.Button disabled>
				<LoaderCircle size={34} class="animate-spin"></LoaderCircle>
				Create User
			</Form.Button>
		{:else}
			<Form.Button>Create User</Form.Button>
		{/if}
	</div>
</form>

{#if dev && browser}
	<div class="flex flex-wrap justify-center gap-8 pt-16">
		<div class="min-w-96">
			<SuperDebug data={$formData} collapsed={true} collapsible={true} label="Form Data" />
		</div>
		<div class="min-w-96">
			<SuperDebug data={$errors} collapsed={true} collapsible={true} label="Errors" />
		</div>
	</div>
{/if}
