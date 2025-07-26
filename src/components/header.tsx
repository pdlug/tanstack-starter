import { Link } from "@tanstack/react-router";

import { Button } from "@/components/button";
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
          : <div className="flex items-center space-x-4">
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
          }
        </div>
      </div>
    </header>
  );
}
