import { type ChildProcess, spawn } from "node:child_process";

const PREVIEW_ORIGIN = "http://127.0.0.1:4173";
const STARTUP_TIMEOUT_MS = 30_000;

function startPreviewServer(): ChildProcess {
  return spawn(
    "pnpm",
    [
      "exec",
      "vite",
      "preview",
      "--host",
      "127.0.0.1",
      "--port",
      "4173",
      "--strictPort",
    ],
    {
      env: process.env,
      stdio: "inherit",
    },
  );
}

function delay(durationMilliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, durationMilliseconds));
}

async function waitForPreview(
  server: ChildProcess,
  deadline = Date.now() + STARTUP_TIMEOUT_MS,
): Promise<void> {
  if (server.exitCode !== null) {
    throw new Error(`Preview server exited with code ${server.exitCode}`);
  }

  try {
    const response = await fetch(PREVIEW_ORIGIN);
    if (response.ok) return;
  } catch {
    // The Worker has not started accepting connections yet.
  }

  if (Date.now() >= deadline) {
    throw new Error("Timed out waiting for the preview server");
  }

  await delay(100);
  // eslint-disable-next-line unicorn/no-useless-recursion -- functional style forbids loop statements
  return waitForPreview(server, deadline);
}

async function assertSuccessfulResponse(
  pathname: string,
  expectedContent?: string,
): Promise<void> {
  const response = await fetch(`${PREVIEW_ORIGIN}${pathname}`);
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`${pathname} returned HTTP ${response.status}: ${body}`);
  }

  if (expectedContent && !body.includes(expectedContent)) {
    throw new Error(`${pathname} did not include ${expectedContent}`);
  }
}

async function stopPreviewServer(server: ChildProcess): Promise<void> {
  if (server.exitCode !== null) return;

  server.kill("SIGTERM");
  await new Promise<void>((resolve) => {
    server.once("exit", () => {
      resolve();
    });
  });
}

async function main(): Promise<void> {
  const server = startPreviewServer();

  try {
    await waitForPreview(server);
    await assertSuccessfulResponse("/", "Hello World");
    await assertSuccessfulResponse("/api/auth/get-session");
    console.log("Worker smoke test passed: / and /api/auth/get-session");
  } finally {
    await stopPreviewServer(server);
  }
}

await main();
