<script lang="ts">
	import { useFormField } from 'formsnap';
	import type { Infer } from 'sveltekit-superforms';
	import { UserInsertSchema } from '$lib/common/validations/user';
	import * as Form from '$lib/client/components/ui/form/index.js';
	import { Input } from '$lib/client/components/ui/input';

	const field = useFormField<Infer<typeof UserInsertSchema>>({});
	const formData = field.form.form;
</script>

<Form.Control>
	{#snippet children({ props })}
		<Form.Label>Username</Form.Label>
		<Input {...props} type="username" bind:value={$formData.username} {...field.constraints} />
	{/snippet}
</Form.Control>
<Form.Description class="sr-only">Your displayed username. Must be unique.</Form.Description>
<Form.FieldErrors />
