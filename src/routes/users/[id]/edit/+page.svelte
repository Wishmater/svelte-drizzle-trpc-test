<script lang="ts">
	import type { PageData } from './$types';
	import { browser, dev } from '$app/environment';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { UserUpdateSchema } from '$lib/common/validations/user';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import AgeInput from '$lib/client/forms/user/age_input.svelte';
	import TypeInput from '$lib/client/forms/user/type_input.svelte';
	import { disableConstraints } from '$lib/client/util/forms';
	import SelectedDateInput from '$lib/client/forms/user/selected_date_input.svelte';
	import * as Form from '$lib/client/components/ui/form/index.js';
	import { Switch } from '$lib/client/components/ui/switch';
	import SimpleAlertDialog from '$lib/client/widgets/simple_alert_dialog.svelte';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: valibotClient(UserUpdateSchema),
		taintedMessage: () => showTaintedAlert()
	});
	const { form: formData, constraints, errors, enhance, delayed, timeout, capture, restore } = form;

	export const snapshot = { capture, restore }; // SvelteKit magic for restoring state to the page after navigation

	disableConstraints($constraints); // remove constraints on hydration, to show prettier JS errors. While JS is loading, html constraints still work

	let showTaintedAlert: () => Promise<boolean> = $state(null!);
</script>

<svelte:head>
	<title>Edit User - SvelteKit Demo</title>
</svelte:head>

<SimpleAlertDialog
	title="Are you sure you want to leave the form?"
	subtitle="Your changes may be lost."
	bind:showAlert={showTaintedAlert}
/>
<form method="POST" use:enhance class="flex w-96 flex-col items-center gap-4 px-4">
	<Form.Field {form} name="type"><TypeInput /></Form.Field>

	<Form.Field {form} name="active">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Active</Form.Label>
				<br />
				<Switch {...props} bind:checked={$formData.active} {...$constraints?.active} class="ml-1" />
			{/snippet}
		</Form.Control>
		<Form.Description class="sr-only">Inactive users won't be able to log in.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="age"><AgeInput /></Form.Field>

	<Form.Field {form} name="selectedDate"><SelectedDateInput /></Form.Field>

	<div class="mt-8">
		{#if $delayed}
			<Form.Button disabled>
				<LoaderCircle size={34} class="animate-spin"></LoaderCircle>
				Edit User
			</Form.Button>
		{:else}
			<Form.Button>Edit User</Form.Button>
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
