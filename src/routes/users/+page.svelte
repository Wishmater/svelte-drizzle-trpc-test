<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/client/components/ui/button';
	import { route } from '$lib/ROUTES';
	import Pencil from 'lucide-svelte/icons/pencil';
	import type { User } from '$lib/server/db/schema/user';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import * as Avatar from '$lib/client/components/ui/avatar/index.js';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	function getUserEditRoute(user: User) {
		return route('/users/[id]/edit', { id: user.id });
	}
</script>

<svelte:head>
	<title>Users - SvelteKit Demo</title>
</svelte:head>

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
			<Button href={route('/users/create')}>Create User</Button>
		</div>
		{#await data.users}
			<LoaderCircle size={34} class="animate-spin"></LoaderCircle>
			Loading async data...
		{:then users}
			{#each users as user}
				<div class="flex flex-row items-center">
					<Avatar.Root class="h-7 w-7">
						<Avatar.Image src="/user_avatars/{user.id}.png" alt={user.username} />
						<Avatar.Fallback class="text-sm"
							>{user.username.slice(0, 2).toUpperCase()}</Avatar.Fallback
						>
					</Avatar.Root>

					<Button href={getUserEditRoute(user)} variant="ghost" size="icon">
						<Pencil />
					</Button>

					{user.username}: {user.email}
				</div>
			{/each}
		{:catch _}
			Error !!!
		{/await}
	</div>
</div>
