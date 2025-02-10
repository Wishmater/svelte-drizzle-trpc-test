<script lang="ts">
	import type { PageData } from './$types';
	import * as Select from '$lib/client/components/ui/select/index.js';
	import * as Tooltip from '$lib/client/components/ui/tooltip/index.js';
	import * as AlertDialog from '$lib/client/components/ui/alert-dialog/index.js';
	import { route } from '$lib/ROUTES';
	import { Button } from '$lib/client/components/ui/button';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import Delete from 'lucide-svelte/icons/trash';
	import Close from 'lucide-svelte/icons/x';
	import { ssp, queryParameters } from 'sveltekit-search-params';
	import { TagMinimalSchema } from '$lib/common/validations/tag';
	import { objectDecoder } from '$lib/client/validations/query_params';
	import type { QueryParams } from './+page.server';
	import { UserMinimalSchema } from '$lib/common/validations/user';

	export let data: PageData;

	type TagData = Awaited<typeof data.posts>[number];
	type PostData = Awaited<typeof data.posts>[number];

	let awaitedTags: TagData[];
	data.tags.then((e) => (awaitedTags = e));

	const queryParams = queryParameters({
		tag: objectDecoder(TagMinimalSchema),
		user: objectDecoder(UserMinimalSchema)
	});

	function onTagFilterSelected(value: string) {
		const id = Number(value);
		queryParams.tag = awaitedTags.find((e) => e.id == id) ?? null;
	}
</script>

<svelte:head>
	<title>Posts - SvelteKit Demo</title>
</svelte:head>

<div class="flex flex-col items-center">
	<div class="w-[512px]">
		<div class="flex flex-row items-center justify-between">
			<div>
				Posts Page
				<br />
				<br />
				<div class="flex flex-row">
					<Select.Root
						type="single"
						value={queryParams.tag?.id.toString()}
						onValueChange={onTagFilterSelected}
					>
						<Select.Trigger class="w-40">
							{queryParams.tag ? queryParams.tag.name : 'Filter by tag...'}
						</Select.Trigger>
						<Select.Content>
							{#await data.tags}
								<LoaderCircle size={34} class="animate-spin"></LoaderCircle>
								Loading tags...
							{:then tags}
								{#each tags as tag}
									<Select.Item value={tag.id.toString()} label={tag.name} />
								{/each}
							{:catch _}
								Error !!!
							{/await}
						</Select.Content>
					</Select.Root>
					{#if queryParams.tag}
						<Button variant="ghost" size="icon" onclick={() => (queryParams.tag = null)}>
							<Close />
						</Button>
					{/if}
				</div>
				<br />
			</div>
			<Button href={route('/posts/create')}>Create Post</Button>
		</div>
		{#await data.posts}
			<LoaderCircle size={34} class="animate-spin"></LoaderCircle>
			Loading async data...
		{:then posts}
			{#each posts as post}
				<div class="py-2"></div>
				<div class="flex flex-row items-center">
					{@render deleteButton(post)}

					<div class="flex flex-col">
						{post.author.username} - {post.createdAt.toLocaleString(undefined, {})}

						<br />{post.content}

						{#if post.postTags}
							<div class="flex flex-wrap gap-x-2 gap-y-1">
								{#each post.postTags as tag}
									<div class="rounded-full border-2 px-2 py-0.5">
										{tag.tags.name}
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		{:catch _}
			Error !!!
		{/await}
	</div>
</div>

{#snippet deleteButton(post: PostData)}
	<AlertDialog.Root>
		<AlertDialog.Trigger>
			<Tooltip.Root disableHoverableContent>
				<Tooltip.Content>Delete post</Tooltip.Content>
				<Tooltip.Trigger>
					<Button variant="ghost" size="icon">
						<Delete />
					</Button>
				</Tooltip.Trigger>
			</Tooltip.Root>
		</AlertDialog.Trigger>

		<AlertDialog.Content interactOutsideBehavior="close">
			<AlertDialog.Header>
				<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
				<AlertDialog.Description>
					This action cannot be undone. This will permanently delete your post.
				</AlertDialog.Description>
			</AlertDialog.Header>

			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<form method="POST" action={route('delete /posts')}>
					<input type="hidden" name="id" value={post.id} />
					<AlertDialog.Action>Delete</AlertDialog.Action>
				</form>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/snippet}
