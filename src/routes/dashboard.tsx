import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Trophy } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { CourseCard } from "@/components/app/CourseCard";
import { Card } from "@/components/ui/card";
import { enrolledCourses, studentStats, upcomingEvents, certificates } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Meu painel — OpenVision Academy" }] }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <AppShell title="Olá, Ana 👋">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {studentStats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl font-bold">Continuar a aprender</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {enrolledCourses.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="flex items-center gap-2 font-display font-bold"><Calendar className="h-4 w-4 text-primary" /> Agenda</h3>
            <ul className="mt-4 space-y-4">
              {upcomingEvents.map((e) => (
                <li key={e.title} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold text-accent-foreground">{e.tag}</span>
                  <div>
                    <p className="text-sm font-medium leading-snug">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{e.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="flex items-center gap-2 font-display font-bold"><Trophy className="h-4 w-4 text-primary" /> Certificados</h3>
            <ul className="mt-4 space-y-3">
              {certificates.map((c) => (
                <li key={c.code} className="rounded-lg bg-secondary/60 p-3">
                  <p className="text-sm font-medium leading-snug">{c.course}</p>
                  <p className="text-xs text-muted-foreground">{c.code} · {c.date}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}