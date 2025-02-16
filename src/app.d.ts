// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session } from '$server/db/schema/session';
import type { UserData } from '$common/validations/user';

declare global {
	namespace App {
		interface Locals {
			isApi: boolean;
			startTimer: number;
			user: UserData | null | undefined;
			session: Session | null | undefined;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
