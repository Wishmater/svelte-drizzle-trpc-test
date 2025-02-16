import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

export function hashPassword(password: string): string {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(password)));
}
