import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { auth } from "@/lib/auth/auth";

export const getAuthSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) return;
    return { session: session.session, user: session.user };
  },
);
