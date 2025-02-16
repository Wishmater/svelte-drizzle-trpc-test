<script lang="ts">
	import type { PageData } from './$types';
	import { route } from '$lib/ROUTES';
	import { Button } from '$lib/client/components/ui/button';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { page } from '$app/state';

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
				Tags Page
				<br />
				<br />
			</div>
			{#if page.data.user?.type === 'Admin'}
				<Button href={route('/tags/create')}>Create Tag</Button>
			{/if}
		</div>
		{#await data.tags}
			<LoaderCircle size={34} class="animate-spin"></LoaderCircle>
			Loading async data...
		{:then tags}
			{#each tags as tag}
				<div class="py-2">
					{tag.name}
					{#each tag.details as details}
						<div class="border pl-3">
							{#if details.detailNumber}
								num: {details.detailNumber}
							{/if}
							{#if details.detailText}
								text: {details.detailText}
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		{:catch _}
			Error !!!
		{/await}
	</div>
</div>
