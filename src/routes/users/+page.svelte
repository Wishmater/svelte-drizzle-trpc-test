<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/client/components/ui/button';
	import { route } from '$lib/ROUTES';
	import Pencil from 'lucide-svelte/icons/pencil';
	import type { User } from '$lib/server/db/schema/schema';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	function getUserEditRoute(user: User) {
		return route('/users/edit/[id]', { id: user.id });
	}
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
					<a href={getUserEditRoute(user)}>
						<Button variant="ghost" size="icon">
							<Pencil />
						</Button>
					</a>
					{user.username}: {user.email} -- {user.selectedDate}
				</div>
			{/each}
		{/await}
	</div>
</div>
