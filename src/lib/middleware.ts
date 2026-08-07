import { createMiddleware } from "@tanstack/react-start";
import { env } from "cloudflare:workers";

import { connectToDB } from "@/db/db";

export const dbMiddleware = createMiddleware({ type: "function" }).server(
  ({ next }) => next({ context: { db: connectToDB(env.DB) } }),
);
