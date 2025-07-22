import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { auth } from "@/lib/auth/auth";

export const getAuthSession = createServerFn({
  method: "GET",
}).handler(async () => {
  const { headers } = getWebRequest();
  const session = await auth.api.getSession({
    headers,
  });

  return session;
});
