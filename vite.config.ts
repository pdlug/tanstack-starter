import path from "node:path";

import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { type ConfigEnv, defineConfig, type UserConfig } from "vite";

function createViteConfig(configEnv: Readonly<ConfigEnv>): UserConfig {
  const isVitest =
    process.env["VITEST"] === "true" || configEnv.mode === "test";

  return {
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    optimizeDeps: {
      exclude: ["wrangler"],
    },
    plugins: [
      // Cloudflare plugin rejects Vitest's Node externals.
      ...(isVitest ? [] : [cloudflare({ viteEnvironment: { name: "ssr" } })]),
      tailwindcss(),
      tanstackStart({
        srcDirectory: "src",
        start: { entry: "./start.tsx" },
      }),
      viteReact(),
    ],
  };
}

export default defineConfig(createViteConfig);
