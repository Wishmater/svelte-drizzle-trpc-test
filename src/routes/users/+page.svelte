<script lang="ts">
	import type { PageData } from './$types';
	import Button from '$lib/client/widgets/button.svelte';
	import { route } from '$lib/ROUTES';
	import { Icon, PencilSquare } from 'svelte-hero-icons';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();
</script>

<div class="flex flex-col items-center">
	<div class="w-[512px]">
		<div class="flex flex-row items-center justify-between">
			<div>
				<br />
				<br />
				Users Page
				<br />
				Page Loaded !!! {data.datetime}
				<br />
				<br />
			</div>
			<a href={route('/users/create')}>
				<Button>Create User</Button>
			</a>
		</div>
		{#await data.users}
			Loading async data...
		{:then users}
			{#each users as user}
				<div class="flex flex-row items-center">
					<a href={route('/users/create')}>
						<Button buttonType="ghost" class="h-8 !p-1">
							<Icon src={PencilSquare} />
						</Button>
					</a>
					{user.username}: {user.email} -- {user.selectedDate}
				</div>
			{/each}
		{/await}
	</div>
</div>
