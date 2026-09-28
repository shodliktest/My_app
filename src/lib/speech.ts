export type SpeechOptions = {
  rate?: number;
  lang?: string;
  voice?: string;
  pitch?: number;
  volume?: number;
};

type ResponsiveVoiceLike = {
  speak: (text: string, voice?: string, params?: Record<string, unknown>) => void;
  cancel?: () => void;
  pause?: () => void;
  resume?: () => void;
};

declare global {
  interface Window {
    responsiveVoice?: ResponsiveVoiceLike;
  }
}

let responsiveVoicePromise: Promise<ResponsiveVoiceLike | null> | null = null;

function responsiveVoiceKey() {
  return typeof import.meta !== "undefined" ? (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_RESPONSIVEVOICE_KEY?.trim() : undefined;
}

function loadResponsiveVoice(): Promise<ResponsiveVoiceLike | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.responsiveVoice) return Promise.resolve(window.responsiveVoice);
  const key = responsiveVoiceKey();
  if (!key) return Promise.resolve(null);
  if (responsiveVoicePromise) return responsiveVoicePromise;

  responsiveVoicePromise = new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-shodlik-responsivevoice="true"]');
    if (existing) {
      const timer = window.setInterval(() => {
        if (window.responsiveVoice) {
          window.clearInterval(timer);
          resolve(window.responsiveVoice);
        }
      }, 50);
      window.setTimeout(() => {
        window.clearInterval(timer);
        resolve(window.responsiveVoice ?? null);
      }, 4000);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://code.responsivevoice.org/responsivevoice.js?key=${encodeURIComponent(key)}`;
    script.async = true;
    script.dataset.shodlikResponsivevoice = "true";
    script.onload = () => resolve(window.responsiveVoice ?? null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });

  return responsiveVoicePromise;
}

function nativeSpeak(text: string, opts: SpeechOptions = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis || !text.trim()) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = opts.lang ?? "en-GB";
  u.rate = opts.rate ?? 0.92;
  u.pitch = opts.pitch ?? 1;
  u.volume = opts.volume ?? 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((v) =>
    v.lang.startsWith("en") && /neural|natural|online|microsoft|uk|gb|daniel|female/i.test(v.name),
  ) ?? voices.find((v) => v.lang.startsWith("en"));
  if (preferred) u.voice = preferred;
  window.speechSynthesis.speak(u);
  return true;
}

/**
 * Local-first speech. If a ResponsiveVoice key is configured, it provides a
 * more consistent natural voice; otherwise the device's installed voice is
 * used. No speech provider is required for the app to function.
 */
export async function speak(text: string, opts: SpeechOptions = {}) {
  if (typeof window === "undefined" || !text.trim()) return;
  stopSpeaking();

  const rv = await loadResponsiveVoice();
  if (rv) {
    rv.speak(text, opts.voice ?? (opts.lang?.startsWith("en-US") ? "US English Female" : "UK English Female"), {
      rate: opts.rate ?? 0.92,
      pitch: opts.pitch ?? 1,
      volume: opts.volume ?? 1,
      onerror: () => nativeSpeak(text, opts),
    });
    return;
  }
  nativeSpeak(text, opts);
}

export function stopSpeaking() {
  if (typeof window === "undefined") return;
  window.responsiveVoice?.cancel?.();
  window.speechSynthesis?.cancel();
}

export type RecogHandle = { stop: () => void };

export function startRecognition(
  onResult: (text: string, final: boolean) => void,
  onEnd?: () => void,
): RecogHandle | null {
  const SR =
    typeof window !== "undefined"
      ? ((window as unknown as { SpeechRecognition?: new () => SpeechRecognition }).SpeechRecognition ??
        (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition)
      : undefined;
  if (!SR) return null;
  const rec = new SR();
  rec.lang = "en-GB";
  rec.interimResults = true;
  rec.continuous = false;
  rec.onresult = (e: SpeechRecognitionEvent) => {
    const last = e.results[e.results.length - 1];
    if (!last) return;
    onResult(last[0]?.transcript ?? "", last.isFinal);
  };
  rec.onend = () => onEnd?.();
  rec.start();
  return { stop: () => rec.stop() };
}

type SpeechRecognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEvent = {
  results: { length: number; [i: number]: { isFinal: boolean; [j: number]: { transcript: string } } };
};
