import { Link } from "@tanstack/react-router";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero.jpg";

const stats = [
  { value: "120+", label: "Cursos práticos" },
  { value: "15k+", label: "Estudantes" },
  { value: "80+", label: "Empresas parceiras" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-hero">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-accent-foreground shadow-soft">
            <Sparkles className="h-3.5 w-3.5" /> A academia digital de referência em Angola
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            Aprenda as tecnologias que{" "}
            <span className="text-gradient-brand">moldam o futuro</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            IA, engenharia de software, cloud, cibersegurança e inovação. A OpenVision
            Academy forma estudantes, instrutores e equipas de empresas num só ecossistema.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild variant="brand" size="xl">
              <Link to="/courses/">Explorar cursos <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <a href="#cursos"><PlayCircle className="h-5 w-5" /> Ver demonstração</a>
            </Button>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-2xl font-extrabold text-foreground">{s.value}</dt>
                <dd className="text-xs text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative">
          <div className="absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-3xl bg-gradient-brand opacity-25 blur-2xl" />
          <img
            src={heroImg}
            alt="Estudantes a colaborar num espaço de aprendizagem moderno"
            width={1280}
            height={960}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="rounded-3xl border border-border/60 shadow-brand"
          />
        </div>
      </div>
    </section>
  );
}