/// <reference types="vite/client" />
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { APP_NAME } from "@/config";
import { getAuthSession } from "@/lib/auth/functions/get-auth-session";
import appCss from "@/styles/index.css?url";
import { Header } from "@/components/header";

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
            onClickLogout={() => {}}
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
