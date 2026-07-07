import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { CourseCard } from "@/components/app/CourseCard";
import { courses } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Catálogo de cursos — OpenVision Academy" },
      { name: "description", content: "Explore cursos de IA, software, cloud, cibersegurança e negócios." },
    ],
  }),
  component: CoursesPage,
});

const categories = ["Todos", ...Array.from(new Set(courses.map((c) => c.category)))];

function CoursesPage() {
  const [cat, setCat] = useState("Todos");
  const list = cat === "Todos" ? courses : courses.filter((c) => c.category === cat);
  return (
    <AppShell title="Catálogo de cursos">
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              cat === c ? "bg-gradient-brand text-brand-foreground" : "border border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </AppShell>
  );
}