<script lang="ts">
	import type { PageData } from './$types';
	import type { User } from '$lib/server/db/schema/schema';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();
</script>

Page Loaded !!! {data.datetime}
<br />
{#await data.users}
	Loading...
{:then users}
	{#each users as user}
		{user.username}: {user.email} -- {user.selectedDate}
	{/each}
{/await}
