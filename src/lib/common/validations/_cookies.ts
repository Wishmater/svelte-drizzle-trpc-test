import * as v from 'valibot';

export type GetCookie = (key: string) => string | null | undefined;

export type DeleteCookie = (key: string) => void;

export type CookieSchema<T> = v.BaseSchema<string, T, v.BaseIssue<any>>;

export type ParseCookieParams<T> = {
	getCookie: GetCookie;
	deleteCookie: DeleteCookie;
	key: string;
	schema: CookieSchema<T>;
};

export function safeParseCookie<T>({
	getCookie,
	deleteCookie,
	key,
	schema
}: ParseCookieParams<T>): v.SafeParseResult<CookieSchema<T>> | null {
	const cookieVal = getCookie(key) ?? '';
	const result = v.safeParse(schema, cookieVal);
	if (!result.success) {
		deleteCookie(key);
	}
	return result;
}

// // prefer using safeParse, since it will clear the cookie if invalid, so far no valid use-case found for unsafe parse
// export function parseCookie<T>({ getCookie, key, schema }: ParseCookieParams<T>): T {
// 	const cookieVal = getCookie(key)!;
// 	return v.parse(schema, cookieVal);
// }
