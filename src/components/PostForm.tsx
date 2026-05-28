import { useState } from "react";

import { useAppForm } from "@/components/Form";
import { type PostFormValues, postSchema } from "@/lib/post-schema";

type PostFormProps = Readonly<{
  onSubmit: (data: PostFormValues) => Promise<void>;
  isSubmitting?: boolean;
}>;

export function PostForm({ onSubmit, isSubmitting = false }: PostFormProps) {
  const [submitError, setSubmitError] = useState<string | undefined>();

  const form = useAppForm({
    defaultValues: { title: "", content: "" },
    validators: { onBlur: postSchema },
    onSubmit: async ({ value }) => {
      setSubmitError(undefined);
      try {
        await onSubmit(value);
        form.reset();
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "Failed to create post",
        );
      }
    },
  });

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-xl font-semibold">Create New Post</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.AppField name="title">
          {(field) => (
            <field.TextField
              label="Title"
              placeholder="Enter post title..."
              disabled={isSubmitting}
            />
          )}
        </form.AppField>

        <form.AppField name="content">
          {(field) => (
            <field.TextArea
              label="Content"
              placeholder="Write your post content..."
              rows={6}
              disabled={isSubmitting}
            />
          )}
        </form.AppField>

        <button
          type="submit"
          disabled={!form.state.canSubmit || isSubmitting}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Post"}
        </button>

        {submitError && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {submitError}
          </div>
        )}
      </form>
    </div>
  );
}
