import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { LessonPlayer } from "@/components/lesson-player";
import { Button } from "@/components/ui/button";
import { LESSON_BY_ID } from "@/content";

/**
 * Web-safe dynamic lesson route.
 *
 * The lesson is resolved from the route params in the TanStack loader instead
 * of depending on a client-only hydration effect. This makes direct Vercel
 * requests such as /learn/pre-a1-01 resolve to the LessonPlayer during SSR
 * as well as during client-side navigation.
 */
export const Route = createFileRoute("/learn/$lessonId")({
  loader: ({ params }) => ({
    lesson: LESSON_BY_ID[params.lessonId] ?? null,
  }),
  component: LessonPage,
});

function LessonPage() {
  const { lesson } = Route.useLoaderData();

  if (!lesson) {
    return (
      <AppShell>
        <h1 className="font-display text-2xl font-semibold">Lesson not found</h1>
        <p className="mt-2 text-muted">This lesson link is no longer available.</p>
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
