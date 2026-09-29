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

let currentAudio: HTMLAudioElement | null = null;

/**
 * Birinchi va asosiy ovoz manbai: ilovaning o'z serveri (/api/tts), u
 * Microsoft Edge'ning bepul, kalit talab qilmaydigan nutq xizmatidan
 * tayyor MP3 audio generatsiya qilib beradi.
 *
 * Bu qurilma yoki muhitdan qat'i nazar (brauzer, kompyuter, telefon,
 * APK/WebView ichida) BIR XIL ishlaydi, chunki mijoz tomonida faqat
 * oddiy audio faylni yuklab olib ijro etishdan boshqa hech narsa talab
 * qilinmaydi — hech qanday uchinchi tomon skripti, kalit yoki
 * domen-cheklovi yo'q. Shu sabab bu ResponsiveVoice yoki qurilmaning
 * o'z ovozidan oldin sinab ko'riladi.
 */
async function serverSpeak(text: string, opts: SpeechOptions): Promise<boolean> {
  try {
    const params = new URLSearchParams({ text });
    if (opts.lang) params.set("lang", opts.lang);
    if (opts.voice) params.set("voice", opts.voice);
    if (opts.rate) params.set("rate", String(opts.rate));

    const audio = new Audio(`/api/tts?${params.toString()}`);
    currentAudio = audio;
    audio.volume = opts.volume ?? 1;

    const played = await new Promise<boolean>((resolve) => {
      let settled = false;
      const finish = (ok: boolean) => {
        if (settled) return;
        settled = true;
        resolve(ok);
      };
      audio.oncanplaythrough = () => {
        audio.play().then(() => finish(true)).catch(() => finish(false));
      };
      audio.onerror = () => finish(false);
      // Sekin/uzilgan ulanish uchun umumiy zaxira.
      setTimeout(() => finish(false), 8000);
      audio.load();
    });
    return played;
  } catch {
    return false;
  }
}

/**
 * ResponsiveVoice — ikkinchi zaxira. Ilovaning o'z serveri (masalan,
 * Vercel funksiyasi vaqtincha ishlamay qolganda) mavjud bo'lmasa
 * ishlatiladi.
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
      const rv = window.responsiveVoice;
      if (!rv) return false;
      if (rv.voiceSupport ? rv.voiceSupport() : true) {
        finish(rv);
        return true;
      }
      return false;
    }
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
    }, 4000);
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

/** So'nggi zaxira: qurilmaning o'z ovozi. */
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
 * Ovozni o'qish. Tartib: (1) ilovaning o'z serveri — Microsoft Edge TTS,
 * barcha qurilmalarda bir xil ishlaydi; (2) ResponsiveVoice; (3)
 * qurilmaning o'z ovozi.
 */
export async function speak(text: string, opts: SpeechOptions = {}) {
  if (typeof window === "undefined" || !text.trim()) return;
  stopSpeaking();

  const viaServer = await serverSpeak(text, opts);
  if (viaServer) return;

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
  currentAudio?.pause();
  currentAudio = null;
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
