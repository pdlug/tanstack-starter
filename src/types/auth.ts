export type AuthUser = Readonly<{
  id: string;
  email?: string;
}>;

export type AuthSession = Readonly<{
  user: AuthUser;
}>;

export type MaybeAuthSession = AuthSession | undefined;
