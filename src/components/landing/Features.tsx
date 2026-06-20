import { motion } from "framer-motion";
import {
  Brain,
  ShieldCheck,
  Cloud,
  Code2,
  GraduationCap,
  Building2,
} from "lucide-react";

const features = [
  { icon: Brain, title: "Inteligência Artificial", desc: "Tutor IA, geração de quizzes e revisão automática de trabalhos." },
  { icon: Code2, title: "Engenharia de Software", desc: "Trilhas práticas com projetos reais e mentoria especializada." },
  { icon: Cloud, title: "Cloud Computing", desc: "Infraestrutura moderna, DevOps e arquiteturas escaláveis." },
  { icon: ShieldCheck, title: "Cibersegurança", desc: "Defesa, ethical hacking e boas práticas de segurança." },
  { icon: GraduationCap, title: "Certificação verificável", desc: "Certificados com código único e QR de verificação." },
  { icon: Building2, title: "Formação corporativa", desc: "Compre formação para a sua equipa e acompanhe o progresso." },
];

export function Features() {
  return (
    <section id="cursos" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl">
          Um ecossistema completo de aprendizagem
        </h2>
        <p className="mt-4 text-muted-foreground">
          Do estudante individual à equipa corporativa — tudo o que precisa para aprender,
          ensinar e certificar.
        </p>
      </div>
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className="group rounded-2xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-brand"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}