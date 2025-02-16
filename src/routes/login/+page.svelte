<script lang="ts">
	import type { PageData } from './$types';
	import * as Form from '$lib/client/components/ui/form/index.js';
	import { disableConstraints } from '$client/util/forms';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { LoginSchema } from '$common/validations/login';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import SimpleAlertDialog from '$client/widgets/simple_alert_dialog.svelte';
	import { browser, dev } from '$app/environment';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { Input } from '$shadcn/input';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: valibotClient(LoginSchema)
	});
	const { form: formData, constraints, errors, enhance, delayed, timeout, capture, restore } = form;

	export const snapshot = { capture, restore }; // SvelteKit magic for restoring state to the page after navigation

	disableConstraints($constraints); // remove constraints on hydration, to show prettier JS errors. While JS is loading, html constraints still work
</script>

<svelte:head>
	<title>Login - SvelteKit Demo</title>
</svelte:head>

<form method="POST" use:enhance class="flex w-96 flex-col items-center gap-4 px-4">
	<Form.Field {form} name="username">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Username or email</Form.Label>
				<Input {...props} bind:value={$formData.username} {...$constraints?.username} />
			{/snippet}
		</Form.Control>
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

	<div class="mt-4 w-full">
		{#if $delayed && !$timeout}
			<Form.Button disabled class="w-full">
				<LoaderCircle size={34} class="animate-spin"></LoaderCircle>
				Login
			</Form.Button>
		{:else}
			<Form.Button class="w-full">Login</Form.Button>
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
