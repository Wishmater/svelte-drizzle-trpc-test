import * as v from 'valibot';
import type { User, UserInsert, UserUpdate } from '$lib/server/db/schema/schema';
import type { ObjectSchema } from 'valibot';
import { initCustomErrorMessages } from '$lib/common/validations/_valibot';

initCustomErrorMessages(); // must be called on every validation file to ensure it is imported, will only run once

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
	username: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.maxLength(20)), // TODO 1 validate unique ?
	email: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.email()),
	password: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.minLength(8)),
	age: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(150)),
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
	'createdAt',
	'email',
	'password'
]) satisfies v.GenericSchema<UserUpdate>;
