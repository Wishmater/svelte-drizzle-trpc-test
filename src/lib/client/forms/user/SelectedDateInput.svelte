<script lang="ts">
	import { cn } from '$lib/client/utils.js';
	import { Calendar } from '$lib/client/components/ui/calendar/index.js';
	import { CalendarIcon } from 'lucide-svelte';
	import { useFormField } from 'formsnap';
	import { UserInsertSchema } from '$lib/common/validations/user';
	import * as Form from '$lib/client/components/ui/form/index.js';
	import type { Infer } from 'sveltekit-superforms';
	import * as Popover from '$lib/client/components/ui/popover/index.js';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';

	const field = useFormField<Infer<typeof UserInsertSchema>>({});
	const formData = field.form.form;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value = $state<DateValue | undefined>();

	$effect(() => {
		value = $formData.selectedDate ? parseDate($formData.selectedDate) : undefined;
	});

	let placeholder = $state<DateValue>(today(getLocalTimeZone()));
</script>

<Form.Control>
	{#snippet children({ props })}
		<Form.Label>Some Random Date</Form.Label>
		<Popover.Root>
			<Popover.Trigger
				{...props}
				class={cn(
					buttonVariants({ variant: 'outline' }),
					'w-[280px] justify-start pl-4 text-left font-normal',
					!value && 'text-muted-foreground'
				)}
			>
				{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
				<CalendarIcon class="ml-auto size-4 opacity-50" />
			</Popover.Trigger>
			<Popover.Content class="w-auto p-0" side="top">
				<Calendar
					type="single"
					value={value as DateValue}
					bind:placeholder
					minValue={new CalendarDate(1900, 1, 1)}
					maxValue={today(getLocalTimeZone())}
					calendarLabel="Date of birth"
					onValueChange={(v) => {
						if (v) {
							$formData.dob = v.toString();
						} else {
							$formData.dob = '';
						}
					}}
				/>
			</Popover.Content>
		</Popover.Root>
	{/snippet}
</Form.Control>
<Form.FieldErrors />
