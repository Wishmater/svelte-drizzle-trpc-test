import * as v from 'valibot';
import type { User, UserInsert, UserUpdate } from '$lib/server/db/schema/user';
import { initCustomErrorMessages } from '$lib/common/validations/_valibot';
import { userTypes } from '$lib/common/enums/user_types';

initCustomErrorMessages(); // must be called on every validation file to ensure it is imported, will only run once

export const UserSchema = v.object({
	id: v.number(),
	username: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.maxLength(20)),
	email: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.email()),
	password: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.minLength(8)),
	age: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(150)),
	active: v.boolean(),
	type: v.picklist(userTypes),
	selectedDate: v.nullable(v.date(), null),
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
	'username',
	'email',
	'password'
]) satisfies v.GenericSchema<UserUpdate>;
