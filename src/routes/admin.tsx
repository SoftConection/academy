import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { Card } from "@/components/ui/card";
import { adminStats, revenueByMonth, recentUsers } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administração — OpenVision Academy" }] }),
  component: AdminPage,
});

function AdminPage() {
  const max = Math.max(...revenueByMonth.map((r) => r.value));
  return (
    <AppShell title="Painel de administração">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-display font-bold">Receita (milhões Kz)</h3>
          <div className="mt-6 flex h-56 items-stretch gap-3">
            {revenueByMonth.map((r) => (
              <div key={r.month} className="flex flex-1 flex-col items-center justify-end gap-2">
                <div className="w-full rounded-t-md bg-gradient-brand transition-all" style={{ height: `${(r.value / max) * 90 + 10}%` }} />
                <span className="text-xs text-muted-foreground">{r.month}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-border p-5"><h3 className="font-display font-bold">Novos utilizadores</h3></div>
          <div className="divide-y divide-border">
            {recentUsers.map((u) => (
              <div key={u.email} className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-brand-foreground">
                  {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{u.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                </div>
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold",
                  u.role === "Empresa" ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground")}>{u.role}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}