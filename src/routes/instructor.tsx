import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Plus } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { instructorCourses, recentSubmissions, formatKz } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/instructor")({
  head: () => ({ meta: [{ title: "Painel do instrutor — OpenVision Academy" }] }),
  component: InstructorPage,
});

function InstructorPage() {
  const totalStudents = instructorCourses.reduce((a, c) => a + c.students, 0);
  const totalRevenue = instructorCourses.reduce((a, c) => a + c.revenue, 0);
  return (
    <AppShell title="Painel do instrutor">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground">Gerencie os seus cursos e alunos.</p>
        <Button asChild variant="brand"><Link to="/course-builder"><Plus className="h-4 w-4" /> Novo curso</Link></Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Cursos" value={String(instructorCourses.length)} />
        <StatCard label="Total de alunos" value={totalStudents.toLocaleString("pt-AO")} />
        <StatCard label="Receita total" value={formatKz(totalRevenue)} delta="+9,1%" />
        <StatCard label="Avaliação média" value="4,85" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="border-b border-border p-5"><h3 className="font-display font-bold">Os meus cursos</h3></div>
          <div className="divide-y divide-border">
            {instructorCourses.map((c) => (
              <div key={c.title} className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.students.toLocaleString("pt-AO")} alunos · {formatKz(c.revenue)}</p>
                </div>
                <div className="flex items-center gap-3">
                  {c.rating > 0 && <span className="flex items-center gap-1 text-sm"><Star className="h-3.5 w-3.5 fill-primary text-primary" /> {c.rating}</span>}
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold",
                    c.status === "Publicado" ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground")}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-display font-bold">Entregas recentes</h3>
          <ul className="mt-4 space-y-4">
            {recentSubmissions.map((s) => (
              <li key={s.student + s.task} className="rounded-lg bg-secondary/60 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{s.student}</p>
                  <span className={cn("text-xs font-semibold", s.status === "Pendente" ? "text-primary" : "text-muted-foreground")}>{s.status}</span>
                </div>
                <p className="text-xs text-muted-foreground">{s.task} · {s.course}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}