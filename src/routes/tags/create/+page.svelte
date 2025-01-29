<script lang="ts">
	import type { PageData } from './$types';
	import { browser, dev } from '$app/environment';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { TagInsertSchema } from '$lib/common/validations/tag';
	import * as Form from '$lib/client/components/ui/form/index.js';
	import { Input } from '$lib/client/components/ui/input';
	import { disableConstraints } from '$lib/client/util/forms';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: valibotClient(TagInsertSchema)
	});
	const { form: formData, constraints, errors, enhance, delayed, timeout, capture, restore } = form;

	export const snapshot = { capture, restore }; // SvelteKit magic for restoring state to the page after navigation

	disableConstraints($constraints); // remove constraints on hydration, to show prettier JS errors. While JS is loading, html constraints still work
</script>

<svelte:head>
	<title>Create User - SvelteKit Demo</title>
</svelte:head>

<div class="h-16"></div>
<form method="POST" use:enhance class="flex w-96 flex-col items-center">
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Tag Name</Form.Label>
				<Input {...props} bind:value={$formData.name} {...$constraints?.name} />
			{/snippet}
		</Form.Control>
		<Form.Description class="sr-only">
			Publicly displayed name for the Tag. Must be unique.
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<div class="mt-8">
		{#if $delayed && !$timeout}
			<Form.Button disabled>
				<LoaderCircle size={34} class="animate-spin"></LoaderCircle>
				Create Tag
			</Form.Button>
		{:else}
			<Form.Button>Create Tag</Form.Button>
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
