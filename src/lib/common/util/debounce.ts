import { Completer } from '$common/util/completer';

export function debounce<T extends Function>(originalFunction: T, wait = 100): T {
	let previousTimeout = 0;
	let callable = (...args: any) => {
		clearTimeout(previousTimeout);
		const completer = new Completer();
		previousTimeout = setTimeout(() => {
			const result = originalFunction(...args);
			completer.complete(result);
			return result;
		}, wait) as unknown as number;
		return completer.promise;
	};
	return <T>(<any>callable);
}
