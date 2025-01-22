export function getCookie(name: string): string | null {
	const nameLenPlus = name.length + 1;
	return (
		document.cookie
			.split(';')
			.map((c) => c.trim())
			.filter((cookie) => {
				return cookie.substring(0, nameLenPlus) === `${name}=`;
			})
			.map((cookie) => {
				return decodeURIComponent(cookie.substring(nameLenPlus));
			})[0] || null
	);
}

export function setCookie(name: string, value: string) {
	document.cookie = name + '=' + value + '; Path=/;';
}

export function deleteCookie(name: string) {
	document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function getAllCookies() {
	return document.cookie
		.split(';')
		.map((cookie) => cookie.split('='))
		.reduce(
			(previous, current) => ({
				...previous,
				[String(current[0])]: String(current[1])
			}),
			{}
		) as { [key: string]: string };
}
