import { createMiddleware } from "@tanstack/react-start";

import { connectToDB } from "@/db/db";
import { getBindings } from "@/utils/bindings";

// Server function middleware: attaches a db connection to function context
export const dbMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const env = getBindings();
    const db = connectToDB(env.DB);

    return next({
      context: { db },
    });
  },
);
