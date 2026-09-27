import type { Exercise } from "@/lib/types";
import { errx, gap, mcq, order, tr } from "@/lib/content/helpers";

export const PLACEMENT: Exercise[] = [
  mcq("pl-1", "I ___ a student.", ["is", "am", "are", "be"], "am", "I takes am.", "I bilan am."),
  mcq("pl-2", "She ___ to school every day.", ["go", "goes", "going", "gone"], "goes", "he/she/it + -s in Present Simple.", "he/she/it + -s."),
  mcq("pl-3", "There ___ two books on the table.", ["is", "are", "am", "be"], "are", "two books → are.", "ko‘plik — are."),
  mcq("pl-4", "I ___ TV when he called.", ["watched", "was watching", "watch", "am watching"], "was watching", "Past Continuous for an action in progress.", "Davom etayotgan o‘tgan ish."),
  mcq("pl-5", "She has lived here ___ 2020.", ["for", "since", "from", "at"], "since", "since + point in time.", "since + nuqta."),
  mcq("pl-6", "If I ___ more time, I would travel.", ["have", "had", "has", "will have"], "had", "Second conditional: if + past.", "If + o‘tgan."),
  mcq("pl-7", "The report ___ last week.", ["was written", "wrote", "has write", "written"], "was written", "Past passive.", "O‘tgan passive."),
  mcq("pl-8", "I wish I ___ harder at school.", ["study", "studied", "have studied", "am studying"], "studied", "wish + past for present regret.", "wish + o‘tgan."),
  mcq("pl-9", "Not only ___ late, but he also forgot the files.", ["he was", "was he", "he is", "did he"], "was he", "Inversion after Not only.", "Not only dan keyin inversion."),
  mcq("pl-10", "The policy, ___ last year, remains controversial.", ["implementing", "implemented", "implement", "was implement"], "implemented", "Reduced relative / participle clause.", "Participle clause."),
  gap("pl-11", "How ___ you?", "are", "How are you?", "How are you?", { skill: "vocabulary" }),
  gap("pl-12", "I look forward ___ hearing from you.", "to", "look forward to + -ing.", "look forward to.", { skill: "vocabulary" }),
  gap("pl-13", "Please ___ a decision by Friday.", "make", "make a decision.", "make a decision.", { skill: "vocabulary" }),
  mcq("pl-14", "A synonym of however:", ["therefore", "nevertheless", "because", "and"], "nevertheless", "however ≈ nevertheless.", "however ≈ nevertheless.", { skill: "vocabulary" }),
  mcq("pl-15", "Choose the most academic verb for 'do research'.", ["make research", "do a look", "conduct research", "put research"], "conduct research", "conduct/carry out research.", "conduct research.", { skill: "vocabulary" }),
  order("pl-16", ["usually", "up", "I", "at", "get", "seven"], "I usually get up at seven", "Adverb of frequency after subject.", "Frequency ega dan keyin."),
  errx("pl-17", "I am agree with this idea.", "I agree with this idea", "agree is a verb — no am.", "agree fe’l, am yo‘q."),
  errx("pl-18", "She go to school every day.", "She goes to school every day", "she + goes.", "she goes."),
  tr("pl-19", "U har kuni maktabga boradi.", "She goes to school every day", "Present Simple, third person -s."),
  mcq("pl-20", "Reading: 'Although the plan was ambitious, funding fell short.' The plan…", ["succeeded easily", "lacked enough money", "had no ambition", "was not a plan"], "lacked enough money", "fell short = not enough.", "yetarli emas.", { skill: "reading" }),
  mcq("pl-21", "'I have been working here for three years' means…", ["I started today", "I worked in the past only", "I started in the past and still work here", "I will start later"], "I started in the past and still work here", "Present Perfect Continuous.", "O‘tmishda boshlanib hozirgacha.", { skill: "grammar" }),
  mcq("pl-22", "Choose the most natural B2 sentence.", ["The thing is good very.", "It plays a significant role in daily life.", "It do a big role.", "It is role significant."], "It plays a significant role in daily life.", "play a role is the collocation.", "play a role.", { skill: "vocabulary" }),
];

export function placementLevel(correct: number, total: number): import("@/lib/types").LevelId {
  const pct = total ? correct / total : 0;
  if (pct < 0.18) return "pre-a1";
  if (pct < 0.32) return "a1";
  if (pct < 0.48) return "a2";
  if (pct < 0.62) return "b1";
  if (pct < 0.74) return "b1-plus";
  if (pct < 0.86) return "b2";
  if (pct < 0.93) return "b2-plus";
  return "c1";
}
