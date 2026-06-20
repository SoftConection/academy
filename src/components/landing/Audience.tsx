import { Check } from "lucide-react";

const audiences = [
  { title: "Estudantes", points: ["Trilhas guiadas", "Progresso e analytics", "Certificados verificáveis"] },
  { title: "Instrutores", points: ["Course builder", "Gestão de alunos", "Avaliações e quizzes"] },
  { title: "Empresas", points: ["Formação para equipas", "Relatórios de progresso", "Validação de certificados"] },
  { title: "Instituições", points: ["Academias multi-tenant", "Branding próprio", "Gestão centralizada"] },
];

export function Audience() {
  return (
    <section id="publico" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Feito para todos</h2>
          <p className="mt-4 text-muted-foreground">
            Uma plataforma, vários perfis. Cada um com a experiência certa.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a) => (
            <div key={a.title} className="rounded-2xl border border-border bg-card p-7 shadow-soft">
              <h3 className="text-lg font-bold text-gradient-brand">{a.title}</h3>
              <ul className="mt-4 space-y-3">
                {a.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}