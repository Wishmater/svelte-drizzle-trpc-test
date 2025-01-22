<script lang="ts">
	import MyButton from '$lib/client/widgets/button.svelte';
	import { route } from '$lib/ROUTES';
	import { Button } from '$lib/client/components/ui/button';
</script>

<div class="flex flex-col content-center items-center justify-center">
	<MyButton buttonType="inkwell" class="flex flex-col items-center gap-12 rounded-xl p-12">
		<a href={route('/users')}>
			<Button variant="raised" class="!bg-blue-700 !text-zinc-100">Users</Button>
		</a>

		<Button variant="default">Default</Button>

		<Button variant="raised">Raised</Button>

		<Button variant="secondary">Secondary</Button>

		<Button variant="outline">Outline</Button>

		<Button variant="ghost" onclick={() => alert('kappa')}>Ghost</Button>

		<Button variant="link">Link</Button>

		<Button variant="destructive">Destructive</Button>
	</MyButton>
</div>
