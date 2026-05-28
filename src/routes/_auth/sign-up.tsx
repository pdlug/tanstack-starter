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

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const searchSchema = z.object({ redirectTo: z.string().optional() });

export const Route = createFileRoute("/_auth/sign-up")({
  validateSearch: searchSchema,
  beforeLoad: ({ context: { authSession }, search }) => {
    if (authSession) {
      throw redirect({ to: normalizeRedirectTo(search.redirectTo) ?? "/home" });
    }
  },
  component: SignUpPage,
});

function SignUpPage() {
  const { redirectTo } = Route.useSearch();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | undefined>();

  const form = useAppForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    validators: { onChange: signupSchema },
    onSubmit: async ({ value }) => {
      setAuthError(undefined);
      const { data } = await authClient.signUp.email(
        { email: value.email, password: value.password, name: value.name },
        {
          onError: (context) => {
            setAuthError(context.error.message);
          },
        },
      );
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

          <button
            type="submit"
            disabled={!form.state.canSubmit}
            className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {form.state.isSubmitting ? "Creating account..." : "Create account"}
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
