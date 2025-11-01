import { createStart } from "@tanstack/react-start";

import { sessionRequestMiddleware } from "@/lib/auth/middleware";

export const startInstance = createStart(() => {
  return {
    defaultSsr: true,
    requestMiddleware: [sessionRequestMiddleware],
  };
});
