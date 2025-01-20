<script lang="ts">
	import Button from '$lib/client/widgets/button.svelte';
</script>

<div class="h-16"></div>
<form method="POST" class="flex flex-col items-center gap-2">
	<label>
		Username
		<input name="username" />
	</label>
	<label>
		Email
		<input name="email" type="email" />
	</label>
	<label>
		Password
		<input name="password" type="password" />
	</label>
	<label>
		Age
		<input name="age" type="number" />
	</label>
	<label>
		Type
		<input name="type" />
	</label>

	<Button>Create User</Button>
</form>
