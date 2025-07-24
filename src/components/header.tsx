import { Link } from "@tanstack/react-router";

import { APP_NAME } from "@/config";

export type HeaderProps = Readonly<{
  isAuthenticated: boolean;
  onClickLogout: () => void;
  user?: Readonly<{
    name: string;
  }>;
}>;

export function Header({ isAuthenticated, user, onClickLogout }: HeaderProps) {
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

          {isAuthenticated && user ?
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <button
                onClick={onClickLogout}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                <span>Logout</span>
              </button>
            </div>
          : <div className="flex items-center space-x-4">
              <Link
                to="/sign-in"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Up
              </Link>
            </div>
          }
        </div>
      </div>
    </header>
  );
}
