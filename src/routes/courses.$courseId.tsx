import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Star, Clock, BookOpen, Users, PlayCircle, CheckCircle2, Lock } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { courses, formatKz } from "@/lib/mock-data";

export const Route = createFileRoute("/courses/$courseId")({
  head: () => ({
    meta: [{ title: "Curso — OpenVision Academy" }],
  }),
  component: CourseDetail,
  notFoundComponent: () => (
    <AppShell title="Curso"><p className="text-muted-foreground">Curso não encontrado.</p></AppShell>
  ),
});

const modules = [
  { title: "Introdução e fundamentos", lessons: ["Boas-vindas", "Visão geral", "Configuração do ambiente"], done: true },
  { title: "Conceitos essenciais", lessons: ["Teoria base", "Exemplos práticos", "Quiz do módulo"], done: true },
  { title: "Projeto prático", lessons: ["Briefing", "Implementação", "Revisão e feedback"], done: false },
  { title: "Avançado e certificação", lessons: ["Tópicos avançados", "Exame final", "Certificado"], done: false },
];

function CourseDetail() {
  const { courseId } = useParams({ from: "/courses/$courseId" });
  const course = courses.find((c) => c.id === courseId) ?? courses[0];

  return (
    <AppShell title={course.title}>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className={`relative flex h-56 items-center justify-center rounded-2xl bg-gradient-to-br ${course.color}`}>
            <PlayCircle className="h-16 w-16 text-background/90" />
          </div>
          <p className="mt-6 text-sm font-semibold text-primary">{course.category}</p>
          <h2 className="mt-1 font-display text-3xl font-extrabold">{course.title}</h2>
          <p className="mt-3 text-muted-foreground">{course.summary}</p>
          <div className="mt-4 flex flex-wrap gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-primary text-primary" /> {course.rating}</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {course.students.toLocaleString("pt-AO")} alunos</span>
            <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {course.lessons} aulas</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {course.hours}h</span>
          </div>

          <h3 className="mt-10 font-display text-xl font-bold">Conteúdo do curso</h3>
          <div className="mt-4 space-y-3">
            {modules.map((m, i) => (
              <Card key={m.title} className="p-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Módulo {i + 1}: {m.title}</h4>
                  <span className="text-xs text-muted-foreground">{m.lessons.length} aulas</span>
                </div>
                <ul className="mt-3 space-y-2">
                  {m.lessons.map((l) => (
                    <li key={l} className="flex items-center gap-2 text-sm text-muted-foreground">
                      {m.done ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4" />} {l}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card className="sticky top-24 p-6">
            {course.progress !== undefined ? (
              <>
                <p className="text-sm text-muted-foreground">O seu progresso</p>
                <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                  <div className="h-2 rounded-full bg-gradient-brand" style={{ width: `${course.progress}%` }} />
                </div>
                <p className="mt-2 text-sm font-semibold">{course.progress}% concluído</p>
                <Button variant="brand" size="lg" className="mt-5 w-full">Continuar a aprender</Button>
              </>
            ) : (
              <>
                <p className="font-display text-3xl font-extrabold">{formatKz(course.price)}</p>
                <Button variant="brand" size="lg" className="mt-5 w-full">Inscrever-me</Button>
                <Button variant="outline" size="lg" className="mt-3 w-full">Adicionar à lista</Button>
              </>
            )}
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Acesso vitalício</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Certificado verificável</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Projetos práticos</p>
            </div>
            <Link to="/courses" className="mt-6 block text-center text-sm font-medium text-primary">← Voltar ao catálogo</Link>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}