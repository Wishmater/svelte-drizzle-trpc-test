import * as v from 'valibot';
import type { BaseIssue } from 'valibot';
import { JsonStringParseSchema } from '$lib/common/validations/_valibot';

export const toastMessageKey = 'ToastMessage';

const toastMessageTypes = ['message', 'info', 'success', 'warning', 'error'];
export type ToastMessageType = (typeof toastMessageTypes)[number];

export const ToastMessageSchema = v.pipe(
	JsonStringParseSchema,
	v.object({
		type: v.picklist(toastMessageTypes),
		message: v.string(),
		description: v.optional(v.string())
	})
);

export type ToastMessage = v.InferOutput<typeof ToastMessageSchema>;
