/// <reference types="vite/client" />
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useNavigate,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Header } from "@/components/header";
import { APP_NAME } from "@/config";
import { authClient } from "@/lib/auth/auth-client";
import { getAuthSession } from "@/lib/auth/functions/get-auth-session";
import appCss from "@/styles/index.css?url";

export const Route = createRootRoute({
  beforeLoad: async () => {
    const authSession = await getAuthSession();
    return { authSession };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: APP_NAME,
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
  notFoundComponent: () => <div>Not found</div>,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { authSession } = Route.useRouteContext();
  const navigate = useNavigate();

  function handleLogout() {
    void authClient.signOut();
    void navigate({ to: "/" });
  }

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="min-h-screen bg-gray-50">
          <Header
            isAuthenticated={!!authSession}
            user={authSession?.user}
            onClickLogout={handleLogout}
          />
          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
