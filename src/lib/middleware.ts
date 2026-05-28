import { createMiddleware } from "@tanstack/react-start";

import { connectToDB } from "@/db/db";

export const dbMiddleware = createMiddleware({ type: "function" }).server(
  ({ context, next }) => next({ context: { db: connectToDB(context.env.DB) } }),
);
