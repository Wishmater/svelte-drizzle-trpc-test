// prefer this over using TS enums, because enums type inference breaks sometimes with drizzle
export const userTypes = ['Type 1', 'Type 2', 'Type 3'] as const;
export type UserType = (typeof userTypes)[number];

// export enum UserType {
// 	'Type 1',
// 	'Type 2',
// 	'Type 3'
// }
