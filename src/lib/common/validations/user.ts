import * as v from 'valibot';
import type { User, UserInsert, UserUpdate } from '$lib/server/db/schema/schema';
import type { ObjectSchema } from 'valibot';

// prefer this over using TS enums, because enums type inference breaks sometimes with drizzle
export const userTypes = ['Type 1', 'Type 2', 'Type 3'] as const;
export type UserType = (typeof userTypes)[number];
// export enum UserType {
// 	'Type 1',
// 	'Type 2',
// 	'Type 3'
// }

export const UserSchema = v.object({
	id: v.number(),
	username: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(20)), // TODO 1 validate unique ?
	email: v.pipe(v.string(), v.trim(), v.email()),
	password: v.pipe(v.string(), v.trim(), v.minLength(8)),
	age: v.pipe(v.number(), v.minValue(1), v.maxValue(150)),
	active: v.boolean(),
	type: v.picklist(userTypes),
	selectedDate: v.nullable(v.date()),
	createdAt: v.date()
}) satisfies v.GenericSchema<User>;

export const UserInsertSchema = v.omit(UserSchema, [
	'id',
	'createdAt',
	'active'
]) satisfies v.GenericSchema<UserInsert>;

export const UserUpdateSchema = v.omit(UserSchema, [
	'id',
	'email',
	'password',
	'createdAt'
]) satisfies v.GenericSchema<UserUpdate>;
