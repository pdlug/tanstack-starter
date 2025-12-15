import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Button, buttonVariants } from "@/components/Button";

type NotFoundProps = Readonly<{
  children?: ReactNode;
}>;

export function NotFound({ children }: NotFoundProps) {
  return (
    <div className="space-y-4 p-4">
      <div className="text-gray-600 dark:text-gray-400">
        {children ?? <p>The page you are looking for does not exist.</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            globalThis.history.back();
          }}
        >
          Go back
        </Button>
        <Link to="/" className={buttonVariants({ variant: "primary", size: "sm" })}>
          Start Over
        </Link>
      </div>
    </div>
  );
}
