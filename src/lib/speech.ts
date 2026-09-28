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
  voiceSupport?: () => boolean;
  isPlaying?: () => boolean;
};

declare global {
  interface Window {
    responsiveVoice?: ResponsiveVoiceLike;
  }
}

/**
 * ResponsiveVoice — Microsoft/Google-darajadagi tabiiy ovozlarni bepul
 * taqdim etadigan xizmat. Qurilma/brauzerning o'z TTS dvigateliga (ko'p
 * Android telefon va Android WebView'da juda cheklangan yoki mavjud
 * bo'lmasligi mumkin) qaraganda barcha qurilmalarda bir xil, sifatli va
 * tushunarli ovoz beradi — shu sabab bu birinchi tanlov.
 *
 * Kalit ochiq loyiha uchun ko'chirib qo'yilgan (bepul, umumiy foydalanish
 * darajasi bilan). VITE_RESPONSIVEVOICE_KEY muhit o'zgaruvchisi berilsa,
 * o'sha ustunlik qiladi.
 */
const RESPONSIVEVOICE_FALLBACK_KEY = "ftro4Sxr";

let responsiveVoicePromise: Promise<ResponsiveVoiceLike | null> | null = null;

function responsiveVoiceKey(): string {
  const fromEnv =
    typeof import.meta !== "undefined"
      ? (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_RESPONSIVEVOICE_KEY?.trim()
      : undefined;
  return fromEnv && fromEnv.length > 0 ? fromEnv : RESPONSIVEVOICE_FALLBACK_KEY;
}

/**
 * ResponsiveVoice skriptini yuklaydi va ovoz mexanizmi HAQIQATAN tayyor
 * bo'lguncha kutadi. `window.responsiveVoice` obyektining mavjudligi
 * yetarli emas — ba'zi qurilmalarda ichki ovoz ro'yxati asinxron tarzda
 * biroz kechroq tayyor bo'ladi, shu payt speak() chaqirilsa ovoz
 * chiqmasligi yoki kesilib qolishi mumkin.
 */
function loadResponsiveVoice(): Promise<ResponsiveVoiceLike | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.responsiveVoice?.voiceSupport?.()) return Promise.resolve(window.responsiveVoice);
  if (responsiveVoicePromise) return responsiveVoicePromise;

  responsiveVoicePromise = new Promise((resolve) => {
    let settled = false;
    const finish = (value: ResponsiveVoiceLike | null) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    function waitUntilReady() {
      // responsiveVoice global obyekt paydo bo'ladi-yu, lekin ovoz mexanizmi
      // (`voiceSupport`) biroz kech tayyor bo'lishi mumkin — shu holatni
      // qisqa oraliqlar bilan tekshiramiz, uzoqqa cho'zilib ketsa ham
      // baribir mavjud obyektni qaytaramiz (speak() baribir urinib ko'radi).
      const rv = window.responsiveVoice;
      if (!rv) return false;
      if (rv.voiceSupport ? rv.voiceSupport() : true) {
        finish(rv);
        return true;
      }
      return false;
    }

    // ResponsiveVoice tayyor bo'lganda chaqiradigan yuklab olish hodisasi
    // (mavjud bo'lsa eng ishonchli signal).
    (window as unknown as { responsiveVoiceOnLoad?: () => void }).responsiveVoiceOnLoad = () => {
      waitUntilReady();
    };

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-shodlik-responsivevoice="true"]',
    );

    const poll = window.setInterval(() => {
      if (waitUntilReady()) window.clearInterval(poll);
    }, 100);

    window.setTimeout(() => {
      window.clearInterval(poll);
      finish(window.responsiveVoice ?? null);
    }, 5000);

    if (existing) return;

    const script = document.createElement("script");
    script.src = `https://code.responsivevoice.org/responsivevoice.js?key=${encodeURIComponent(
      responsiveVoiceKey(),
    )}&onload=responsiveVoiceOnLoad`;
    script.async = true;
    script.dataset.shodlikResponsivevoice = "true";
    script.onerror = () => {
      window.clearInterval(poll);
      finish(null);
    };
    document.head.appendChild(script);
  });

  return responsiveVoicePromise;
}

function pickNativeVoice(voices: SpeechSynthesisVoice[], lang: string) {
  const base = lang.slice(0, 2).toLowerCase();
  return (
    voices.find(
      (v) => v.lang.toLowerCase().startsWith(lang.toLowerCase()) && /neural|natural|online|microsoft|google/i.test(v.name),
    ) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(base) && /neural|natural|online|microsoft|google/i.test(v.name)) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(lang.toLowerCase())) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(base))
  );
}

/**
 * Qurilmaning o'z ovozi (speechSynthesis). Faqat ResponsiveVoice mutlaqo
 * ishlamay qolganda (tarmoq yo'q va kalit ham yuklanmagan) so'nggi
 * zaxira sifatida ishlatiladi — ko'p Android telefon/WebView'da bu
 * kanal cheklangan yoki hech qanday inglizcha ovoz taqdim etmaydi.
 */
function nativeSpeak(text: string, opts: SpeechOptions = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis || !text.trim()) return false;
  window.speechSynthesis.cancel();
  const lang = opts.lang ?? "en-GB";
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = opts.rate ?? 0.92;
  u.pitch = opts.pitch ?? 1;
  u.volume = opts.volume ?? 1;
  const applyVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const preferred = pickNativeVoice(voices, lang);
    if (preferred) u.voice = preferred;
    window.speechSynthesis.speak(u);
  };
  // Ba'zi brauzerlarda getVoices() birinchi chaqiriqda bo'sh massiv
  // qaytaradi — ro'yxat asinxron yuklanadi.
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      applyVoice();
    };
  } else {
    applyVoice();
  }
  return true;
}

/**
 * Ovozni o'qish. Har doim avval ResponsiveVoice (bepul, Microsoft/Google
 * darajasidagi tabiiy ovozlar, barcha qurilmalarda bir xil ishlaydi —
 * shu jumladan Android WebView/APK ichida) bilan urinadi; faqat u
 * mutlaqo ishlamasa (masalan hech qanday internet yo'q) qurilmaning
 * o'z ovoziga tushadi.
 */
export async function speak(text: string, opts: SpeechOptions = {}) {
  if (typeof window === "undefined" || !text.trim()) return;
  stopSpeaking();

  const rv = await loadResponsiveVoice();
  if (rv) {
    const voiceName =
      opts.voice ?? (opts.lang?.toLowerCase().startsWith("en-us") ? "US English Female" : "UK English Female");
    let fellBack = false;
    rv.speak(text, voiceName, {
      rate: opts.rate ?? 0.92,
      pitch: opts.pitch ?? 1,
      volume: opts.volume ?? 1,
      onerror: () => {
        if (fellBack) return;
        fellBack = true;
        nativeSpeak(text, opts);
      },
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
