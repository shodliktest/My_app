import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpenText, Home, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Asosiy", icon: Home },
  { to: "/phrases", label: "Iboralar", icon: BookOpenText },
  { to: "/progress", label: "Natija", icon: LineChart },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideNav = pathname.startsWith("/learn");

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-bg">
      <div className={cn("flex-1", hideNav ? "pb-4" : "pb-28")}>{children}</div>
      {!hideNav && (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[max(0.4rem,env(safe-area-inset-bottom))] backdrop-blur-sm">
          <div className="mx-auto grid w-full max-w-lg grid-cols-3">
            {TABS.map((tab) => {
              const active = pathname === tab.to;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={cn(
                    "flex min-h-14 min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-center text-xs font-medium tracking-wide",
                    active ? "text-primary" : "text-muted",
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
                  <span className="w-full truncate">{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
