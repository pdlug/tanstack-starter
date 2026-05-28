import {
  type AnyFieldApi,
  createFormHook,
  createFormHookContexts,
} from "@tanstack/react-form";

import { formatFormErrors } from "@/utils";

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

type TextAreaProps = Readonly<{
  label: string;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
}>;

function TextArea({ label, disabled, placeholder, rows = 4 }: TextAreaProps) {
  const field = useFieldContext<string>();

  return (
    <div className="space-y-2">
      <label htmlFor={field.name} className="block text-sm font-medium">
        {label}
      </label>
      <textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onChange={(event) => {
          field.handleChange(event.target.value);
        }}
        onBlur={field.handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
      <FormMessage field={field} />
    </div>
  );
}

function FormMessage({ field }: Readonly<{ field: AnyFieldApi }>) {
  if (field.state.meta.errors.length === 0 || !field.state.meta.isTouched)
    return;

  return (
    <div className="text-sm text-red-600">
      {formatFormErrors(field.state.meta.errors)}
    </div>
  );
}

export const { useAppForm } = createFormHook({
  fieldComponents: { TextField, TextArea },
  formComponents: {},
  fieldContext,
  formContext,
});
