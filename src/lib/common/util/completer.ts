export class Completer<T> {
	readonly promise: Promise<T>;
	complete: (value: PromiseLike<T> | T) => void = undefined!;
	reject: (reason?: any) => void = undefined!;

	public constructor() {
		this.promise = new Promise<T>((resolve, reject) => {
			this.complete = resolve;
			this.reject = reject;
		});
	}
}
