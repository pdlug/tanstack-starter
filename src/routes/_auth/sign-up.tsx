import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import { useAppForm } from "@/components/Form";
import { authClient } from "@/lib/auth/auth-client";
import { formatFormErrors } from "@/utils/form-errors";

const signupSchema = z
  .object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    name: z.string().min(2, "Name must be at least 2 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function normalizeRedirectTo(
  redirectTo: string | undefined,
): string | undefined {
  if (!redirectTo) return undefined;

  try {
    const baseUrl = new URL("http://localhost");
    const resolvedUrl = new URL(redirectTo, baseUrl);

    if (resolvedUrl.origin !== baseUrl.origin) return undefined;

    const normalized = `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
    if (!normalized.startsWith("/") || normalized.startsWith("//"))
      return undefined;

    return normalized;
  } catch {
    return undefined;
  }
}

export const Route = createFileRoute("/_auth/sign-up")({
  validateSearch: z.object({
    redirectTo: z.string().optional(),
  }),
  beforeLoad: ({ context: { authSession }, search }) => {
    const safeRedirectTo = normalizeRedirectTo(search.redirectTo);
    if (authSession) {
      throw redirect({ to: safeRedirectTo ?? "/home" });
    }
  },
  component: SignUpPage,
});

function SignUpPage() {
  const [authError, setAuthError] = useState<string | undefined>();
  const { redirectTo }: { redirectTo?: string } = Route.useSearch();
  const safeRedirectTo = normalizeRedirectTo(redirectTo);

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
    validators: {
      onChange: signupSchema,
    },
    onSubmit: async ({ value }) => {
      setAuthError(undefined);
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            globalThis.location.assign(safeRedirectTo ?? "/home");
          },
          onError: (context) => {
            setAuthError(context.error.message);
          },
        },
      );
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
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
            <form.AppField name="name">
              {(field) => (
                <field.TextField
                  label="Full Name"
                  placeholder="Enter your full name"
                />
              )}
            </form.AppField>

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

            <form.AppField name="confirmPassword">
              {(field) => (
                <field.TextField
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                />
              )}
            </form.AppField>
          </div>

          <div>
            <button
              type="submit"
              disabled={!form.state.canSubmit}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {form.state.isSubmitting ?
                "Creating account..."
              : "Create account"}
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
