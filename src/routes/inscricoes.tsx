import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Users, CheckCircle2, Clock, Filter } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { courses, formatKz, formatDateTime } from "@/lib/mock-data";
import { listEnrollments, setStatus, toCSV, type Enrollment } from "@/lib/enrollments";
import { toast } from "sonner";

export const Route = createFileRoute("/inscricoes")({
  head: () => ({ meta: [{ title: "Inscrições — Admin OpenVision" }] }),
  component: AdminEnrollments,
});

function AdminEnrollments() {
  const [all, setAll] = useState<Enrollment[]>([]);
  const [courseId, setCourseId] = useState("all");
  const [status, setStatusFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    const sync = () => setAll(listEnrollments());
    sync();
    window.addEventListener("ov:enrollments", sync);
    return () => window.removeEventListener("ov:enrollments", sync);
  }, []);

  const filtered = useMemo(() => {
    return all.filter((e) => {
      if (courseId !== "all" && e.courseId !== courseId) return false;
      if (status !== "all" && e.status !== status) return false;
      const d = e.createdAt.slice(0, 10);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }, [all, courseId, status, from, to]);

  const stats = useMemo(() => ({
    total: filtered.length,
    confirmed: filtered.filter((e) => e.status === "confirmado").length,
    pending: filtered.filter((e) => e.status === "pendente").length,
    revenue: filtered.filter((e) => e.status === "confirmado").reduce((s, e) => s + e.amount, 0),
  }), [filtered]);

  function exportCSV() {
    if (!filtered.length) return toast.error("Sem inscrições para exportar.");
    const csv = toCSV(filtered);
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const tag = [from, to].filter(Boolean).join("_a_") || new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `inscricoes_${tag}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado.");
  }

  return (
    <AppShell title="Inscrições">
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat icon={Users} label="Total" value={String(stats.total)} />
        <Stat icon={CheckCircle2} label="Confirmadas" value={String(stats.confirmed)} />
        <Stat icon={Clock} label="Pendentes" value={String(stats.pending)} />
        <Stat icon={Download} label="Receita confirmada" value={formatKz(stats.revenue)} />
      </div>

      <Card className="mt-6 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[180px] flex-1 space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs"><Filter className="h-3.5 w-3.5" /> Curso</Label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os cursos</SelectItem>
                {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="w-40 space-y-1.5">
            <Label className="text-xs">Estado</Label>
            <Select value={status} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="from" className="text-xs">De</Label>
            <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="to" className="text-xs">Até</Label>
            <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40" />
          </div>
          <Button variant="brand" onClick={exportCSV}><Download className="mr-2 h-4 w-4" /> Exportar CSV</Button>
        </div>
      </Card>

      <Card className="mt-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referência</TableHead>
              <TableHead>Aluno</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                Nenhuma inscrição encontrada. As inscrições feitas na demo aparecem aqui.
              </TableCell></TableRow>
            )}
            {filtered.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-mono text-xs">
                  <Link to="/inscricao/$ref" params={{ ref: e.reference }} className="text-primary hover:underline">{e.reference}</Link>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{e.email}</div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{e.courseTitle}</TableCell>
                <TableCell className="whitespace-nowrap text-sm">{formatDateTime(e.createdAt)}</TableCell>
                <TableCell className="whitespace-nowrap">{formatKz(e.amount)}</TableCell>
                <TableCell>
                  <Badge variant={e.status === "confirmado" ? "default" : "secondary"}
                    className={e.status === "confirmado" ? "bg-primary" : ""}>{e.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {e.status === "pendente" ? (
                    <Button size="sm" variant="outline" onClick={() => { setStatus(e.reference, "confirmado"); toast.success("Pagamento confirmado."); }}>
                      Confirmar
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => { setStatus(e.reference, "pendente"); }}>Reverter</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </AppShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-display text-lg font-extrabold">{value}</p>
      </div>
    </Card>
  );
}
