import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md border border-border-strong bg-bg-elevated px-3 text-base text-fg placeholder:text-subtle outline-none transition-[box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-primary/35",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-32 w-full rounded-lg border border-border-strong bg-bg-elevated px-3 py-3 text-base text-fg placeholder:text-subtle outline-none transition-[box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-primary/35",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
