import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/home")({
  component: Dashboard,
});

function Dashboard() {
  const { authSession } = Route.useRouteContext();

  return <div>Welcome {authSession.user.email}</div>;
}
