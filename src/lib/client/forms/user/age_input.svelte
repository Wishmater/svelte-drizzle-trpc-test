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
		<Form.Label>Age</Form.Label>
		<Input {...props} type="number" bind:value={$formData.age} {...field.constraints} />
	{/snippet}
</Form.Control>
<Form.FieldErrors />
