<script lang="ts">
	import type { PageData } from './$types';
	import { dev } from '$app/environment';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { PostInsertSchema } from '$lib/common/validations/post';
	import { Button } from '$lib/client/components/ui/button';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	const { form, errors, constraints, enhance, delayed, timeout, capture, restore } = superForm(
		data.form,
		{
			validators: valibotClient(PostInsertSchema)
		}
	);

	export const snapshot = { capture, restore }; // SvelteKit magic for restoring state to the page after navigation
</script>

<svelte:head>
	<title>Create User - SvelteKit Demo</title>
</svelte:head>

<div class="h-16"></div>
<form method="POST" use:enhance class="flex flex-col items-center">
	<label for="content" class="pt-4">Post</label>
	<input
		type="text"
		name="content"
		aria-invalid={$errors.content ? 'true' : undefined}
		bind:value={$form.content}
		{...$constraints.content}
	/>
	{#if $errors.content}<span class="text-red-500">{$errors.content}</span>{/if}

	<input type="hidden" name="authorId" bind:value={$form.authorId} />

	<div class="mt-8">
		{#if $delayed && !$timeout}
			<Button disabled>
				<LoaderCircle size={34} class="animate-spin"></LoaderCircle>
				Create User
			</Button>
		{:else}
			<Button type="submit">Create User</Button>
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
