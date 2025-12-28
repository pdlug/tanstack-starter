import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import { useAppForm } from "@/components/Form";
import { authClient } from "@/lib/auth/auth-client";
import { formatFormErrors, normalizeRedirectTo } from "@/utils";

const signinSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const Route = createFileRoute("/_auth/sign-in")({
  validateSearch: z.object({
    redirectTo: z.string().optional(),
  }),
  beforeLoad: ({ context: { authSession }, search }) => {
    const safeRedirectTo = normalizeRedirectTo(search.redirectTo);
    if (authSession) {
      throw redirect({ to: safeRedirectTo ?? "/home" });
    }
  },
  component: SignInPage,
});

function SignInPage() {
  const [authError, setAuthError] = useState<string | undefined>();
  const { redirectTo }: { redirectTo?: string } = Route.useSearch();
  const safeRedirectTo = normalizeRedirectTo(redirectTo);
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: signinSchema,
    },
    onSubmit: async ({ value }) => {
      setAuthError(undefined);
      const result = await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onError: (context) => {
            setAuthError(context.error.message);
          },
        },
      );

      if (result.data) {
        void navigate({ to: safeRedirectTo ?? "/home", reloadDocument: true });
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </Link>
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4">
            <form.AppField name="email">
              {(field) => (
                <field.TextField
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                />
              )}
            </form.AppField>

            <form.AppField name="password">
              {(field) => (
                <field.TextField
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                />
              )}
            </form.AppField>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!form.state.canSubmit}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {form.state.isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>

          {(form.state.errors.length > 0 || authError) && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {authError ?? formatFormErrors(form.state.errors)}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
