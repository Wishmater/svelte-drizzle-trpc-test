<script lang="ts">
	import { trpc } from '$lib/client/api/api';

	const users = trpc.users.all.createQuery();

</script>

Users endpoint:
{#if $users.isPending}
	Loading...
{:else if $users.isError}
	Error: {$users.error.message}
{:else if $users.data}
	{#each $users.data as user}
		{user}
		{user.type}
		<br>
	{/each}
{/if}