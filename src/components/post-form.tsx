import { z } from "zod";

import { useAppForm } from "./form";

const postFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content must be less than 1000 characters"),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

type PostFormProps = Readonly<{
  onSubmit: (data: PostFormValues) => Promise<void>;
  isSubmitting?: boolean;
}>;

export function PostForm({ onSubmit, isSubmitting }: PostFormProps) {
  const form = useAppForm({
    defaultValues: {
      title: "",
      content: "",
    },
    validators: {
      onChange: postFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
      form.reset();
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
      </form>
    </div>
  );
}
