import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  PenSquare,
  ShieldCheck,
  Menu,
  X,
  Bell,
  Search,
  BadgeCheck,
  ClipboardList,
  Webhook,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const nav = [
  { group: "Aprender", items: [
    { label: "Catálogo", to: "/courses/", icon: BookOpen },
    { label: "Meu painel", to: "/dashboard", icon: LayoutDashboard },
  ]},
  { group: "Ensinar", items: [
    { label: "Painel instrutor", to: "/instructor", icon: GraduationCap },
    { label: "Course builder", to: "/course-builder", icon: PenSquare },
  ]},
  { group: "Gestão", items: [
    { label: "Admin", to: "/admin", icon: ShieldCheck },
    { label: "Inscrições", to: "/inscricoes", icon: ClipboardList },
    { label: "Webhook pagamentos", to: "/webhook-demo", icon: Webhook },
    { label: "Certificados", to: "/certificate/OV-2026-AX91KD", icon: BadgeCheck },
  ]},
];

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-secondary/30 lg:flex">
      {open && (
        <div className="fixed inset-0 z-40 bg-foreground/40 lg:hidden" onClick={() => setOpen(false)} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link to="/" aria-label="Início"><Logo /></Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Fechar"><X className="h-5 w-5" /></button>
        </div>
        <nav className="space-y-6 p-4">
          {nav.map((g) => (
            <div key={g.group}>
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g.group}</p>
              <ul className="mt-2 space-y-1">
                {g.items.map((it) => {
                  const active = path === it.to || (it.to !== "/courses/" && path.startsWith(it.to));
                  return (
                    <li key={it.to}>
                      <Link
                        to={it.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-gradient-brand text-brand-foreground shadow-soft"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                        )}
                      >
                        <it.icon className="h-4 w-4" /> {it.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-secondary p-3 text-xs text-muted-foreground">
          Modo demonstração — dados fictícios, sem backend.
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-xl sm:px-6">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu className="h-5 w-5" /></button>
          <h1 className="font-display text-lg font-bold">{title}</h1>
          <div className="ml-auto hidden items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground sm:flex">
            <Search className="h-4 w-4" /> Pesquisar...
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notificações"
            onClick={() => toast.info("Nenhuma nova notificação no momento")}
          >
            <Bell className="h-5 w-5" />
          </Button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-brand-foreground">AD</div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}