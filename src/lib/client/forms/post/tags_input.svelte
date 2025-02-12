<script lang="ts">
	import * as Form from '$lib/client/components/ui/form/index.js';
	import * as Popover from '$lib/client/components/ui/popover/index.js';
	import * as Command from '$lib/client/components/ui/command/index.js';
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { useFormField } from 'formsnap';
	import type { Infer } from 'sveltekit-superforms';
	import { PostInsertSchema } from '$lib/common/validations/post';
	import type { TagMinimal } from '$lib/common/validations/tag';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { cn } from '$lib/client/utils';
	import { buttonVariants } from '$lib/client/components/ui/button/index.js';

	interface Props {
		itemsPromise: Promise<TagMinimal[]>;
	}
	let { itemsPromise }: Props = $props();

	const field = useFormField<Infer<typeof PostInsertSchema>>({});
	const formData = field.form.form;

	let open = $state(false);
</script>

<Popover.Root bind:open>
	<Form.Control>
		{#snippet children({ props })}
			<Form.Label>Tags</Form.Label>
			<Popover.Trigger
				class={cn(
					buttonVariants({ variant: 'outline', size: 'adaptive' }),
					'w-full justify-between py-1',
					!$formData.tags.length && 'text-muted-foreground'
				)}
				role="combobox"
				{...props}
			>
				{#if $formData.tags.length}
					<div class="flex flex-wrap gap-x-2 gap-y-1">
						{#each $formData.tags as tag}
							<div class="rounded-full border-2 px-2 py-0.5">
								{tag.name}
							</div>
						{/each}
					</div>
				{:else}
					Select tags...
				{/if}
				<ChevronsUpDown class="opacity-50" />
			</Popover.Trigger>
			<input hidden value={$formData.tags} name={props.name} />
		{/snippet}
	</Form.Control>
	<Popover.Content class="p-0">
		<Command.Root>
			{#await itemsPromise}
				<LoaderCircle size={34} class="px-auto my-4 w-full animate-spin"></LoaderCircle>
			{:then items}
				<Command.Input autofocus placeholder="Search tag..." class="h-9" />
				<Command.Empty>No tags found.</Command.Empty>
				<Command.Group>
					{#each items as tag}
						{@const index = $formData.tags.findIndex((e) => e.id === tag.id)}
						<Command.Item
							value={tag.name}
							onSelect={() => {
								if (index >= 0) {
									$formData.tags = $formData.tags.toSpliced(index, 1);
								} else {
									$formData.tags = [...$formData.tags, tag];
								}
							}}
						>
							{tag.name}
							<Check class={cn('ml-auto', index < 0 && 'text-transparent')} />
						</Command.Item>
					{/each}
				</Command.Group>
			{:catch _}
				Error !!!
			{/await}
		</Command.Root>
	</Popover.Content>
</Popover.Root>
<Form.Description>This tags will be associated with the post for easy search.</Form.Description>
<Form.FieldErrors />
