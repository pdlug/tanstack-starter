export function normalizeRedirectTo(
  redirectTo: string | undefined,
): string | undefined {
  if (!redirectTo) return undefined;

  try {
    const baseUrl = new URL("http://localhost");
    const resolvedUrl = new URL(redirectTo, baseUrl);

    if (resolvedUrl.origin !== baseUrl.origin) return undefined;

    const normalized = `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
    if (!normalized.startsWith("/") || normalized.startsWith("//"))
      return undefined;

    return normalized;
  } catch {
    return undefined;
  }
}
