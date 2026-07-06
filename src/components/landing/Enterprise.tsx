import { motion } from "framer-motion";
import { ArrowRight, BarChart3, BadgeCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const items = [
  { icon: Users, title: "Onboarding de equipas", desc: "Convide e organize colaboradores em poucos cliques." },
  { icon: BarChart3, title: "Acompanhe o progresso", desc: "Dashboards de desempenho por equipa e por colaborador." },
  { icon: BadgeCheck, title: "Valide certificados", desc: "Verifique competências reais com certificação confiável." },
];

export function Enterprise() {
  return (
    <section id="empresas" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-foreground text-background shadow-brand">
        <div className="grid gap-10 p-10 lg:grid-cols-2 lg:p-16">
          <div>
            <span className="text-sm font-semibold text-brand-amber">Para empresas</span>
            <h2 className="mt-3 text-3xl font-extrabold text-background sm:text-4xl">
              Forme as suas equipas em escala
            </h2>
            <p className="mt-4 max-w-md text-background/70">
              Contratos corporativos com gestão centralizada, relatórios e certificação.
              O caminho para transformar competências em resultados.
            </p>
            <Button asChild variant="brand" size="xl" className="mt-8">
              <a href="mailto:equipa@openvision.academy?subject=Plano%20Corporativo%20OpenVision">
                Falar com a equipa <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
          <div id="certificacao" className="grid gap-4 self-center">
            {items.map((it, i) => (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-4 rounded-2xl bg-background/5 p-5 ring-1 ring-background/10"
              >
                <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground">
                  <it.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-background">{it.title}</h3>
                  <p className="text-sm text-background/70">{it.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}