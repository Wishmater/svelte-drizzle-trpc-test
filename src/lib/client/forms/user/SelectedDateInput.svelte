<script lang="ts">
	import { cn } from '$lib/client/utils.js';
	import { Calendar } from '$lib/client/components/ui/calendar/index.js';
	import { CalendarIcon } from 'lucide-svelte';
	import { useFormField } from 'formsnap';
	import { UserInsertSchema } from '$lib/common/validations/user';
	import * as Form from '$lib/client/components/ui/form/index.js';
	import type { Infer } from 'sveltekit-superforms';
	import * as Popover from '$lib/client/components/ui/popover/index.js';
	import { buttonVariants } from '$lib/client/components/ui/button/index.js';
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

	const longFormat = new DateFormatter('en-US', { dateStyle: 'long' });

	let isOpen = $state(false);

	let placeholder = $state<DateValue>(today(getLocalTimeZone()));

	let value = $derived.by(() => {
		const selectedDate = $formData.selectedDate;
		if (!selectedDate) return undefined;
		if (selectedDate instanceof Date) return parseDate(selectedDate.toISOString().slice(0, 10));
		return parseDate((selectedDate as any).toString().slice(0, 10));
	});
</script>

<Form.Control>
	{#snippet children({ props })}
		<Form.Label>Some Random Date</Form.Label>
		<Popover.Root bind:open={isOpen}>
			<Popover.Trigger
				{...props}
				class={cn(
					buttonVariants({ variant: 'outline' }),
					'w-full justify-start pl-4 text-left font-normal',
					!value && 'text-muted-foreground'
				)}
			>
				{value ? longFormat.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
				<CalendarIcon class="ml-auto size-4 opacity-50" />
			</Popover.Trigger>
			<Popover.Content class="w-auto p-0" side="top">
				<Calendar
					type="single"
					{value}
					bind:placeholder
					minValue={new CalendarDate(1900, 1, 1)}
					maxValue={today(getLocalTimeZone())}
					calendarLabel="Some Random Date"
					onValueChange={(v) => {
						$formData.selectedDate = v?.toDate(getLocalTimeZone()) ?? null;
						isOpen = false;
					}}
				/>
			</Popover.Content>
		</Popover.Root>
		<input hidden value={$formData.selectedDate} name={props.name} />
	{/snippet}
</Form.Control>
<Form.FieldErrors />
