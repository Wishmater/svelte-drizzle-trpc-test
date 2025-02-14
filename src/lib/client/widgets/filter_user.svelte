<script lang="ts">
	import * as Popover from '$lib/client/components/ui/popover/index.js';
	import * as Command from '$lib/client/components/ui/command/index.js';
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { cn } from '$lib/client/utils';
	import { Button, buttonVariants } from '$lib/client/components/ui/button/index.js';
	import type { UserMinimal } from '$lib/common/validations/user';
	import { route } from '$lib/ROUTES';
	import Close from 'lucide-svelte/icons/x';

	interface Props {
		selectedUser: UserMinimal | null;
	}
	let { selectedUser = $bindable(null) }: Props = $props();

	let open = $state(false);

	let searchQuery: string = $state('');

	let usersPromise: Promise<UserMinimal[]> | undefined = $derived.by(() => {
		if (searchQuery.length < 3) {
			return undefined;
		}
		return getUsers(searchQuery);
	});

	async function getUsers(searchQuery: string): Promise<UserMinimal[]> {
		const apiResult = await fetch(route('GET /users/api', { query: searchQuery }));
		return apiResult.json();
	}
</script>

<div class="flex flex-row">
	<Popover.Root bind:open>
		<Popover.Trigger
			class={cn(
				buttonVariants({ variant: 'outline', size: 'adaptive' }),
				'w-40 justify-between py-1',
				!selectedUser && 'text-muted-foreground'
			)}
			role="combobox"
		>
			{#if selectedUser}
				{selectedUser.username}
			{:else}
				Filter by user...
			{/if}
			<ChevronsUpDown class="opacity-50" />
		</Popover.Trigger>
		<Popover.Content class="p-0">
			<Command.Root shouldFilter={false}>
				<Command.Input autofocus placeholder="Search tag..." class="h-9" bind:value={searchQuery} />
				{#if usersPromise}
					{#await usersPromise}
						<LoaderCircle size={34} class="px-auto my-6 w-full animate-spin"></LoaderCircle>
					{:then users}
						{#if users.length}
							<Command.Group>
								{#each users as user}
									<Command.Item
										value={user.username}
										onSelect={() => {
											selectedUser = user;
											open = false;
										}}
									>
										{user.username}
										<Check
											class={cn('ml-auto', selectedUser?.id !== user.id && 'text-transparent')}
										/>
									</Command.Item>
								{/each}
							</Command.Group>
						{:else}
							<div class="p-6 text-center text-sm">No users found.</div>
						{/if}
					{:catch _}
						Error !!!
					{/await}
				{:else}
					<div class="p-6 text-center text-sm">Please type at least 3 characters to search.</div>
				{/if}
			</Command.Root>
		</Popover.Content>
	</Popover.Root>

	{#if selectedUser}
		<Button variant="ghost" size="icon" onclick={() => (selectedUser = null)}>
			<Close />
		</Button>
	{/if}
</div>
