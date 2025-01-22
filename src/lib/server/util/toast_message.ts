import { type ToastMessage, toastMessageKey } from '$lib/common/util/toast_message';
import { dev } from '$app/environment';
import { type Cookies, redirect } from '@sveltejs/kit';

export function setToastMessageCookie(cookies: Cookies, toastMessage: ToastMessage) {
	// TODO 2 this works on redirect, but not on forms: check if it works on custom fetch requests, and figure out a way to make it work with superforms validation fail, maybe by hijacking the customRequest in onSubmit
	cookies.set(toastMessageKey, JSON.stringify(toastMessage), {
		path: '/',
		maxAge: 300,
		httpOnly: false,
		secure: !dev
	});
}

export function redirectWithMessage(
	status: number,
	route: string,
	cookies: Cookies,
	toastMessage: ToastMessage
) {
	// TODO 1 figure out a clever way to make client-server communication data cookies type safe (with custom types, not just ToastMessage)
	setToastMessageCookie(cookies, toastMessage);
	return redirect(status, route);
}
