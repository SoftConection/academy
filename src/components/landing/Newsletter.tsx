import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      toast.error("Introduza um email válido.");
      return;
    }
    setDone(true);
    toast.success("Subscrição confirmada! (demo)");
    setEmail("");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-brand px-6 py-14 text-center text-brand-foreground sm:px-12">
        <Mail className="mx-auto h-10 w-10 opacity-90" />
        <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
          Fique a par das novidades
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-brand-foreground/90">
          Novos cursos, descontos e conteúdos exclusivos de IA, software e cloud — diretamente no seu email.
        </p>
        <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="o.seu@email.com"
            aria-label="Email"
            maxLength={255}
            className="h-12 flex-1 border-0 bg-background/95 text-foreground"
          />
          <Button type="submit" variant="hero" size="xl">
            {done ? <><CheckCircle2 className="h-5 w-5" /> Subscrito</> : "Subscrever"}
          </Button>
        </form>
        <p className="mt-4 text-xs text-brand-foreground/80">Sem spam. Cancele quando quiser.</p>
      </div>
    </section>
  );
}