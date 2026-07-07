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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const allNavItems = [
  { label: "Catálogo", to: "/courses/", icon: BookOpen },
  { label: "Meu painel", to: "/dashboard", icon: LayoutDashboard },
  { label: "Painel instrutor", to: "/instructor", icon: GraduationCap },
  { label: "Course builder", to: "/course-builder", icon: PenSquare },
  { label: "Admin", to: "/admin", icon: ShieldCheck },
  { label: "Inscrições", to: "/inscricoes", icon: ClipboardList },
  { label: "Webhook pagamentos", to: "/webhook-demo", icon: Webhook },
  { label: "Certificados", to: "/certificate/OV-2026-AX91KD", icon: BadgeCheck },
];

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const [gearExpanded, setGearExpanded] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  const handleNavClick = () => {
    setGearExpanded(false);
  };

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

      {/* Gear Navigation Expansion */}
      {gearExpanded && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40"
          onClick={() => setGearExpanded(false)}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50">
        {/* Expanded Grid */}
        {gearExpanded && (
          <div className="mb-6 rounded-2xl bg-card border border-border shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-md">
              {allNavItems.map((item) => {
                const active = path === item.to || (item.to !== "/courses/" && path.startsWith(item.to));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={handleNavClick}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200",
                      "hover:scale-105 active:scale-95",
                      active
                        ? "bg-gradient-brand text-brand-foreground shadow-soft ring-2 ring-brand-foreground/20"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground border border-border/50",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 p-2.5 rounded-lg bg-secondary/50 text-xs text-muted-foreground text-center">
              Demo — dados fictícios, sem backend
            </div>
          </div>
        )}

        {/* Gear Button */}
        <button
          onClick={() => setGearExpanded(!gearExpanded)}
          aria-label={gearExpanded ? "Fechar navegação" : "Abrir navegação"}
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand shadow-lg transition-all duration-300",
            "hover:shadow-xl text-brand-foreground",
            gearExpanded
              ? "scale-125 shadow-2xl"
              : "scale-100 hover:scale-110",
          )}
        >
          <Settings className={cn(
            "h-7 w-7 transition-transform duration-300",
            gearExpanded ? "rotate-180" : "rotate-0"
          )} />
        </button>
      </div>
    </div>
  );
}