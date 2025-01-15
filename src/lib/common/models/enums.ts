
export enum Roles {
	admin,
	creator,
	viewer,
}

export const userTypes = [
	'Type 1',
	'Type 2',
	'Type 3',
] as const;
export type UserType = (typeof userTypes)[number];