export type Result<T, E = Error> =
  | Readonly<{ success: true; data: T }>
  | Readonly<{ success: false; error: E }>;

export function unwrap<T, E extends Error>(result: Result<T, E>): T {
  if (result.success) return result.data;
  // eslint-disable-next-line functional/no-throw-statements -- unwrap converts Result back to exception at framework boundaries
  throw result.error;
}

export async function safe<T, E extends Error>(
  fn: () => Promise<T>,
  toError: (cause: unknown) => E,
): Promise<Result<T, E>> {
  try {
    return { success: true, data: await fn() };
  } catch (error) {
    return { success: false, error: toError(error) };
  }
}
