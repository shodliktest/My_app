import type { ErrorCategory, Exercise, Mistake } from "@/lib/types";

export type ErrorAnalysis = {
  category: ErrorCategory;
  concept: string;
  grammarTarget?: string;
  microLesson: string;
  steps: string[];
  contrast?: string;
};

function lower(s: string) { return s.toLowerCase(); }

export function analyzeError(ex: Exercise, given: string): ErrorAnalysis {
  const hay = lower([ex.prompt, ex.promptUz, ex.text, ex.explanation, ex.explanationUz, ex.assessment?.grammarTarget, ex.assessment?.commonError].filter(Boolean).join(" "));
  const target = ex.assessment?.grammarTarget;
  let category: ErrorCategory = "other";
  let concept = ex.assessment?.commonError ?? ex.type;

  if (ex.skill === "listening" || ex.type === "dictation" || ex.type === "listen-gap") category = "listening-discrimination";
  else if (ex.skill === "translation" || ex.type === "translate") category = "translation-transfer";
  else if (/\b(tense|present perfect|past perfect|future|past simple|present simple|continuous)\b/.test(hay) || ex.type === "tense") category = "tense-choice";
  else if (/\b(auxiliary|question|word-order|do\/does|did|inversion)\b/.test(hay) || ex.type === "question-form" || ex.type === "order") category = "auxiliary-word-order";
  else if (/\b(article|a an the|determiner|some any|much many|few little)\b/.test(hay)) category = "articles-determiners";
  else if (/\b(preposition|in on at|for since|by until|to)\b/.test(hay)) category = "prepositions";
  else if (/\b(collocation|phrasal|expression|idiom)\b/.test(hay)) category = "collocation";
  else if (/\b(vocabulary|word choice|meaning|synonym|lexical)\b/.test(hay) || ex.skill === "vocabulary") category = "lexical-choice";
  else if (ex.type === "find-mistake" || ex.type === "error" || ex.type === "rewrite" || ex.type === "transform") category = "target-form";
  else if (/\b(spell|spelling|word form|suffix|prefix|plural)\b/.test(hay)) category = "spelling";
  else if (ex.skill === "reading" && /\b(infer|inference|imply|meaning)\b/.test(hay)) category = "meaning-inference";

  const labels: Record<ErrorCategory, { concept: string; lesson: string; steps: string[]; contrast?: string }> = {
    "tense-choice": { concept: target ?? "tense selection", lesson: "Avval vaqt chegarasini aniqlang, keyin tense tanlang.", steps: ["Gapdagi time marker yoki tugallangan/tugallanmagan davrni belgilang.", "Harakat hozirgi natija bilan bog‘langanmi yoki faqat o‘tgan voqeami, tekshiring.", "Shu kontrast bo‘yicha 2 ta yangi gap tuzing."], contrast: "I lived there in 2020. ↔ I have lived here since 2020." },
    "auxiliary-word-order": { concept: target ?? "auxiliary + word order", lesson: "Savol yoki transformatsiyada yordamchi fe’lni avval toping, keyin subject va main verb tartibini tekshiring.", steps: ["Tense/structure yordamchi fe’lini belgilang.", "Auxiliary + subject + main verb tartibini tekshiring.", "Bir darak gapni savolga aylantirib qayta yeching."], contrast: "She works here. → Does she work here?" },
    "form-morphology": { concept: target ?? "word form", lesson: "So‘zning gapdagi grammatik vazifasini aniqlab, mos shaklni tanlang.", steps: ["Bo‘sh joydan oldingi va keyingi so‘zlarni o‘qing.", "Noun/verb/adjective/adverb shaklini aniqlang.", "Bir xil root word bilan uchta shakl tuzing."] },
    "articles-determiners": { concept: "articles and determiners", lesson: "Narsa umumiy, noma’lum yoki aniq ekanini ajrating.", steps: ["Ot birinchi marta kelyaptimi yoki oldindan ma’lummi?", "Countable/uncountable holatini tekshiring.", "a/an/the/zero article variantlarini solishtiring."], contrast: "I saw a dog. The dog was friendly." },
    "prepositions": { concept: "preposition choice", lesson: "Prepositionni so‘zma-so‘z tarjimadan emas, English pattern/collocationdan tanlang.", steps: ["Birlikning to‘liq patternini toping.", "Time/place/verb pattern ekanini aniqlang.", "Patternni yangi gapda ishlating."], contrast: "depend on · interested in · arrive at" },
    "lexical-choice": { concept: "lexical choice", lesson: "Variantlarni Uzbek tarjimasi bilan emas, English context va register bilan farqlang.", steps: ["Gapning maqsadini aniqlang.", "Variantlarning register va collocationini tekshiring.", "To‘g‘ri variant bilan yangi gap tuzing."] },
    "collocation": { concept: "collocation control", lesson: "So‘zlarni alohida emas, tabiiy word partnership sifatida o‘rganing.", steps: ["Target word bilan odatda keladigan fe’l/ot/adjective-ni toping.", "Noto‘g‘ri literal kombinatsiyani ajrating.", "Collocationni yangi kontekstda ishlating."], contrast: "make a decision ✓ · do a decision ✗" },
    "translation-transfer": { concept: "L1 → L2 transfer", lesson: "Avval English sentence patternini tanlang, keyin Uzbek gapni unga moslang.", steps: ["Gapning asosiy ma’nosini ajrating.", "English tense va word orderni belgilang.", "So‘zma-so‘z tarjimani tabiiy variant bilan solishtiring."] },
    "listening-discrimination": { concept: "listening discrimination", lesson: "Audio javobini taxmin bilan emas, signal words va ma’no birliklari bilan tekshiring.", steps: ["Audio-ni birinchi marta umumiy ma’no uchun tinglang.", "Ikkinchi marta target phrase/wordni ushlang.", "Eshitganingizni transcript bilan tekshiring."] },
    "meaning-inference": { concept: "reading inference", lesson: "Inference — matnda aynan yozilmagan, lekin dalillardan kelib chiqadigan xulosani topish.", steps: ["Relevant sentence va surrounding contextni belgilang.", "Author nimani aniq aytganini ajrating.", "Faqat dalil qo‘llab-quvvatlaydigan xulosani tanlang."] },
    "target-form": { concept: target ?? "target form", lesson: "Avval target grammar shaklini toping, keyin javobni shu constraint bilan tekshiring.", steps: ["Target structure-ni belgilang.", "Javob ma’noni saqlayaptimi, tekshiring.", "Form va word orderni qayta tekshiring."] },
    "spelling": { concept: "spelling / word form", lesson: "To‘g‘ri shaklni faqat talaffuzdan emas, morfologiya va yozilish patternidan tekshiring.", steps: ["Root wordni toping.", "Kerakli suffix/prefixni belgilang.", "So‘zni gap ichida qayta yozing."] },
    other: { concept: ex.assessment?.commonError ?? ex.type, lesson: "Xatoni to‘g‘ri javob bilan emas, uni keltirib chiqargan qaror bilan tahlil qiling.", steps: ["Savolning targetini belgilang.", "Nega siz tanlagan javob mos emasligini toping.", "Shunga o‘xshash yangi gapda qayta qo‘llang."] },
  };
  const preset = labels[category];
  return { category, concept: preset.concept, grammarTarget: target, microLesson: preset.lesson, steps: preset.steps, contrast: preset.contrast };
}

export function buildRemediation(ex: Exercise, given: string): ErrorAnalysis {
  return analyzeError(ex, given);
}

export function isErrorResolved(m: Mistake) {
  return (m.successfulRechecks ?? 0) >= 2;
}
