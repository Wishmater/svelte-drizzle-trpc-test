<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { Button, buttonVariants } from '$lib/client/components/ui/button';
	import InkWell from '$lib/client/widgets/inkwell.svelte';
	import SimpleAlertDialog from '$lib/client/widgets/simple_alert_dialog.svelte';
	import { Separator } from '$lib/client/components/ui/separator';
	import Users from 'lucide-svelte/icons/users';
</script>

<div class="flex flex-col content-center items-center justify-center">
	<InkWell class="flex flex-col items-center gap-12 rounded-xl p-12">
		<div class="flex flex-row gap-8">
			<Button variant="raised" href={route('/users')} class="!bg-blue-700 !text-zinc-100">
				<Users class="h-4 w-4" />
				Users
			</Button>

			<Button variant="raised" href={route('/posts')} class="!bg-green-700 !text-zinc-100">
				Posts
			</Button>

			<Button variant="raised" href={route('/tags')} class="!bg-orange-700 !text-zinc-100">
				Tags
			</Button>
		</div>
		<Separator />

		<Button variant="default">Default</Button>

		<Button variant="raised">Raised</Button>

		<Button variant="secondary">Secondary</Button>

		<Button variant="outline">Outline</Button>

		<Button variant="ghost" onclick={() => alert('kappa')}>Ghost</Button>

		<Button variant="link">Link</Button>

		<SimpleAlertDialog
			title="Alert Title"
			onSubmit={() => alert('onSubmit')}
			onCancel={() => alert('onCancel')}
		>
			<div class={buttonVariants({ variant: 'destructive' })}>Destructive</div>
		</SimpleAlertDialog>
	</InkWell>
</div>
