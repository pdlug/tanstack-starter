export type AuthUser = Readonly<{
  id: string;
  email?: string;
}>;

export type AuthSession = Readonly<{
  user: AuthUser;
  session?: unknown;
}>;

export type MaybeAuthSession = AuthSession | undefined;
