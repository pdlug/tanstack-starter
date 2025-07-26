import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context: { authSession }, location }) => {
    if (!authSession) {
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.pathname },
      });
    }

    return {
      authSession,
    };
  },
  component: Outlet,
});
