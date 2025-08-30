import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/utils/tailwind";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500",
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary:
          "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
        outline:
          "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
      },
      size: {
        sm: "rounded px-3 py-1.5 text-sm",
        md: "rounded-md px-4 py-2 text-sm",
        lg: "rounded-lg px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export type ButtonProps = Readonly<
  PropsWithChildren &
    VariantProps<typeof buttonVariants> &
    ButtonHTMLAttributes<HTMLButtonElement>
>;

export function Button({
  children,
  variant,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
