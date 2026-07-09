import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  PenSquare,
  ShieldCheck,
  BadgeCheck,
  ClipboardList,
  Webhook,
  Compass,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SearchCommand } from "./SearchCommand";

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
  const [navExpanded, setNavExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchCloseSignal, setSearchCloseSignal] = useState(0);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setNavExpanded(false);
  }, [path]);

  useEffect(() => {
    if (!searchOpen) return;
    setNavExpanded(false);
  }, [searchOpen]);

  const handleNavClick = () => {
    setNavExpanded(false);
  };

  const handleSettingsClick = () => {
    toast.info("Perfil e definições — em breve");
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-xl sm:px-6">
        <SearchCommand
          isInHeader={true}
          disabled={navExpanded}
          closeSignal={searchCloseSignal}
          onOpenChange={setSearchOpen}
        />
        <h1 className="font-display text-lg font-bold">{title}</h1>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>

      {/* Navigation Overlay */}
      {navExpanded && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
          onClick={() => setNavExpanded(false)}
        />
      )}

      {/* Profile/Settings Button - Top Right */}
      <button
        onClick={handleSettingsClick}
        disabled={navExpanded || searchOpen}
        aria-label="Perfil e definições"
        className={cn(
          "fixed top-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-card border-2 border-border shadow-lg transition-all duration-300",
          "hover:bg-secondary hover:border-brand hover:shadow-xl text-muted-foreground hover:text-foreground",
          (navExpanded || searchOpen) && "opacity-50 cursor-not-allowed hover:bg-card hover:border-border hover:shadow-lg",
          "active:scale-95"
        )}
      >
        <User className="h-6 w-6" />
      </button>

      {/* Primary Navigation Button - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Navigation Grid - Expands Upward */}
        {navExpanded && (
          <div className="mb-4 rounded-2xl bg-card border border-border shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
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

        {/* Compass Navigation Button */}
        <button
          onClick={() => {
            setNavExpanded((prev) => {
              const next = !prev;
              if (next) {
                setSearchCloseSignal((current) => current + 1);
              }
              return next;
            });
          }}
          aria-label={navExpanded ? "Fechar navegação" : "Abrir navegação"}
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300",
            "text-brand-foreground hover:shadow-xl",
            "active:scale-95",
            !navExpanded && "bg-linear-to-br from-brand to-brand/80",
            navExpanded
              ? "scale-125 shadow-2xl bg-gradient-brand"
              : "scale-100 hover:scale-110",
          )}
        >
          <Compass className={cn(
            "h-7 w-7 transition-transform duration-300",
            navExpanded ? "rotate-45" : "rotate-0"
          )} />
        </button>
      </div>
    </div>
  );
}