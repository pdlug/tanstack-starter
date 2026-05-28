import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import { AuthError } from "@/components/AuthError";
import { useAppForm } from "@/components/Form";
import { authClient } from "@/lib/auth/auth-client";
import { normalizeRedirectTo } from "@/utils";

const signinSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const searchSchema = z.object({ redirectTo: z.string().optional() });

export const Route = createFileRoute("/_auth/sign-in")({
  validateSearch: searchSchema,
  beforeLoad: ({ context: { authSession }, search }) => {
    if (authSession) {
      throw redirect({ to: normalizeRedirectTo(search.redirectTo) ?? "/home" });
    }
  },
  component: SignInPage,
});

function SignInPage() {
  const { redirectTo } = Route.useSearch();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | undefined>();

  const form = useAppForm({
    defaultValues: { email: "", password: "" },
    validators: { onChange: signinSchema },
    onSubmit: async ({ value }) => {
      setAuthError(undefined);
      const { data } = await authClient.signIn.email(value, {
        onError: (context) => {
          setAuthError(context.error.message);
        },
      });
      if (data) {
        await navigate({
          to: normalizeRedirectTo(redirectTo) ?? "/home",
          reloadDocument: true,
        });
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <header>
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
        </header>

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

          <button
            type="submit"
            disabled={!form.state.canSubmit}
            className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {form.state.isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          <AuthError
            {...(authError && { authError })}
            formErrors={form.state.errors}
          />
        </form>
      </div>
    </div>
  );
}
