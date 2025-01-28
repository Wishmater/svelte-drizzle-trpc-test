<script lang="ts">
	import { useFormField } from 'formsnap';
	import type { Infer } from 'sveltekit-superforms';
	import { UserInsertSchema } from '$lib/common/validations/user';

	const field = useFormField<Infer<typeof UserInsertSchema>>({});
	const formData = field.form.form;
	console.log();
</script>

<label for="username" class="pt-4">Username</label>
<input
	type="text"
	name="username"
	aria-invalid={field.errors ? 'true' : undefined}
	bind:value={$formData.username}
	{...field.constraints}
/>
{#if field.errors}<span class="text-red-500">{field.errors}</span>{/if}
