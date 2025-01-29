<script lang="ts">
	import type { PageData } from './$types';
	import { route } from '$lib/ROUTES';
	import { Button } from '$lib/client/components/ui/button';
	import type { Post } from '$lib/server/db/schema/post';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import Delete from 'lucide-svelte/icons/trash';
	import * as Tooltip from '$lib/client/components/ui/tooltip/index.js';
	import * as AlertDialog from '$lib/client/components/ui/alert-dialog/index.js';

	export let data: PageData;
</script>

<svelte:head>
	<title>Posts - SvelteKit Demo</title>
</svelte:head>

<div class="flex flex-col items-center">
	<div class="w-[512px]">
		<div class="flex flex-row items-center justify-between">
			<div>
				<br />
				<br />
				Posts Page
				<br />
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

					{post.author.username} - {post.createdAt.toLocaleString(undefined, {})}

					<br />{post.content}
				</div>
			{/each}
		{:catch _}
			Error !!!
		{/await}
	</div>
</div>

{#snippet deleteButton(post: Post)}
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
