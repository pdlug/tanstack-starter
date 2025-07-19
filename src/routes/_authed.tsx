import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context: { authSession } }) => {
    if (!authSession) {
      throw redirect({ to: "/sign-in" });
    }

    return {
      authSession,
    };
  },
  component: Outlet,
});
