import { initCustomErrorMessages } from '$common/validations/_valibot';
import * as v from 'valibot';

initCustomErrorMessages(); // must be called on every validation file to ensure it is imported, will only run once

export const LoginSchema = v.object({
	username: v.pipe(v.string(), v.trim(), v.nonEmpty()),
	password: v.pipe(v.string(), v.trim(), v.nonEmpty())
});
export type Login = v.InferOutput<typeof LoginSchema>;
