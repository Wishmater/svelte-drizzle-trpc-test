<script lang="ts">
	import type { PageData } from './$types';
	import { browser, dev } from '$app/environment';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { PostInsertSchema } from '$lib/common/validations/post';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import * as Form from '$lib/client/components/ui/form/index.js';
	import { Textarea } from '$lib/client/components/ui/textarea';
	import { disableConstraints } from '$lib/client/util/forms';
	import SimpleAlertDialog from '$lib/client/widgets/simple_alert_dialog.svelte';
	import TagsInput from '$lib/client/forms/post/tags_input.svelte';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: valibotClient(PostInsertSchema),
		taintedMessage: () => showTaintedAlert(),
		dataType: 'json'
	});
	const { form: formData, constraints, errors, enhance, delayed, timeout, capture, restore } = form;

	export const snapshot = { capture, restore }; // SvelteKit magic for restoring state to the page after navigation

	disableConstraints($constraints); // remove constraints on hydration, to show prettier JS errors. While JS is loading, html constraints still work

	let showTaintedAlert: () => Promise<boolean> = $state(null!);
</script>

<svelte:head>
	<title>Create User - SvelteKit Demo</title>
</svelte:head>

<SimpleAlertDialog
	title="Are you sure you want to leave the form?"
	subtitle="Your changes may be lost."
	bind:showAlert={showTaintedAlert}
/>
<form method="POST" use:enhance class="flex w-96 flex-col items-center gap-4 px-4">
	<input type="hidden" name="authorId" bind:value={$formData.authorId} />

	<Form.Field {form} name="content">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Post</Form.Label>
				<Textarea {...props} bind:value={$formData.content} {...$constraints?.content} />
			{/snippet}
		</Form.Control>
		<Form.Description class="sr-only">Post content.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="tags"><TagsInput itemsPromise={data.tags} /></Form.Field>

	<div class="mt-8">
		{#if $delayed && !$timeout}
			<Form.Button disabled>
				<LoaderCircle size={34} class="animate-spin"></LoaderCircle>
				Create Post
			</Form.Button>
		{:else}
			<Form.Button>Create Post</Form.Button>
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
