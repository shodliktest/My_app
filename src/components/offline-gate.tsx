import { useCallback, useEffect, useState, type ReactNode } from "react";

/**
 * Soft offline indicator — does NOT block the app.
 * Core lessons, vocab, practice and progress are Local-First (work offline).
 * Banner only reminds the user that optional online features need a connection.
 */
export function OfflineGate({ children }: { children: ReactNode }) {
  const [online, setOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const goOnline = () => {
      setOnline(true);
      setDismissed(false);
    };
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    setOnline(navigator.onLine);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const retry = useCallback(() => {
    setOnline(navigator.onLine);
    if (navigator.onLine) setDismissed(false);
  }, []);

  return (
    <>
      {!online && !dismissed && (
        <div
          role="status"
          className="fixed inset-x-0 top-0 z-[9998] flex items-center justify-between gap-3 bg-[#0a1a4a] px-4 py-2.5 text-sm text-white shadow-lg"
        >
          <span className="min-w-0 flex-1 leading-snug">
            Internet yo‘q — asosiy darslar offline ishlaydi. Ba’zi qo‘shimcha
            funksiyalar uchun tarmoq kerak.
          </span>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={retry}
              className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold"
            >
              Tekshirish
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="rounded-full px-2 py-1 text-xs text-white/70"
              aria-label="Yopish"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
