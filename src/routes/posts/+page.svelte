<script lang="ts">
	import type { PageData } from './$types';
	import { route } from '$lib/ROUTES';
	import { Button } from '$lib/client/components/ui/button';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import Delete from 'lucide-svelte/icons/trash';

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
					<form method="POST" action={route('delete /posts')}>
						<!-- TODO 1 add shadcn tooltip -->
						<!-- TODO 1 add shadcn confirm alert dialog -->
						<input type="hidden" name="id" value={post.id} />
						<Button type="submit" variant="ghost" size="icon">
							<Delete />
						</Button>
					</form>
					{post.author.username} - {post.createdAt.toLocaleString(undefined, {})}
					<br />{post.content}
				</div>
			{/each}
		{:catch _}
			Error !!!
		{/await}
	</div>
</div>
