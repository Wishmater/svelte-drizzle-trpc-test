<script lang="ts">
	import Button from '$lib/client/widgets/button.svelte';
</script>

<div class="flex flex-col content-center items-center justify-center">
	<Button buttonType="inkwell" className="rounded-xl flex flex-col items-center p-12 gap-12">
		<a href="/users">
			<Button className="bg-blue-700">Users</Button>
		</a>

		<Button className="bg-blue-900">Component</Button>

		<Button buttonType="outlined">Outlined</Button>

		<Button buttonType="ghost">Ghost</Button>
	</Button>
</div>
