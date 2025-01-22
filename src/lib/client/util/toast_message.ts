import { safeParseCookie } from '$lib/common/validations/_cookies';
import { deleteCookie, getCookie } from '$lib/client/util/cookies';
import { toastMessageKey, ToastMessageSchema } from '$lib/common/util/toast_message';
import { toast } from 'svelte-sonner';

export function checkForServerToastMessage() {
	const toastMessage = safeParseCookie({
		getCookie,
		deleteCookie,
		key: toastMessageKey,
		schema: ToastMessageSchema
	});

	if (toastMessage?.success) {
		switch (toastMessage.output.type) {
			case 'message':
				toast.message(toastMessage.output.message, {
					description: toastMessage.output.description
				});
				break;
			case 'info':
				toast.info(toastMessage.output.message, { description: toastMessage.output.description });
				break;
			case 'success':
				toast.success(toastMessage.output.message, {
					description: toastMessage.output.description
				});
				break;
			case 'warning':
				toast.warning(toastMessage.output.message, {
					description: toastMessage.output.description
				});
				break;
			case 'error':
				toast.error(toastMessage.output.message, {
					description: toastMessage.output.description
				});
				break;
		}
		deleteCookie(toastMessageKey);
	}
}
