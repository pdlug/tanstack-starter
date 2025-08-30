import { createStart } from "@tanstack/react-start";

import type { MaybeAuthSession } from "@/types/auth";

export const startInstance = createStart(() => {
  return {
    defaultSsr: true,
  };
});

declare module "@tanstack/react-router" {
  interface Register {
    router: {
      context: {
        authSession: MaybeAuthSession;
      };
    };
  }
}
