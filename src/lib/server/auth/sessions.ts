import { type Session, sessions } from '$server/db/schema/session.js';
import { type User, users } from '$server/db/schema/user.js';
import { eq } from 'drizzle-orm';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { db } from '$server/db/db';

const sessionDuration = 1000 * 60 * 60 * 24 * 30; // 30 days
const sessionRestoreThreshold = sessionDuration / 2;

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	return encodeBase32LowerCaseNoPadding(bytes);
}

export async function createSession(token: string, userId: number): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + sessionDuration)
	};
	await db.insert(sessions).values(session);
	return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await db
		.select({ user: users, session: sessions })
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(eq(sessions.id, sessionId));
	if (result.length < 1) {
		return { session: null, user: null, isRefreshed: null };
	}
	const { user, session } = result[0];
	// @ts-ignore
	delete user.password;
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessions).where(eq(sessions.id, session.id));
		return { session: null, user: null, isRefreshed: null };
	}
	let isRefreshed = false;
	if (Date.now() >= session.expiresAt.getTime() - sessionRestoreThreshold) {
		isRefreshed = true;
		session.expiresAt = new Date(Date.now() + sessionDuration);
		await db
			.update(sessions)
			.set({
				expiresAt: session.expiresAt
			})
			.where(eq(sessions.id, session.id));
	}
	return { session, user, isRefreshed };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function invalidateAllSessions(userId: number): Promise<void> {
	await db.delete(sessions).where(eq(sessions.userId, userId));
}

export type SessionValidationResult =
	| { session: Session; user: User; isRefreshed: boolean }
	| { session: null; user: null; isRefreshed: null };
