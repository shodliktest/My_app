import type { LevelId } from "@/lib/types";

export const LEVEL_META: Record<
  LevelId,
  {
    label: string;
    short: string;
    uz: string;
    days: string;
    color: string;
    canDo: string;
    canDoUz: string;
    vocabTarget: number;
  }
> = {
  "pre-a1": {
    label: "Pre-A1 / Starter",
    short: "0",
    uz: "Boshlanish",
    days: "10 lesson",
    color: "bg-primary-soft",
    canDo: "Recognise letters, numbers, greetings and the simplest personal phrases.",
    canDoUz: "Harflar, raqamlar, salomlashuv va eng oddiy shaxsiy iboralarni taniydi.",
    vocabTarget: 300,
  },
  a1: {
    label: "A1 Breakthrough",
    short: "A1",
    uz: "A1",
    days: "16 lessons",
    color: "bg-primary/15",
    canDo: "Introduce yourself, talk about daily routines, family, food, home and shopping.",
    canDoUz: "O‘zingizni tanishtirasiz, kundalik tartib, oila, ovqat, uy va xarid haqida gapirasiz.",
    vocabTarget: 1000,
  },
  a2: {
    label: "A2 Waystage",
    short: "A2",
    uz: "A2",
    days: "8 lessons",
    color: "bg-primary/20",
    canDo: "Describe past events, travel, health, work and simple plans with growing accuracy.",
    canDoUz: "O‘tgan voqealar, sayohat, salomatlik, ish va oddiy rejalarni aniqroq ifodalaysiz.",
    vocabTarget: 2500,
  },
  b1: {
    label: "B1 Threshold",
    short: "B1",
    uz: "B1",
    days: "12 lessons",
    color: "bg-primary/25",
    canDo: "Handle most everyday situations, give opinions, narrate events and write connected text.",
    canDoUz: "Kundalik vaziyatlarni yengasz, fikr bildirasiz, voqealarni aytib berasiz va bog‘liq matn yozasiz.",
    vocabTarget: 4000,
  },
  "b1-plus": {
    label: "B1+",
    short: "B1+",
    uz: "B1+",
    days: "10 lessons",
    color: "bg-primary/30",
    canDo: "Argue a simple case, follow news, and use a wider range of tenses and connectors.",
    canDoUz: "Oddiy dalil keltirasiz, yangiliklarni tushunasiz, kengroq zamon va bog‘lovchilarni ishlatasiz.",
    vocabTarget: 5000,
  },
  b2: {
    label: "B2 Vantage",
    short: "B2",
    uz: "B2",
    days: "15 lessons",
    color: "bg-primary/40",
    canDo: "Follow complex argument, write clear essays, and speak fluently on abstract topics.",
    canDoUz: "Murakkab dalillarni tushunasiz, aniq insho yozasiz va mavhum mavzularda ravon gapirasiz.",
    vocabTarget: 7000,
  },
  "b2-plus": {
    label: "B2+",
    short: "B2+",
    uz: "B2+",
    days: "10 lessons",
    color: "bg-primary/50",
    canDo: "Control register, idioms and nuance; synthesise information from several sources.",
    canDoUz: "Register, idiom va nozik ma’noni boshqarasiz; bir necha manbadan axborotni sintez qilasiz.",
    vocabTarget: 8000,
  },
  c1: {
    label: "C1 Effective Operational",
    short: "C1",
    uz: "C1",
    days: "19 lessons",
    color: "bg-primary",
    canDo: "Use English precisely, naturally and flexibly in academic and professional settings.",
    canDoUz: "Ingliz tilini akademik va professional muhitda aniq, tabiiy va moslashuvchan ishlatasiz.",
    vocabTarget: 10000,
  },
};

export const LEVEL_ORDER: LevelId[] = [
  "pre-a1",
  "a1",
  "a2",
  "b1",
  "b1-plus",
  "b2",
  "b2-plus",
  "c1",
];

export function levelIndex(id: LevelId) {
  return LEVEL_ORDER.indexOf(id);
}

export function nextLevel(id: LevelId): LevelId | null {
  const i = levelIndex(id);
  return i < 0 || i >= LEVEL_ORDER.length - 1 ? null : LEVEL_ORDER[i + 1];
}
