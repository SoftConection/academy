import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Cursos", href: "#cursos" },
  { label: "Empresas", href: "#empresas" },
  { label: "Certificação", href: "#certificacao" },
  { label: "Para quem", href: "#publico" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" aria-label="OpenVision Academy">
          <Logo />
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm">Entrar</Button>
          <Button variant="brand" size="sm">Começar agora</Button>
        </div>
        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-1 text-sm font-medium text-muted-foreground"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex gap-3">
              <Button variant="outline" size="sm" className="flex-1">Entrar</Button>
              <Button variant="brand" size="sm" className="flex-1">Começar</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}