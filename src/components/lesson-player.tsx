import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Volume2 } from "lucide-react";
import type { DayModeStep, Exercise, Lesson } from "@/lib/types";
import { GrammarView } from "@/components/grammar-view";
import { VocabDeck } from "@/components/vocab-deck";
import { ExercisePlayer } from "@/components/exercise-player";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppStore, exerciseXp } from "@/lib/store";
import { showUzbek } from "@/lib/lang";
import { speak, startRecognition, stopSpeaking } from "@/lib/speech";
import { makeDictation, scoreDictation } from "@/lib/listening-intelligence";
import { correctSpoken, correctWriting } from "@/lib/ai";
import { dueCards } from "@/lib/srs";
import { masteryFromProgress, MASTERY_THRESHOLD, weakSkillsFromExercises } from "@/lib/mastery";
import { WORD_BY_ID } from "@/content";
import { getLessonItemBank, selectAssessmentItems } from "@/lib/item-bank";
import { analyzeError } from "@/lib/error-intelligence";

const QUICK: DayModeStep[] = ["mission", "vocab", "grammar", "grammar-practice", "reading", "test", "done"];
const NORMAL: DayModeStep[] = [
  "mission", "srs", "vocab", "grammar", "grammar-practice", "listening", "reading", "speaking", "test", "done",
];
const FULL: DayModeStep[] = [
  "mission", "srs", "vocab", "grammar", "grammar-practice", "listening", "shadowing", "reading", "speaking", "writing", "test", "done",
];

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const profile = useAppStore((s) => s.profile);
  const startLesson = useAppStore((s) => s.startLesson);
  const completeLessonStep = useAppStore((s) => s.completeLessonStep);
  const finishLesson = useAppStore((s) => s.finishLesson);
  const recordSkill = useAppStore((s) => s.recordSkill);
  const recordMistake = useAppStore((s) => s.recordMistake);
  const resolveMistakeCheck = useAppStore((s) => s.resolveMistakeCheck);
  const addXp = useAppStore((s) => s.addXp);
  const touchStreak = useAppStore((s) => s.touchStreak);
  const addMission = useAppStore((s) => s.addMission);
  const ensureCard = useAppStore((s) => s.ensureCard);
  const gradeCard = useAppStore((s) => s.gradeCard);
  const cards = useAppStore((s) => s.cards);
  const savedProgress = useAppStore((s) => s.lessonProgress[lesson.id]);
  const addListeningMinutes = useAppStore((s) => s.addListeningMinutes);
  const addSpeakingMinutes = useAppStore((s) => s.addSpeakingMinutes);
  const addWritingWords = useAppStore((s) => s.addWritingWords);
  const mastery = masteryFromProgress(savedProgress);

  const steps = profile.dailyGoal === "quick" ? QUICK : profile.dailyGoal === "full" ? FULL : NORMAL;
  const [stepI, setStepI] = useState(() => {
    const saved = savedProgress;
    if (!saved) return 0;
    if (saved.completed) return steps.length - 1;
    const next = steps.findIndex((item) => !saved.completedSteps.includes(item));
    return next >= 0 ? next : Math.min(Math.max(saved.step, 0), steps.length - 1);
  });
  const [exI, setExI] = useState(0);
  const [score, setScore] = useState(() => {
    const saved = savedProgress;
    return { ok: 0, n: 0, savedScore: saved?.score ?? 0 };
  });
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [testScore, setTestScore] = useState(0);
  const [scriptOn, setScriptOn] = useState<"full" | "partial" | "none">("full");
  const [speed, setSpeed] = useState(0.9);
  const [listeningMode, setListeningMode] = useState<"listen" | "dictation">("listen");
  const [dictationIndex, setDictationIndex] = useState(0);
  const [dictationAnswer, setDictationAnswer] = useState("");
  const [dictationResult, setDictationResult] = useState<{ score: number; matched: number; total: number } | null>(null);
  const [spoken, setSpoken] = useState("");
  const [writeText, setWriteText] = useState("");
  const [aiNote, setAiNote] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const showUz = showUzbek(lesson.level, profile.immersion, profile.englishOnly);
  const step = steps[stepI] ?? "done";

  const practice = useMemo(() => {
    const extra = lesson.isReview ? lesson.test : [];
    return [...lesson.exercises, ...extra];
  }, [lesson]);

  const testItems = useMemo(() => {
    const bank = getLessonItemBank(lesson).filter((item) => item.lessonId === lesson.id);
    return selectAssessmentItems(bank, Math.min(lesson.test.length, 10), {
      targetSkill: mastery.weakSkills[0] ?? null,
      targetDifficulty: mastery.attempts ? Math.max(1, Math.min(5, Math.round((mastery.bestScore / 20)))) : undefined,
    });
  }, [lesson, mastery.weakSkills, mastery.attempts, mastery.bestScore]);
  const due = dueCards(Object.values(cards)).slice(0, 8);

  function nextStep(pct?: number, skill?: Parameters<typeof addMission>[0]) {
    completeLessonStep(lesson.id, step, pct ?? 0);
    if (skill && pct != null) addMission(skill, pct);
    if (step === "done") return;
    const ni = stepI + 1;
    setStepI(ni);
    setExI(0);
    if (steps[ni] === "done") {
      const weakSkills = weakSkillsFromExercises(testItems, testResults);
      finishLesson(lesson.id, score.n ? Math.round((score.ok / score.n) * 100) : 80, {
        testScore: testScore || (score.n ? Math.round((score.ok / score.n) * 100) : 80),
        weakSkills,
        threshold: MASTERY_THRESHOLD,
      });
      addXp(50);
      touchStreak();
    }
  }

  function handleEx(ex: Exercise, correct: boolean, given: string) {
    recordSkill(ex.skill, correct);
    addXp(correct ? exerciseXp(ex) : 2);
    setScore((s) => ({ ...s, ok: s.ok + (correct ? 1 : 0), n: s.n + 1 }));
    if (step === "test") {
      setTestResults((r) => ({ ...r, [ex.id]: correct }));
      const answered = Object.keys(testResults).length + 1;
      const correctCount = Object.values({ ...testResults, [ex.id]: correct }).filter(Boolean).length;
      setTestScore(Math.round((correctCount / Math.max(1, answered)) * 100));
    }
    const correctAnswer = Array.isArray(ex.answer) ? ex.answer[0] ?? "" : ex.answer;
    if (correct) {
      resolveMistakeCheck(ex.prompt, correctAnswer);
    } else {
      const analysis = analyzeError(ex, given);
      recordMistake({
        type: ex.type,
        skill: ex.skill,
        prompt: ex.prompt,
        userAnswer: given,
        correctAnswer,
        explanation: showUz ? ex.explanationUz : ex.explanation,
        lessonId: lesson.id,
        category: analysis.category,
        concept: analysis.concept,
        grammarTarget: analysis.grammarTarget,
        remediation: { microLesson: analysis.microLesson, steps: analysis.steps, contrast: analysis.contrast },
        status: "active",
        successfulRechecks: 0,
        nextReviewAt: Date.now(),
      });
    }
  }

  function start() {
    startLesson(lesson.id);
    lesson.vocabulary.forEach((w) => ensureCard(w.id));
    nextStep(10, "grammar");
  }

  return (
    <div className="pb-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">
            Day {lesson.day} · {lesson.level.toUpperCase()}
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">{lesson.topic}</h1>
          {showUz ? <p className="text-muted">{lesson.topicUz}</p> : null}
        </div>
        <Badge>{step.replace("-", " ")}</Badge>
      </div>
      <Progress value={(stepI / (steps.length - 1)) * 100} className="mb-6" />

      {step === "mission" ? (
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">{lesson.cefrCanDo}</p>
          {showUz ? <p className="text-muted">{lesson.cefrCanDoUz}</p> : null}
          {lesson.curriculum ? (
            <div className="rounded-lg border border-border bg-bg-elevated px-4 py-3">
              <p className="text-xs uppercase tracking-[0.14em] text-subtle">Curriculum path</p>
              <p className="mt-1 font-medium">{lesson.curriculum.phase}</p>
              <p className="mt-1 text-sm text-muted">
                Lesson {lesson.curriculum.levelSequence} of this level · Retrieval review is built around earlier lessons.
              </p>
            </div>
          ) : null}
          <ul className="grid gap-2 sm:grid-cols-2">
            {[
              ["Grammar", lesson.grammar.title],
              ["Vocabulary", `${lesson.vocabulary.length} words`],
              ["Listening", lesson.listening.title],
              ["Reading", `${lesson.reading.words} words`],
            ].map(([k, v]) => (
              <li key={k} className="rounded-lg bg-bg-elevated px-4 py-3 shadow-[var(--shadow-border)]">
                <p className="text-xs uppercase tracking-[0.14em] text-subtle">{k}</p>
                <p className="font-medium">{v}</p>
              </li>
            ))}
          </ul>
          <Button size="lg" onClick={start}>Begin lesson</Button>
        </div>
      ) : null}

      {step === "srs" ? (
        <div>
          <h2 className="font-display text-2xl font-semibold">Spaced review</h2>
          {due.length === 0 ? (
            <p className="mt-3 text-muted">No cards due. Continue.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {due.map((c) => {
                const w = WORD_BY_ID[c.wordId];
                if (!w) return null;
                return (
                  <li key={c.wordId} className="rounded-lg bg-bg-elevated p-4 shadow-[var(--shadow-border)]">
                    <p className="font-display text-2xl">{w.word}</p>
                    <p className="text-sm text-muted">{w.ipa} {showUz ? `· ${w.uz}` : ""}</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => gradeCard(c.wordId, 0)}>Again</Button>
                      <Button size="sm" variant="secondary" onClick={() => gradeCard(c.wordId, 2)}>Good</Button>
                      <Button size="sm" onClick={() => gradeCard(c.wordId, 3)}>Easy</Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <Button className="mt-4" onClick={() => nextStep(100, "vocabulary")}>Continue</Button>
        </div>
      ) : null}

      {step === "vocab" ? (
        <VocabDeck
          words={lesson.vocabulary}
          showUz={showUz}
          onDone={() => {
            lesson.vocabulary.forEach((w) => ensureCard(w.id));
            addMission("vocabulary", 100);
            nextStep(100, "vocabulary");
          }}
        />
      ) : null}

      {step === "grammar" ? (
        <div>
          <GrammarView g={lesson.grammar} showUz={showUz} />
          <div className="mt-6">
            <h3 className="font-display text-lg font-semibold">Active phrases</h3>
            <ul className="mt-2 space-y-2">
              {lesson.phrases.map((p) => (
                <li key={p.id} className="rounded-md bg-bg-elevated px-3 py-2 shadow-[var(--shadow-border)]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{p.phrase}</p>
                      {showUz ? <p className="text-sm text-muted">{p.uz}</p> : null}
                      <p className="text-sm">{p.example}</p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => speak(p.phrase)}>
                      <Volume2 />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Button className="mt-5" onClick={() => nextStep(100, "grammar")}>Practice this grammar</Button>
        </div>
      ) : null}

      {step === "grammar-practice" ? (
        <Drill
          items={practice}
          index={exI}
          setIndex={setExI}
          showUz={showUz}
          teacherMode={profile.teacherMode}
          onItem={handleEx}
          onDone={() => nextStep(Math.round((score.ok / Math.max(1, score.n)) * 100), "grammar")}
        />
      ) : null}

      {step === "listening" ? (
        <div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={listeningMode === "listen" ? "default" : "outline"} onClick={() => setListeningMode("listen")}>Listen & understand</Button>
            <Button size="sm" variant={listeningMode === "dictation" ? "default" : "outline"} onClick={() => { setListeningMode("dictation"); setDictationIndex(0); setDictationAnswer(""); setDictationResult(null); }}>Dictation</Button>
          </div>

          {listeningMode === "listen" ? (
            <>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => {
                  stopSpeaking();
                  speak(lesson.listening.script.map((s) => s.en).join(". "), { rate: speed, lang: "en-GB" });
                  addListeningMinutes(2);
                }}>
                  <Volume2 className="size-4" /> Play natural voice
                </Button>
                {[0.75, 0.9, 1, 1.1].map((r) => (
                  <Button key={r} size="sm" variant={speed === r ? "default" : "outline"} onClick={() => setSpeed(r)}>
                    {r}x
                  </Button>
                ))}
                {(["full", "partial", "none"] as const).map((m) => (
                  <Button key={m} size="sm" variant={scriptOn === m ? "soft" : "ghost"} onClick={() => setScriptOn(m)}>
                    {m} transcript
                  </Button>
                ))}
              </div>
              {scriptOn !== "none" ? (
                <ol className="mt-4 space-y-2">
                  {lesson.listening.script.map((line, i) => (
                    <li key={line.t + line.en} className="rounded-md bg-bg-elevated px-3 py-2 text-sm shadow-[var(--shadow-border)]">
                      <button type="button" className="text-left" onClick={() => speak(line.en, { rate: speed, lang: "en-GB" })}>
                        <span className="font-mono text-xs text-subtle">{line.t}s</span>
                        <p>{scriptOn === "partial" && i % 2 === 1 ? "___" : line.en}</p>
                        {showUz && scriptOn === "full" ? <p className="text-muted">{line.uz}</p> : null}
                      </button>
                    </li>
                  ))}
                </ol>
              ) : null}
            </>
          ) : (
            <div className="mt-4 rounded-xl bg-bg-elevated p-4 shadow-[var(--shadow-border)]">
              {(() => {
                const line = lesson.listening.script[dictationIndex % Math.max(1, lesson.listening.script.length)];
                const item = line ? makeDictation(line.en, lesson.level) : null;
                if (!line || !item) return null;
                return (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <Badge>Dictation {dictationIndex + 1}/{lesson.listening.script.length}</Badge>
                      <Button size="sm" variant="secondary" onClick={() => speak(line.en, { rate: Math.max(0.72, speed - 0.08), lang: "en-GB" })}><Volume2 className="size-4" /> Listen</Button>
                    </div>
                    <p className="mt-4 text-lg leading-relaxed">{item.masked}</p>
                    <p className="mt-2 text-xs text-muted">Listen twice if needed. Type only the missing words in order.</p>
                    <input className="mt-4 w-full rounded-lg border bg-bg-subtle px-3 py-2" value={dictationAnswer} onChange={(e) => setDictationAnswer(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") setDictationResult(scoreDictation(item, dictationAnswer)); }} placeholder="Type the missing words…" />
                    <div className="mt-3 flex gap-2">
                      <Button onClick={() => setDictationResult(scoreDictation(item, dictationAnswer))}>Check dictation</Button>
                      {dictationResult ? <Button variant="outline" onClick={() => { setDictationIndex((n) => (n + 1) % lesson.listening.script.length); setDictationAnswer(""); setDictationResult(null); }}>Next</Button> : null}
                    </div>
                    {dictationResult ? (
                      <div className="mt-4 rounded-lg bg-bg-subtle p-3 text-sm">
                        <b>{dictationResult.score}%</b> — {dictationResult.matched}/{dictationResult.total} words captured.
                        {dictationResult.score < 80 ? <p className="mt-1 text-muted">Replay the line slowly, then try again. Accuracy matters more than speed.</p> : <p className="mt-1 text-muted">Good listening discrimination. Continue to the comprehension questions.</p>}
                      </div>
                    ) : null}
                  </>
                );
              })()}
            </div>
          )}

          <div className="mt-5">
            <Drill
              items={lesson.listening.questions}
              index={Math.min(exI, lesson.listening.questions.length - 1)}
              setIndex={setExI}
              showUz={showUz}
              teacherMode={profile.teacherMode}
              onItem={handleEx}
              onDone={() => nextStep(100, "listening")}
            />
          </div>
        </div>
      ) : null}

      {step === "shadowing" ? (
        <div>
          <h2 className="font-display text-2xl font-semibold">Shadowing</h2>
          <p className="mt-2 text-muted">Play a line, then speak with it.</p>
          <ul className="mt-4 space-y-3">
            {lesson.listening.script.map((line) => (
              <li key={line.en} className="rounded-lg bg-bg-elevated p-3 shadow-[var(--shadow-border)]">
                <p className="font-medium">{line.en}</p>
                <Button className="mt-2" size="sm" variant="secondary" onClick={() => speak(line.en, { rate: 0.85 })}>
                  Play line
                </Button>
              </li>
            ))}
          </ul>
          <Button className="mt-4" onClick={() => { addSpeakingMinutes(2); nextStep(80, "pronunciation"); }}>
            Continue
          </Button>
        </div>
      ) : null}

      {step === "reading" ? (
        <div>
          <h2 className="font-display text-2xl font-semibold">{lesson.reading.title}</h2>
          {showUz ? <p className="text-muted">{lesson.reading.titleUz}</p> : null}
          <p className="mt-4 whitespace-pre-wrap font-display text-lg leading-relaxed">{lesson.reading.text}</p>
          <p className="mt-2 text-xs text-subtle">{lesson.reading.words} words</p>
          <Drill
            items={lesson.reading.questions}
            index={Math.min(exI, lesson.reading.questions.length - 1)}
            setIndex={setExI}
            showUz={showUz}
            teacherMode={profile.teacherMode}
            onItem={handleEx}
            onDone={() => nextStep(100, "reading")}
          />
        </div>
      ) : null}

      {step === "speaking" ? (
        <div>
          <h2 className="font-display text-2xl font-semibold">Speaking</h2>
          <p className="mt-2 text-lg">{lesson.speaking.prompt}</p>
          {showUz ? <p className="text-muted">{lesson.speaking.promptUz}</p> : null}
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
            {lesson.speaking.scaffolding.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <div className="mt-4 flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setSpoken("");
                startRecognition(
                  (t, fin) => { if (fin) setSpoken(t); else setSpoken(t); },
                );
              }}
            >
              Record
            </Button>
            <Button variant="ghost" onClick={() => speak(lesson.speaking.prompt)}>Hear prompt</Button>
          </div>
          <Textarea className="mt-3" value={spoken} onChange={(e) => setSpoken(e.target.value)} placeholder="Your speaking notes or transcript" />
          <div className="mt-3 flex gap-2">
            <Button
              disabled={aiBusy || spoken.trim().length < 4}
              onClick={async () => {
                setAiBusy(true);
                const res = await correctSpoken({
                  data: { transcript: spoken, prompt: lesson.speaking.prompt, level: lesson.level, uz: showUz },
                });
                setAiNote(res.ok ? res.text : res.error);
                setAiBusy(false);
                addSpeakingMinutes(3);
              }}
            >
              {aiBusy ? "Checking…" : "AI feedback"}
            </Button>
            <Button variant="outline" onClick={() => { addMission("speaking", 80); nextStep(80, "speaking"); }}>
              Continue
            </Button>
          </div>
          {aiNote ? <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-bg-subtle p-4 text-sm leading-relaxed">{aiNote}</pre> : null}
        </div>
      ) : null}

      {step === "writing" ? (
        <div>
          <h2 className="font-display text-2xl font-semibold">Writing</h2>
          <p className="mt-2">{lesson.writing.prompt}</p>
          {showUz ? <p className="text-muted">{lesson.writing.promptUz}</p> : null}
          <p className="mt-1 text-xs text-subtle">Minimum {lesson.writing.minWords} words</p>
          <Textarea className="mt-3 min-h-40" value={writeText} onChange={(e) => setWriteText(e.target.value)} />
          <p className="mt-1 text-xs tabular-nums text-subtle">{writeText.trim().split(/\s+/).filter(Boolean).length} words</p>
          <div className="mt-3 flex gap-2">
            <Button
              disabled={aiBusy || writeText.trim().length < 8}
              onClick={async () => {
                setAiBusy(true);
                const res = await correctWriting({
                  data: { text: writeText, prompt: lesson.writing.prompt, level: lesson.level, uz: showUz },
                });
                setAiNote(res.ok ? res.text : res.error);
                setAiBusy(false);
                addWritingWords(writeText.trim().split(/\s+/).filter(Boolean).length);
              }}
            >
              {aiBusy ? "Checking…" : "AI correction"}
            </Button>
            <Button variant="outline" onClick={() => nextStep(80, "writing")}>Continue</Button>
          </div>
          {aiNote ? <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-bg-subtle p-4 text-sm leading-relaxed">{aiNote}</pre> : null}
        </div>
      ) : null}

      {step === "test" ? (
        <Drill
          items={testItems}
          index={Math.min(exI, testItems.length - 1)}
          setIndex={setExI}
          showUz={showUz}
          teacherMode={false}
          onItem={handleEx}
          onDone={() => nextStep(Math.round((score.ok / Math.max(1, score.n)) * 100), "grammar")}
        />
      ) : null}

      {step === "done" ? (
        <div className="rounded-xl bg-bg-elevated p-6 text-center shadow-[var(--shadow-border)]">
          <p className="text-xs uppercase tracking-[0.14em] text-subtle">Lesson complete</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">Day {lesson.day} done</h2>
          <p className="mt-2 text-muted">
            Score {score.n ? Math.round((score.ok / score.n) * 100) : 0}% · {score.ok}/{score.n} correct
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Button asChild>
              <Link to="/learn">Course map</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/review">Review cards</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Drill({
  items, index, setIndex, showUz, teacherMode, onItem, onDone,
}: {
  items: Exercise[];
  index: number;
  setIndex: (n: number) => void;
  showUz: boolean;
  teacherMode: boolean;
  onItem: (ex: Exercise, correct: boolean, given: string) => void;
  onDone: () => void;
}) {
  const ex = items[index];
  if (!ex) {
    return (
      <div>
        <p className="text-muted">No items in this set.</p>
        <Button className="mt-3" onClick={onDone}>Continue</Button>
      </div>
    );
  }
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-[0.14em] text-subtle">
        {index + 1} / {items.length}
      </p>
      <ExercisePlayer
        key={ex.id}
        exercise={ex}
        showUz={showUz}
        teacherMode={teacherMode}
        onResult={(ok, given) => {
          onItem(ex, ok, given);
        }}
      />
      <Button
        className="mt-4"
        onClick={() => {
          if (index + 1 >= items.length) onDone();
          else setIndex(index + 1);
        }}
      >
        {index + 1 >= items.length ? "Continue" : "Next"}
      </Button>
    </div>
  );
}
