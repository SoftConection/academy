import { useState } from "react";
import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Clock, BookOpen, ShieldCheck, CreditCard, CalendarClock, Building2, Copy, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { courses, formatKz, formatDateTime, enrollmentDeadline, isEnrollmentOpen } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/courses/$courseId/enroll")({
  head: () => ({ meta: [{ title: "Inscrição — OpenVision Academy" }] }),
  component: Enroll,
  notFoundComponent: () => (
    <AppShell title="Inscrição"><p className="text-muted-foreground">Curso não encontrado.</p></AppShell>
  ),
});

function Enroll() {
  const { courseId } = useParams({ from: "/courses/$courseId/enroll" });
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === courseId) ?? courses[0];
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "", payment: "transfer" });
  const [submitted, setSubmitted] = useState(false);

  const open = isEnrollmentOpen(course.startDate);
  const deadline = enrollmentDeadline(course.startDate);

  function copy(text: string, label: string) {
    navigator.clipboard?.writeText(text).then(
      () => toast.success(`${label} copiado`),
      () => toast.error("Não foi possível copiar"),
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!open) {
      toast.error("As inscrições para este curso estão encerradas.");
      return;
    }
    if (!form.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
      toast.error("Preencha o nome e um email válido.");
      return;
    }
    if (!form.phone.trim()) {
      toast.error("Indique um número de telefone para contacto.");
      return;
    }
    setSubmitted(true);
    toast.success("Inscrição concluída! (demo)");
  }

  if (submitted) {
    return (
      <AppShell title="Inscrição concluída">
        <Card className="mx-auto max-w-lg p-10 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
          <h2 className="mt-4 font-display text-2xl font-extrabold">Está inscrito!</h2>
          <p className="mt-2 text-muted-foreground">
            A sua pré-inscrição em <strong>{course.title}</strong> foi registada. Conclua o pagamento por
            transferência para as coordenadas indicadas e envie o comprovativo até <strong>{formatDateTime(deadline.toISOString())}</strong>.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Início do curso: {formatDateTime(course.startDate)}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="brand" onClick={() => navigate({ to: "/courses/$courseId", params: { courseId: course.id } })}>
              Ver o curso
            </Button>
            <Button asChild variant="outline">
              <Link to="/dashboard">Ir para o painel</Link>
            </Button>
          </div>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell title={`Inscrição — ${course.title}`}>
      {!open && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="font-semibold text-destructive">Inscrições encerradas</p>
            <p className="text-muted-foreground">
              O prazo terminou a {formatDateTime(deadline.toISOString())} (24h antes do início). Contacte-nos para a próxima turma.
            </p>
          </div>
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={onSubmit} className="lg:col-span-2">
          <Card className="mb-6 flex items-center gap-3 border-primary/30 bg-primary/5 p-4">
            <CalendarClock className="h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm">
              Inscrições abertas até <strong>{formatDateTime(deadline.toISOString())}</strong> — 24h antes do início
              ({formatDateTime(course.startDate)}).
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-lg font-bold">Os seus dados</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" value={form.name} maxLength={100}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ana Silva" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} maxLength={255}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ana@email.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" value={form.phone} maxLength={20}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+244 9XX XXX XXX" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea id="notes" value={form.notes} maxLength={500}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Alguma informação relevante..." />
              </div>
            </div>
          </Card>

          <Card className="mt-6 p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold">
              <Building2 className="h-5 w-5 text-primary" /> Coordenadas bancárias do curso
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Faça a transferência do valor total e use a referência abaixo. Estas coordenadas são exclusivas deste curso.
            </p>
            <dl className="mt-4 divide-y divide-border rounded-xl border border-border">
              {[
                { label: "Banco", value: course.bank.bankName },
                { label: "Titular", value: course.bank.accountHolder },
                { label: "IBAN", value: course.bank.iban, mono: true },
                { label: "Nº de conta", value: course.bank.account, mono: true },
                { label: "Referência", value: course.bank.reference, mono: true },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">{row.label}</dt>
                    <dd className={`truncate font-semibold ${row.mono ? "font-mono" : ""}`}>{row.value}</dd>
                  </div>
                  <button type="button" onClick={() => copy(row.value, row.label)}
                    className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label={`Copiar ${row.label}`}>
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="mt-6 p-6">
            <h3 className="font-display text-lg font-bold">Pagamento</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { id: "transfer", label: "Transferência" },
                { id: "multicaixa", label: "Multicaixa Express" },
                { id: "deposit", label: "Depósito" },
              ].map((p) => (
                <button type="button" key={p.id} onClick={() => setForm({ ...form, payment: p.id })}
                  className={`flex items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors ${
                    form.payment === p.id ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-accent"
                  }`}>
                  <CreditCard className="h-4 w-4" /> {p.label}
                </button>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Ambiente de demonstração — nenhum pagamento real é processado.
            </p>
            <Button type="submit" variant="brand" size="lg" className="mt-6 w-full" disabled={!open}>
              {open ? `Confirmar inscrição — ${formatKz(course.price)}` : "Inscrições encerradas"}
            </Button>
          </Card>
        </form>

        <div>
          <Card className="sticky top-24 p-6">
            <div className={`flex h-28 items-center justify-center rounded-xl bg-gradient-to-br ${course.color}`}>
              <BookOpen className="h-10 w-10 text-background/90" />
            </div>
            <p className="mt-4 text-sm font-semibold text-primary">{course.category}</p>
            <h4 className="mt-1 font-display text-lg font-bold">{course.title}</h4>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {course.lessons} aulas</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {course.hours}h</span>
            </div>
            <div className="mt-4 rounded-xl border border-border p-3 text-sm">
              <p className="flex items-center gap-1.5 text-muted-foreground"><CalendarClock className="h-4 w-4" /> Início</p>
              <p className="mt-0.5 font-semibold">{formatDateTime(course.startDate)}</p>
              <p className="mt-2 text-xs text-muted-foreground">Prazo de inscrição: {formatDateTime(deadline.toISOString())}</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-muted-foreground">Total</span>
              <span className="font-display text-2xl font-extrabold">{formatKz(course.price)}</span>
            </div>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Acesso vitalício</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Certificado verificável</p>
            </div>
            <Link to="/courses/$courseId" params={{ courseId: course.id }} className="mt-6 block text-center text-sm font-medium text-primary">← Voltar ao curso</Link>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}