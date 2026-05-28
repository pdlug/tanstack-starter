import { formatFormErrors } from "@/utils/form-errors";

type AuthErrorProps = Readonly<{
  authError?: string;
  formErrors: readonly unknown[];
}>;

export function AuthError({ authError, formErrors }: AuthErrorProps) {
  const message = authError ?? formatFormErrors(formErrors);
  if (!message) return;

  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="text-sm text-red-700">{message}</div>
    </div>
  );
}
