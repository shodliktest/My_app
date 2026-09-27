import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { useAppStore } from "@/lib/store";

export function AppProviders({ children }: { children: ReactNode }) {
  const setHydrated = useAppStore((s) => s.setHydrated);

  useEffect(() => {
    void useAppStore.persist.rehydrate();
    setHydrated(true);
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
