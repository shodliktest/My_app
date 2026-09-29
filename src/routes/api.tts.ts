import { createFileRoute } from "@tanstack/react-router";
import { EdgeTTS } from "edge-tts-universal";

/**
 * Ovozni serverda generatsiya qilib, tayyor MP3 fayl sifatida qaytaradi.
 *
 * Nega bu kerak: ResponsiveVoice/brauzerning o'z ovozi turli qurilmalarda
 * (ayniqsa Android WebView / APK ichida) barqaror ishlamaydi — key domenga
 * bog'liq bo'lishi yoki WebView ichida ovoz mexanizmi umuman mavjud
 * bo'lmasligi mumkin. Bu yerda esa faqat oddiy audio fayl qaytariladi —
 * qaysi qurilma yoki brauzerda ochilishidan qat'i nazar bir xil ishlaydi,
 * chunki bu MP3 ijro etishdan boshqa hech narsa talab qilmaydi.
 *
 * Ovoz manbai: Microsoft Edge'ning bepul, ochiq, kalit talab qilmaydigan
 * onlayn nutq xizmati (edge-tts-universal orqali).
 */

const DEFAULT_VOICE = "en-GB-SoniaNeural";
const VOICE_BY_LANG: Record<string, string> = {
  "en-GB": "en-GB-SoniaNeural",
  "en-US": "en-US-EmmaMultilingualNeural",
};

function resolveVoice(lang: string | null, voice: string | null): string {
  if (voice && /^[a-zA-Z-]+Neural$/.test(voice)) return voice;
  if (lang && VOICE_BY_LANG[lang]) return VOICE_BY_LANG[lang];
  return DEFAULT_VOICE;
}

function clampRate(rate: number): string {
  // ResponsiveVoice/speechSynthesis bilan bir xil "rate" (0.5–2) qabul
  // qilinadi, Edge TTS esa foizli siljish (masalan "-10%") kutadi.
  const pct = Math.round((Math.min(Math.max(rate, 0.5), 1.6) - 1) * 100);
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct}%`;
}

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const text = (url.searchParams.get("text") ?? "").trim();
        const lang = url.searchParams.get("lang");
        const voiceParam = url.searchParams.get("voice");
        const rateParam = Number(url.searchParams.get("rate") ?? "0.92");

        if (!text) {
          return new Response("Missing text", { status: 400 });
        }
        // Suiiste'moldan himoya: bitta chaqiriq uchun oqilona uzunlik chegarasi.
        const clipped = text.slice(0, 600);

        try {
          const tts = new EdgeTTS(clipped, resolveVoice(lang, voiceParam), {
            rate: clampRate(Number.isFinite(rateParam) ? rateParam : 0.92),
          });
          const result = await tts.synthesize();
          const audioBuffer = Buffer.from(await result.audio.arrayBuffer());

          return new Response(audioBuffer, {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "public, max-age=86400, immutable",
            },
          });
        } catch {
          return new Response("TTS synthesis failed", { status: 502 });
        }
      },
    },
  },
});
