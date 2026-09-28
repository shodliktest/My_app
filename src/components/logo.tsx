import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("text-primary", className)} aria-hidden>
      <rect width="48" height="48" rx="12" fill="currentColor" />
      <path
        d="M12 31.5c6.2-1.8 9.4-6.8 12-12.4 2.4 5.2 5.8 9.8 12 12.4"
        fill="none"
        stroke="#FCFAf6"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M16.5 18.5h15M18 18.5v11.2c0 1.4 2.6 2.6 6 2.6s6-1.2 6-2.6V18.5"
        fill="none"
        stroke="#FCFAf6"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M24 18.5v13.3" fill="none" stroke="#FCFAf6" strokeWidth="1.6" />
    </svg>
  );
}

export function LogoWordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="size-9" />
      <div className="leading-tight">
        <div className="font-display text-[15px] font-semibold tracking-tight text-fg">Shodlik</div>
        <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Education</div>
      </div>
    </div>
  );
}
