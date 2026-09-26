import type { Phrase } from "./types";

export const PHRASE_CATEGORIES = [
  "Salomlashish",
  "Kafe",
  "Yo'lda",
  "Ish va dars",
  "Kundalik",
] as const;

export const PHRASES: Phrase[] = [
  { id: "p1", category: "Salomlashish", en: "Hello!", uz: "Salom!" },
  { id: "p2", category: "Salomlashish", en: "Good morning.", uz: "Xayrli tong." },
  { id: "p3", category: "Salomlashish", en: "Good evening.", uz: "Xayrli kech." },
  { id: "p4", category: "Salomlashish", en: "How are you?", uz: "Qalaysiz?" },
  { id: "p5", category: "Salomlashish", en: "I'm fine, thank you.", uz: "Yaxshiman, rahmat." },
  { id: "p6", category: "Salomlashish", en: "Nice to meet you.", uz: "Tanishganimdan xursandman." },
  { id: "p7", category: "Salomlashish", en: "What's your name?", uz: "Ismingiz nima?" },
  { id: "p8", category: "Salomlashish", en: "See you later.", uz: "Keyinroq ko'rishamiz." },
  { id: "p9", category: "Salomlashish", en: "Have a nice day.", uz: "Yaxshi kun tilayman." },

  { id: "p10", category: "Kafe", en: "A table for two, please.", uz: "Ikkita kishilik stol, iltimos." },
  { id: "p11", category: "Kafe", en: "Can I see the menu?", uz: "Menyuni ko'rsatsangiz?" },
  { id: "p12", category: "Kafe", en: "I would like a coffee.", uz: "Bir qahva olaman." },
  { id: "p13", category: "Kafe", en: "The bill, please.", uz: "Hisob, iltimos." },
  { id: "p14", category: "Kafe", en: "Is service included?", uz: "Xizmat haqi kiritilganmi?" },
  { id: "p15", category: "Kafe", en: "This is delicious.", uz: "Bu juda mazali." },
  { id: "p16", category: "Kafe", en: "Could I have some water?", uz: "Biroz suv bersangiz?" },
  { id: "p17", category: "Kafe", en: "I'm allergic to nuts.", uz: "Yong'oqqa allergiyam bor." },

  { id: "p18", category: "Yo'lda", en: "Where is the station?", uz: "Vokzal qayerda?" },
  { id: "p19", category: "Yo'lda", en: "How much is a ticket?", uz: "Chipta qancha turadi?" },
  { id: "p20", category: "Yo'lda", en: "Turn left at the lights.", uz: "Svetoforda chapga buriling." },
  { id: "p21", category: "Yo'lda", en: "I'm lost.", uz: "Yo'ldan adashib qoldim." },
  { id: "p22", category: "Yo'lda", en: "Does this bus go to the center?", uz: "Bu avtobus markazga boradimi?" },
  { id: "p23", category: "Yo'lda", en: "How long does it take?", uz: "Qancha vaqt ketadi?" },
  { id: "p24", category: "Yo'lda", en: "Excuse me, is this seat free?", uz: "Kechirasiz, bu joy bo'shmi?" },

  { id: "p25", category: "Ish va dars", en: "Could you repeat that?", uz: "Qaytarib aytib bera olasizmi?" },
  { id: "p26", category: "Ish va dars", en: "I don't understand.", uz: "Tushunmadim." },
  { id: "p27", category: "Ish va dars", en: "How do you spell that?", uz: "Bu qanday yoziladi?" },
  { id: "p28", category: "Ish va dars", en: "What does this word mean?", uz: "Bu so'z nima demak?" },
  { id: "p29", category: "Ish va dars", en: "I'll send you an email.", uz: "Sizga xat yuboraman." },
  { id: "p30", category: "Ish va dars", en: "Let's start the meeting.", uz: "Yig'ilishni boshlaylik." },
  { id: "p31", category: "Ish va dars", en: "Could you speak more slowly?", uz: "Sekinroq gapira olasizmi?" },

  { id: "p32", category: "Kundalik", en: "What time is it?", uz: "Soat necha?" },
  { id: "p33", category: "Kundalik", en: "I need some help.", uz: "Menga yordam kerak." },
  { id: "p34", category: "Kundalik", en: "Can you wait a minute?", uz: "Bir daqiqa kuta olasizmi?" },
  { id: "p35", category: "Kundalik", en: "That's a good idea.", uz: "Yaxshi fikr." },
  { id: "p36", category: "Kundalik", en: "I'll be right back.", uz: "Hozir qaytaman." },
  { id: "p37", category: "Kundalik", en: "It doesn't matter.", uz: "Muhim emas." },
  { id: "p38", category: "Kundalik", en: "I'm looking for a pharmacy.", uz: "Dorixona qidiryapman." },
  { id: "p39", category: "Kundalik", en: "Have a good weekend.", uz: "Yaxshi dam oling." },
];

export function phraseOfTheDay(dateKey: string): Phrase {
  const idx =
    dateKey.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % PHRASES.length;
  return PHRASES[idx]!;
}
