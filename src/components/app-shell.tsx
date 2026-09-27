import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Brain, Home, Mic, BarChart3, GraduationCap } from "lucide-react";
import type { ReactNode } from "react";
import { LogoWordmark } from "@/components/logo";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/review", label: "Review", icon: Brain },
  { to: "/practice", label: "Practice", icon: Mic },
  { to: "/tutor", label: "Teacher", icon: GraduationCap },
  { to: "/progress", label: "Progress", icon: BarChart3 },
] as const;

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const profile = useAppStore((s) => s.profile);
  const hydrated = useAppStore((s) => s.hydrated);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="min-h-11 items-center">
            <LogoWordmark />
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <div className="hidden tabular-nums text-muted sm:block">{hydrated ? profile.xp : 0} XP</div>
            <div className="flex h-8 items-center rounded-full bg-primary-soft px-3 text-xs font-medium tabular-nums">
              {hydrated ? profile.streak : 0} day streak
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl gap-8 px-4 pb-24 pt-6 md:pb-10">
        <aside className="sticky top-24 hidden h-fit w-48 shrink-0 md:block">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-150",
                    active ? "bg-primary text-primary-fg" : "text-muted hover:bg-bg-subtle hover:text-fg",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {title ? <p className="mt-6 text-xs uppercase tracking-[0.14em] text-subtle">{title}</p> : null}
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg-elevated pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium",
                  active ? "text-primary" : "text-muted",
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
