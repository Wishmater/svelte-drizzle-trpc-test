// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { User } from '$server/db/schema/user';
import type { Session } from '$server/db/schema/session';
import type { UserData } from '$common/validations/user';

declare global {
	namespace App {
		interface Locals {
			startTimer: number;
			user: UserData | undefined;
			session: Session | undefined;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
