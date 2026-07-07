import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Github, Linkedin } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — OpenVision Academy" },
      { name: "description", content: "Aceda à sua conta OpenVision Academy." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-gradient-brand p-12 text-brand-foreground lg:flex">
        <Link to="/"><Logo className="[&_span]:text-brand-foreground [&_.text-gradient-brand]:text-brand-foreground" /></Link>
        <div>
          <h2 className="font-display text-4xl font-extrabold leading-tight text-brand-foreground">
            Aprenda, ensine e certifique num só ecossistema.
          </h2>
          <p className="mt-4 max-w-md text-brand-foreground/85">
            Junte-se a milhares de estudantes e empresas que constroem o futuro com a OpenVision Academy.
          </p>
        </div>
        <p className="text-sm text-brand-foreground/70">Modo demonstração — sem autenticação real.</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden"><Link to="/"><Logo /></Link></div>
          <h1 className="font-display text-2xl font-extrabold">
            {mode === "login" ? "Bem-vindo de volta" : "Criar conta"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Aceda ao seu painel de aprendizagem." : "Comece a sua jornada hoje."}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[{ i: Mail, l: "Google" }, { i: Github, l: "GitHub" }, { i: Linkedin, l: "LinkedIn" }].map((p) => (
              <Button
                key={p.l}
                type="button"
                variant="outline"
                className="h-10"
                aria-label={p.l}
                onClick={() => toast.info(`Login com ${p.l} em breve`)}
              >
                <p.i className="h-4 w-4" />
              </Button>
            ))}
          </div>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> ou com email <span className="h-px flex-1 bg-border" />
          </div>

          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input className="h-11 flex-1 bg-transparent text-sm outline-none" placeholder="email@exemplo.ao" type="email" />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <input className="h-11 flex-1 bg-transparent text-sm outline-none" placeholder="Palavra-passe" type="password" />
            </div>
            <Button asChild variant="brand" size="lg" className="w-full">
              <Link to="/dashboard">{mode === "login" ? "Entrar" : "Criar conta"}</Link>
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Ainda não tem conta? " : "Já tem conta? "}
            <button className="font-semibold text-primary" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
              {mode === "login" ? "Registar" : "Entrar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}