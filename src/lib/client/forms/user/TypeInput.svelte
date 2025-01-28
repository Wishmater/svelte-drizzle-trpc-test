<script lang="ts">
	import { useFormField } from 'formsnap';
	import type { Infer } from 'sveltekit-superforms';
	import { UserInsertSchema } from '$lib/common/validations/user';
	import * as Form from '$lib/client/components/ui/form/index.js';
	import * as Select from '$lib/client/components/ui/select/index.js';
	import { userTypes } from '$lib/common/enums/user_types';

	const field = useFormField<Infer<typeof UserInsertSchema>>({});
	const formData = field.form.form;
</script>

<Form.Control>
	{#snippet children({ props })}
		<Form.Label>Type</Form.Label>
		<Select.Root type="single" bind:value={$formData.type} name="type">
			<Select.Trigger {...props}>
				{$formData.type ? $formData.type : 'Select user type...'}
			</Select.Trigger>
			<Select.Content>
				{#each userTypes as type}
					<Select.Item value={type} label={type} />
				{/each}
			</Select.Content>
		</Select.Root>
	{/snippet}
</Form.Control>
<Form.FieldErrors />
