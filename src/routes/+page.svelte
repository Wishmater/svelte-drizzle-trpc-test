<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { Button } from '$lib/client/components/ui/button';
	import InkWell from '$lib/client/widgets/inkwell.svelte';
	import { Separator } from '$lib/client/components/ui/separator';
	import Users from 'lucide-svelte/icons/users';
</script>

<div class="flex flex-col content-center items-center justify-center">
	<InkWell class="flex flex-col items-center gap-12 rounded-xl p-12">
		<Button variant="raised" href={route('/users')} class="!bg-blue-700 !text-zinc-100">
			<Users class="h-4 w-4" />
			Users
		</Button>
		<Separator />

		<Button variant="default">Default</Button>

		<Button variant="raised">Raised</Button>

		<Button variant="secondary">Secondary</Button>

		<Button variant="outline">Outline</Button>

		<Button variant="ghost" onclick={() => alert('kappa')}>Ghost</Button>

		<Button variant="link">Link</Button>

		<Button variant="destructive">Destructive</Button>
	</InkWell>
</div>
