<script lang="ts">
	import type { PageData } from './$types';
	import { dev } from '$app/environment';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { Button } from '$lib/client/components/ui/button';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { TagInsertSchema } from '$lib/common/validations/tag';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	const { form, errors, constraints, enhance, delayed, timeout, capture, restore } = superForm(
		data.form,
		{
			validators: valibotClient(TagInsertSchema)
		}
	);

	export const snapshot = { capture, restore }; // SvelteKit magic for restoring state to the page after navigation
</script>

<svelte:head>
	<title>Create User - SvelteKit Demo</title>
</svelte:head>

<div class="h-16"></div>
<form method="POST" use:enhance class="flex flex-col items-center">
	<label for="content" class="pt-4">Tag Name</label>
	<input
		type="text"
		name="name"
		aria-invalid={$errors.name ? 'true' : undefined}
		bind:value={$form.name}
		{...$constraints.name}
	/>
	{#if $errors.name}<span class="text-red-500">{$errors.name}</span>{/if}

	<div class="mt-8">
		{#if $delayed && !$timeout}
			<Button disabled>
				<LoaderCircle size={34} class="animate-spin"></LoaderCircle>
				Create Tag
			</Button>
		{:else}
			<Button type="submit">Create Tag</Button>
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
