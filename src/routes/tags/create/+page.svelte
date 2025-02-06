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
	import SimpleAlertDialog from '$lib/client/widgets/simple_alert_dialog.svelte';
	import { Button } from '$lib/client/components/ui/button';
	import Delete from 'lucide-svelte/icons/trash';
	import Add from 'lucide-svelte/icons/plus';
	import * as Card from '$lib/client/components/ui/card/index.js';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: valibotClient(TagInsertSchema),
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
<form method="POST" dataType="json" use:enhance class="flex w-96 flex-col items-center gap-4 px-4">
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

	<Form.Fieldset {form} name="details">
		<Card.Root>
			<Card.Header>
				<Form.Legend>
					<Card.Title class="text-lg">Tag Details</Card.Title>
				</Form.Legend>
				<Form.Description class="!pl-0">
					<Card.Description>
						Made up field to demonstrate fully dependant object list relation.
					</Card.Description>
				</Form.Description>
			</Card.Header>
			<Card.Content>
				{#each $formData.details as _, i}
					<Form.ElementField {form} name="details[{i}]">
						<Form.Control>
							{#snippet children({ props })}
								<div class="flex flex-row items-end gap-2 py-2">
									<div>
										<Form.Label>Detail Num</Form.Label>
										<Input
											{...props}
											type="number"
											bind:value={$formData.details[i].detailNumber}
											{...$constraints?.details?.detailNumber}
										/>
									</div>
									<div>
										<Form.Label>Detail Text</Form.Label>
										<Input
											{...props}
											bind:value={$formData.details[i].detailText}
											{...$constraints?.details?.detailText}
										/>
									</div>
									<Button
										variant="destructive"
										size="icon"
										class="flex-none"
										onclick={() => ($formData.details = $formData.details.toSpliced(i, 1))}
									>
										<Delete />
									</Button>
								</div>
							{/snippet}
						</Form.Control>
					</Form.ElementField>
				{/each}
			</Card.Content>
			<Card.Footer>
				<Form.FieldErrors />
				<Button
					variant="secondary"
					onclick={() => ($formData.details = [...$formData.details, {}])}
				>
					<Add /> Add details entry
				</Button>
			</Card.Footer>
		</Card.Root>
	</Form.Fieldset>

	<div class="mt-8 w-full">
		{#if $delayed && !$timeout}
			<Form.Button class="w-full" disabled>
				<LoaderCircle size={34} class="animate-spin"></LoaderCircle>
				Create Tag
			</Form.Button>
		{:else}
			<Form.Button class="w-full">Create Tag</Form.Button>
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
