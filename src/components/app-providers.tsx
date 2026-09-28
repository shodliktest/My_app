import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { useAppStore } from "@/lib/store";

export function AppProviders({ children }: { children: ReactNode }) {
  const setHydrated = useAppStore((s) => s.setHydrated);

  useEffect(() => {
    let cancelled = false;
    // rehydrate() asinxron bo'lishi mumkin: "hydrated" faqat saqlangan holat
    // to'liq yuklangandan keyin true bo'ladi. Xato bo'lsa ham (buzuq
    // localStorage, private rejim) ilova ochilishi shart — aks holda
    // barcha sahifalar "Loading…" da qotib qoladi.
    Promise.resolve(useAppStore.persist.rehydrate())
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, [setHydrated]);

  return (
    <>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          className: "font-sans",
          style: {
            background: "#FCFAf6",
            color: "#16221E",
            border: "1px solid rgba(22,34,30,0.12)",
          },
        }}
      />
    </>
  );
}
