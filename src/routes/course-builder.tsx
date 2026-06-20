import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GripVertical, Plus, Video, FileText, HelpCircle, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/course-builder")({
  head: () => ({ meta: [{ title: "Course Builder — OpenVision Academy" }] }),
  component: CourseBuilder;
});

type Lesson = { id: number; title: string; type: "video" | "pdf" | "quiz" };
type Module = { id: number; title: string; lessons: Lesson[] };

const initial: Module[] = [
  { id: 1, title: "Introdução", lessons: [
    { id: 1, title: "Boas-vindas ao curso", type: "video" },
    { id: 2, title: "Material de apoio", type: "pdf" },
  ]},
  { id: 2, title: "Conceitos fundamentais", lessons: [
    { id: 3, title: "Teoria base", type: "video" },
    { id: 4, title: "Quiz de avaliação", type: "quiz" },
  ]},
];

const typeIcon = { video: Video, pdf: FileText, quiz: HelpCircle };

function CourseBuilder() {
  const [modules, setModules] = useState<Module[]>(initial);
  const [title, setTitle] = useState("Novo curso sem título");

  const addModule = () =>
    setModules((m) => [...m, { id: Date.now(), title: `Módulo ${m.length + 1}`, lessons: [] }]);
  const addLesson = (mid: number) =>
    setModules((m) => m.map((mod) => mod.id === mid
      ? { ...mod, lessons: [...mod.lessons, { id: Date.now(), title: "Nova aula", type: "video" }] }
      : mod));
  const removeLesson = (mid: number, lid: number) =>
    setModules((m) => m.map((mod) => mod.id === mid
      ? { ...mod, lessons: mod.lessons.filter((l) => l.id !== lid) } : mod));

  return (
    <AppShell title="Course Builder">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="max-w-md flex-1 rounded-lg border border-input bg-background px-4 py-2 font-display text-lg font-bold outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="flex gap-2">
          <Button variant="outline">Pré-visualizar</Button>
          <Button variant="brand">Publicar</Button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {modules.map((mod, i) => (
          <Card key={mod.id} className="p-5">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-primary">Módulo {i + 1}</span>
              <input
                value={mod.title}
                onChange={(e) => setModules((m) => m.map((x) => x.id === mod.id ? { ...x, title: e.target.value } : x))}
                className="flex-1 bg-transparent font-semibold outline-none"
              />
            </div>
            <ul className="mt-4 space-y-2">
              {mod.lessons.map((l) => {
                const Icon = typeIcon[l.type];
                return (
                  <li key={l.id} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="flex-1 text-sm">{l.title}</span>
                    <span className="text-xs uppercase text-muted-foreground">{l.type}</span>
                    <button onClick={() => removeLesson(mod.id, l.id)} aria-label="Remover">
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </li>
                );
              })}
            </ul>
            <Button variant="ghost" size="sm" className="mt-3" onClick={() => addLesson(mod.id)}>
              <Plus className="h-4 w-4" /> Adicionar aula
            </Button>
          </Card>
        ))}
      </div>

      <Button variant="outline" className="mt-4 w-full border-dashed" onClick={addModule}>
        <Plus className="h-4 w-4" /> Adicionar módulo
      </Button>
    </AppShell>
  );
}