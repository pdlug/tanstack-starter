import { createFileRoute } from "@tanstack/react-router";

import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/_authed/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session?.user.name}!</p>
      <button onClick={() => authClient.signOut()}>Sign Out</button>
    </div>
  );
}
