<script lang="ts">
	import * as AlertDialog from '$lib/client/components/ui/alert-dialog/index.js';
	import { Completer } from '$lib/common/util/completer';

	interface Props {
		title: string;
		subtitle: string | undefined;
		submitText: string | undefined;
		cancelText: string | undefined;
		onSubmit: () => void | undefined;
		onCancel: () => void | undefined;
		showAlert: () => Promise<boolean>;
		children: any;
	}
	let {
		title = 'Are you sure?',
		subtitle,
		submitText = 'Confirm',
		cancelText = 'Cancel',
		onSubmit,
		onCancel,
		showAlert = $bindable(),
		children
	}: Props = $props();

	let open = $state(false);

	function onOpenChange(isOpen: boolean, isSubmit = false) {
		open = isOpen;
		if (isOpen) return; // we only care about close
		if (completer) {
			completer.complete(isSubmit);
			completer = null;
		} else {
			if (isSubmit) {
				if (onSubmit) onSubmit();
			} else {
				if (onCancel) onCancel();
			}
		}
	}

	let completer: Completer<boolean> | null = null;
	showAlert = () => {
		if (!completer) {
			completer = new Completer<boolean>();
		}
		onOpenChange(true);
		return completer!.promise;
	};
</script>

<AlertDialog.Root {open} {onOpenChange}>
	<AlertDialog.Trigger>
		{@render children?.()}
	</AlertDialog.Trigger>

	<AlertDialog.Content interactOutsideBehavior="close">
		<AlertDialog.Header>
			<AlertDialog.Title>{title}</AlertDialog.Title>
			{#if subtitle}
				<AlertDialog.Description>{subtitle}</AlertDialog.Description>
			{/if}
		</AlertDialog.Header>

		<AlertDialog.Footer>
			{#if cancelText}
				<AlertDialog.Cancel>{cancelText}</AlertDialog.Cancel>
			{/if}
			{#if submitText}
				<AlertDialog.Action onclick={() => onOpenChange(false, true)}>
					{submitText}
				</AlertDialog.Action>
			{/if}
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
