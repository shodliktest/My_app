import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { LessonPlayer } from "@/components/lesson-player";
import { Button } from "@/components/ui/button";
import { LESSON_BY_ID } from "@/content";
import { useAppStore } from "@/lib/store";
import { useEffect } from "react";

export const Route = createFileRoute("/learn/$lessonId")({ component: LessonPage });

function LessonPage() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();
  const hydrated = useAppStore((s) => s.hydrated);
  const lesson = LESSON_BY_ID[lessonId];

  useEffect(() => {
    if (hydrated && !lesson) navigate({ to: "/learn", replace: true });
  }, [hydrated, lesson, navigate]);

  if (!lesson) {
    return (
      <AppShell>
        <h1 className="font-display text-2xl font-semibold">Lesson not found</h1>
        <p className="mt-2 text-muted">This lesson link is no longer available. The course map has been opened instead.</p>
        <Button className="mt-4" asChild>
          <Link to="/learn">Back to map</Link>
        </Button>
      </AppShell>
    );
  }
  return (
    <AppShell title={`Day ${lesson.day} · ${lesson.level.toUpperCase()}`}>
      <LessonPlayer lesson={lesson} />
    </AppShell>
  );
}
