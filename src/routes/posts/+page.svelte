<script lang="ts">
	import type { PageData } from './$types';
	import { route } from '$lib/ROUTES';
	import { Button } from '$lib/client/components/ui/button';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

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
			<a href={route('/posts/create')}>
				<Button>Create Post</Button>
			</a>
		</div>
		{#await data.posts}
			<LoaderCircle size={34} class="animate-spin"></LoaderCircle>
			Loading async data...
		{:then posts}
			{#each posts as post}
				<div class="py-2">
					{post.author.username} - {post.createdAt}
					{post.content}
				</div>
			{/each}
		{:catch _}
			Error !!!
		{/await}
	</div>
</div>
