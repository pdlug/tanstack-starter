import type { User } from "better-auth";

export type AuthUser = Readonly<{
  [K in keyof User]: Exclude<User[K], null>;
}>;

export type AuthSession = Readonly<{ user: AuthUser }>;

export type MaybeAuthSession = AuthSession | undefined;
