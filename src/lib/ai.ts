import { createServerFn } from "@tanstack/react-start";

type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

async function chat(messages: ChatMsg[], maxTokens = 500): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return { ok: false, error: "AI hozircha mavjud emas." };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);
  try {
    let lastStatus = 0;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          messages,
          max_tokens: Math.min(Math.max(maxTokens, 120), 1200),
          temperature: 0.4,
        }),
        signal: controller.signal,
      });
      lastStatus = res.status;
      if (res.ok) {
        const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const text = body.choices?.[0]?.message?.content?.trim();
        return text ? { ok: true, text } : { ok: false, error: "AI bo‘sh javob qaytardi." };
      }
      if (![408, 429, 500, 502, 503, 504].includes(res.status)) {
        return { ok: false, error: `AI API error ${res.status}` };
      }
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
    }
    return { ok: false, error: `AI vaqtincha band (${lastStatus}). Bir necha soniyadan keyin qayta urinib ko‘ring.` };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { ok: false, error: "AI javobi juda uzoq keldi. Qayta urinib ko‘ring." };
    }
    return { ok: false, error: "AI bilan bog‘lanishda xatolik yuz berdi." };
  } finally {
    clearTimeout(timeout);
  }
}

export const correctWriting = createServerFn({ method: "POST" })
  .validator((input: { text: string; prompt: string; level: string; uz: boolean }) => input)
  .handler(async ({ data }) => {
    return chat(
      [
        {
          role: "system",
          content: `You are a precise CEFR ${data.level} English writing coach for Uzbek learners. Never just say "wrong". Quote the learner sentence, give the correction, explain WHY in ${data.uz ? "Uzbek and English" : "English"}, then give one retry prompt. Keep under 220 words. Score grammar, vocabulary, structure, coherence, task achievement, naturalness, register as 0-100.`,
        },
        {
          role: "user",
          content: `Task: ${data.prompt}\nLearner text:\n${data.text.slice(0, 2500)}`,
        },
      ],
      700,
    );
  });

export const explainWhy = createServerFn({ method: "POST" })
  .validator((input: { sentence: string; question: string; uz: boolean }) => input)
  .handler(async ({ data }) => {
    return chat(
      [
        {
          role: "system",
          content: `Explain English grammar choices clearly. Compare contrastive examples. ${data.uz ? "Answer in Uzbek with English examples." : "Answer in English."} Max 180 words.`,
        },
        { role: "user", content: `Sentence: ${data.sentence}\nQuestion: ${data.question}` },
      ],
      400,
    );
  });

export const conversationTurn = createServerFn({ method: "POST" })
  .validator(
    (input: {
      scene: string;
      level: string;
      history: { role: "user" | "assistant"; content: string }[];
      user: string;
      uz: boolean;
    }) => input,
  )
  .handler(async ({ data }) => {
    return chat(
      [
        {
          role: "system",
          content: `You are an English conversation partner in a ${data.scene} role-play for CEFR ${data.level}. Stay in character. After each learner turn, reply naturally (2-4 sentences), then list up to 3 corrections as: ❌ learner → ✅ better (short why). ${data.uz ? "Why-notes in Uzbek." : "Why-notes in English."} If the learner asks for a hint, give a hint, not the full line.`,
        },
        ...data.history.slice(-8),
        { role: "user", content: data.user.slice(0, 800) },
      ],
      450,
    );
  });

export const correctSpoken = createServerFn({ method: "POST" })
  .validator((input: { transcript: string; prompt: string; level: string; uz: boolean }) => input)
  .handler(async ({ data }) => {
    return chat(
      [
        {
          role: "system",
          content: `Score the spoken English transcript for CEFR ${data.level}: grammar, vocabulary, fluency (estimate), pronunciation (from spelling clues only). Give 3 main errors max with ❌ → ✅ and why. ${data.uz ? "Explanations in Uzbek." : "English."} Then one follow-up question. Under 200 words.`,
        },
        { role: "user", content: `Prompt: ${data.prompt}\nTranscript: ${data.transcript.slice(0, 1200)}` },
      ],
      450,
    );
  });
