import * as Lucide from "lucide-react";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type LucideIcon = typeof BookOpen;

export function IconByName({ name, className }: { name: string; className?: string }) {
  const Icon = (Lucide as unknown as Record<string, LucideIcon>)[name] ?? BookOpen;
  return <Icon className={cn("size-5", className)} />;
}
