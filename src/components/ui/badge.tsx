import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-fg",
        soft: "bg-primary-soft text-fg",
        outline: "border border-border-strong text-muted",
        warn: "bg-warn/15 text-warn",
        danger: "bg-danger/12 text-danger",
      },
    },
    defaultVariants: { variant: "soft" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
