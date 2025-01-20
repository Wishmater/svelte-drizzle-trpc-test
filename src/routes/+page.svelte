<script lang="ts">
	import Button from '$lib/client/widgets/button.svelte';
	import { route } from '$lib/ROUTES';
</script>

<div class="flex flex-col content-center items-center justify-center">
	<Button buttonType="inkwell" class="flex flex-col items-center gap-12 rounded-xl p-12">
		<a href={route('/users')}>
			<Button class="!bg-blue-700">Users</Button>
		</a>

		<Button class="!bg-blue-900">Component</Button>

		<Button buttonType="outlined">Outlined</Button>

		<Button buttonType="ghost">Ghost</Button>
	</Button>
</div>
