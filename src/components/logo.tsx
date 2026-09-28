import { cn } from "@/lib/utils";

const ICON_SRC = "/shodlik-app-icon-96.png";

/**
 * Ilova belgisi (icon). Bitta manba — shu fayl — orqali chiqadi, shuning
 * uchun uni almashtirish har qanday sahifada (header, onboarding, va h.k.)
 * bir vaqtda yangilanadi.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={ICON_SRC}
      alt="Shodlik Education"
      className={cn("rounded-[22%] object-cover", className)}
    />
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
