<script lang="ts">
	import { trpc } from '$lib/client/api/api';

	function generateRandomString(length: number): string {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			result += characters.charAt(randomIndex);
		}
		return result;
	}
	const randomString = generateRandomString(8);

	const hello = trpc.hello.createQuery();

	const greeting = trpc.greeting.createQuery(randomString);

</script>

Hello Endpoint:
<br>
{#if $hello.isPending}
	Loading...
{:else if $hello.isError}
	Error: {$hello.error.message}
{:else if $hello.data}
	{$hello.data}
{/if}

<br>
<br>

Greeting Endpoint ({randomString}):
<br>
{#if $greeting.isPending}
	Loading...
{:else if $greeting.isError}
	Error: {$greeting.error.message}
{:else if $greeting.data}
	{$greeting.data}
{/if}

<br>
<br>

<a href="/users">Users</a>