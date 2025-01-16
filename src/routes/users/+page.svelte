<script lang="ts">
	import { trpc } from '$lib/client/api/api';

	const users = trpc.users.all.createQuery();

	const asdf = $users.data;
	asdf.;


</script>

<p>
	{#if $users.isPending}
		Loading...
	{:else if $users.isError}
		Error: {$users.error.message}
	{:else if $users.data}
		{$users.data}
		{#each $users.data as user}
			{user}
			{user.type}
		{/each}
		<br>
		{typeof users}
		<br>
		{typeof $users}
		<br>
		{typeof $users.data}
	{/if}
</p>