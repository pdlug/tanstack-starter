import { PostCreationError } from "@/lib/errors";
import { type PostFormValues, postSchema } from "@/lib/validation";

import { useAppForm } from "./Form";

type PostFormProps = Readonly<{
  onSubmit: (data: PostFormValues) => Promise<void>;
  isSubmitting?: boolean;
  onError?: (_error: Readonly<PostCreationError>) => void;
}>;

export function PostForm({ onSubmit, isSubmitting, onError }: PostFormProps) {
  const form = useAppForm({
    defaultValues: {
      title: "",
      content: "",
    },
    validators: {
      onBlur: postSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await onSubmit(value);
        form.reset();
      } catch (error) {
        const postError =
          error instanceof PostCreationError ? error : (
            new PostCreationError("Failed to create post", { cause: error })
          );
        onError?.(postError);
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
              disabled={!!isSubmitting}
            />
          )}
        </form.AppField>

        <form.AppField name="content">
          {(field) => (
            <field.TextArea
              label="Content"
              placeholder="Write your post content..."
              rows={6}
              disabled={!!isSubmitting}
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
      </form>
    </div>
  );
}
