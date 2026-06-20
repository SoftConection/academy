import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-brand px-8 py-16 text-center shadow-brand sm:px-16">
        <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-brand-foreground/10 blur-2xl" />
        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold text-brand-foreground sm:text-4xl">
          Comece a sua jornada com a OpenVision Academy
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-brand-foreground/85">
          Democratizar a educação e a formação profissional através de tecnologia moderna.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button variant="hero" size="xl">
            Criar conta gratuita <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}