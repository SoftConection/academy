import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  PenSquare,
  ShieldCheck,
  Settings,
  Bell,
  Search,
  BadgeCheck,
  ClipboardList,
  Webhook,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
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
  const [navOpen, setNavOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-xl sm:px-6">
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

      {/* Navigation Gear Button */}
      <Drawer open={navOpen} onOpenChange={setNavOpen}>
        <button
          onClick={() => setNavOpen(true)}
          aria-label="Abrir navegação"
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-brand shadow-lg transition-transform hover:scale-110 hover:shadow-xl text-brand-foreground"
        >
          <Settings className="h-6 w-6" />
        </button>

        <DrawerContent className="bg-card">
          <DrawerHeader className="border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-lg font-bold">Navegação</DrawerTitle>
              <DrawerClose asChild>
                <button type="button" aria-label="Fechar"><X className="h-5 w-5" /></button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <nav className="space-y-6 p-6 max-h-[60vh] overflow-y-auto">
            {nav.map((g) => (
              <div key={g.group}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g.group}</p>
                <ul className="mt-3 space-y-2">
                  {g.items.map((it) => {
                    const active = path === it.to || (it.to !== "/courses/" && path.startsWith(it.to));
                    return (
                      <li key={it.to}>
                        <Link
                          to={it.to}
                          onClick={() => setNavOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                            active
                              ? "bg-gradient-brand text-brand-foreground shadow-soft"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                          )}
                        >
                          <it.icon className="h-4 w-4 shrink-0" /> {it.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-t border-border p-4 sm:p-6">
            <div className="rounded-xl bg-secondary p-3 text-xs text-muted-foreground">
              Modo demonstração — dados fictícios, sem backend.
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}