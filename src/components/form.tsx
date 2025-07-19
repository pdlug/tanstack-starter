import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

const { fieldContext, formContext, useFieldContext } = createFormHookContexts();

type TextFieldProps = Readonly<{
  label: string;
  type?: "text" | "email" | "password";
  disabled?: boolean;
  placeholder?: string;
}>;

function TextField({
  label,
  type = "text",
  disabled,
  placeholder,
}: TextFieldProps) {
  const field = useFieldContext<string>();

  return (
    <div className="space-y-2">
      <label htmlFor={field.name} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={field.name}
        name={field.name}
        type={type}
        value={field.state.value}
        onChange={(event) => {
          field.handleChange(event.target.value);
        }}
        onBlur={field.handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
      <FormMessage field={field} />
    </div>
  );
}

type FormMessageProps = Readonly<{
  field: any;
}>;

function FormMessage({ field }: FormMessageProps) {
  if (field.state.meta.errors.length === 0) return;

  return (
    <div className="text-sm text-red-600">
      {field.state.meta.errors.join(", ")}
    </div>
  );
}

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
