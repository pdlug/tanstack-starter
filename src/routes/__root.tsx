/// <reference types="vite/client" />

import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { Header } from "@/components/Header";
import { NotFound } from "@/components/NotFound";
import { APP_NAME } from "@/config";
import { authClient } from "@/lib/auth/auth-client";
import { getAuthSession } from "@/lib/auth/functions/get-auth-session";
import appCss from "@/styles/index.css?url";
import type { MaybeAuthSession } from "@/types/auth";

type RouterContext = Readonly<{
  authSession: MaybeAuthSession;
}>;

export const Route = createRootRouteWithContext<RouterContext>()({
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
  notFoundComponent: () => <NotFound />,
  errorComponent: DefaultCatchBoundary,
  pendingComponent: RootPending,
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
  const router = useRouter();

  function handleLogout() {
    void (async () => {
      try {
        await authClient.signOut();
      } catch (error) {
        console.error("[auth] Failed to sign out", error);
      } finally {
        router.history.push("/");
      }
    })();
  }

  const user = authSession?.user;
  const headerUser = user?.email ? { ...user, email: user.email } : undefined;

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="min-h-screen bg-gray-50">
          <Header
            isAuthenticated={!!authSession}
            onClickLogout={handleLogout}
            {...(headerUser && { user: headerUser })}
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

function RootPending() {
  return (
    <RootDocument>
      <div className="space-y-3" aria-busy="true">
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
      </div>
    </RootDocument>
  );
}
