/**
 * Formats an array of form errors into a user-friendly string
 * Handles various error types including strings, objects with message property, and unknown types
 */
export function formatFormErrors(errors: readonly unknown[]): string {
  if (errors.length === 0) return "";

  return errors
    .map((error) => {
      if (typeof error === "string") return error;
      if (error && typeof error === "object" && "message" in error) {
        const message = error.message;
        return typeof message === "string" ? message : String(message);
      }
      return "An error occurred";
    })
    .join(", ");
}
