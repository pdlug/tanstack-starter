import { Link } from "@tanstack/react-router";

import { Button } from "@/components/Button";
import { APP_NAME } from "@/config";

// Minimal user shape needed by the header
type HeaderUser = Readonly<{
  id: string;
  email: string;
  name?: string;
  image?: string;
}>;

type AuthenticatedNavProps = Readonly<{
  onClickLogout: () => void;
  user?: HeaderUser;
}>;

function AuthenticatedNav({ onClickLogout, user }: AuthenticatedNavProps) {
  return (
    <div className="flex items-center space-x-4">
      <p className="hidden text-sm font-medium text-gray-700 sm:block">
        Welcome, {user?.name ?? user?.email}
      </p>
      <Link to="/home">
        <Button size="sm" variant="primary">
          Go to app
        </Button>
      </Link>
      <button
        onClick={onClickLogout}
        className="flex items-center space-x-1 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:text-gray-400"
      >
        <span>Logout</span>
      </button>
    </div>
  );
}

function UnauthenticatedNav() {
  return (
    <div className="flex items-center space-x-4">
      <Link
        to="/sign-in"
        className="text-sm font-semibold text-gray-700 hover:text-gray-400"
      >
        Sign In
      </Link>
      <Link to="/sign-up">
        <Button size="sm">Sign Up</Button>
      </Link>
    </div>
  );
}

export type HeaderProps = Readonly<{
  isAuthenticated: boolean;
  onClickLogout: () => void;
  user?: HeaderUser;
}>;

export function Header({ isAuthenticated, onClickLogout, user }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-xl font-semibold text-gray-900">
                {APP_NAME}
              </h1>
            </Link>
          </div>

          {isAuthenticated ?
            <AuthenticatedNav
              onClickLogout={onClickLogout}
              {...(user && { user: user })}
            />
          : <UnauthenticatedNav />}
        </div>
      </div>
    </header>
  );
}
