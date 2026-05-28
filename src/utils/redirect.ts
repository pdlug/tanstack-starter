const REDIRECT_BASE = new URL("http://localhost");

export function normalizeRedirectTo(
  redirectTo: string | undefined,
): string | undefined {
  if (!redirectTo) return;

  const resolved = URL.parse(redirectTo, REDIRECT_BASE);
  if (resolved?.origin !== REDIRECT_BASE.origin) return;

  const path = `${resolved.pathname}${resolved.search}${resolved.hash}`;
  if (!path.startsWith("/") || path.startsWith("//")) return;

  return path;
}
