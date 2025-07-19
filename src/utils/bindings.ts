// eslint-disable-next-line functional/no-let
let cachedEnv: Env | undefined;

// This gets called once at startup when running locally
const initDevelopmentEnv = async () => {
  const { getPlatformProxy } = await import("wrangler");
  const proxy = await getPlatformProxy();
  cachedEnv = proxy.env as unknown as Env;
};

if (import.meta.env.DEV) {
  await initDevelopmentEnv();
}

/**
 * Will only work when being accessed on the server. Obviously, CF bindings are not available in the browser.
 * @returns
 */
export function getBindings(): Env {
  if (import.meta.env.DEV) {
    if (!cachedEnv) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error(
        "Dev bindings not initialized yet. Call initDevEnv() first.",
      );
    }
    return cachedEnv;
  }

  return process.env as unknown as Env;
}
