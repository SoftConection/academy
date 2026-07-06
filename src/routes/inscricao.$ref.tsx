import { useEffect, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { CheckCircle2, Clock, Building2, Copy, Receipt, Loader2, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { courses, formatKz, formatDateTime } from "@/lib/mock-data";
import { getEnrollment, setStatus, type Enrollment } from "@/lib/enrollments";
import { toast } from "sonner";

export const Route = createFileRoute("/inscricao/$ref")({
  head: () => ({ meta: [{ title: "Comprovativo de inscrição — OpenVision Academy" }] }),
  component: ReceiptPage,
});

function ReceiptPage() {
  const { ref } = useParams({ from: "/inscricao/$ref" });
  const [enrollment, setEnrollment] = useState<Enrollment | undefined>(() => getEnrollment(ref));
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const sync = () => setEnrollment(getEnrollment(ref));
    window.addEventListener("ov:enrollments", sync);
    return () => window.removeEventListener("ov:enrollments", sync);
  }, [ref]);

  if (!enrollment) {
    return (
      <AppShell title="Comprovativo">
        <Card className="mx-auto max-w-lg p-10 text-center">
          <p className="text-muted-foreground">Inscrição não encontrada para a referência <strong>{ref}</strong>.</p>
          <Button asChild variant="brand" className="mt-6"><Link to="/courses/">Ver cursos</Link></Button>
        </Card>
      </AppShell>
    );
  }

  const course = courses.find((c) => c.id === enrollment.courseId) ?? courses[0];
  const confirmed = enrollment.status === "confirmado";

  function copy(text: string, label: string) {
    navigator.clipboard?.writeText(text).then(
      () => toast.success(`${label} copiado`),
      () => toast.error("Não foi possível copiar"),
    );
  }

  // Demo: simulate the bank confirming a payment by reference.
  function simulatePayment() {
    setConfirming(true);
    setTimeout(() => {
      setStatus(enrollment!.reference, "confirmado");
      setConfirming(false);
      toast.success("Pagamento confirmado! (demo)");
    }, 1800);
  }

  return (
    <AppShell title="Comprovativo de inscrição">
      <div className="mx-auto max-w-2xl space-y-6">
        <Card className="overflow-hidden">
          <div className={`flex items-center justify-between gap-3 p-6 ${confirmed ? "bg-primary/10" : "bg-amber-500/10"}`}>
            <div className="flex items-center gap-3">
              {confirmed ? <CheckCircle2 className="h-9 w-9 text-primary" /> : <Clock className="h-9 w-9 text-amber-600" />}
              <div>
                <p className="text-sm text-muted-foreground">Estado do pagamento</p>
                <p className="font-display text-xl font-extrabold">{confirmed ? "Confirmado" : "Pendente"}</p>
              </div>
            </div>
            <Badge variant={confirmed ? "default" : "secondary"} className={confirmed ? "bg-primary" : ""}>
              {confirmed ? "Pago" : "A aguardar transferência"}
            </Badge>
          </div>

          <div className="space-y-4 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Receipt className="h-4 w-4 text-primary" /> Detalhes da inscrição
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <Row label="Curso" value={enrollment.courseTitle} />
              <Row label="Aluno" value={enrollment.name} />
              <Row label="Email" value={enrollment.email} />
              <Row label="Telefone" value={enrollment.phone} />
              <Row label="Submetido em" value={formatDateTime(enrollment.createdAt)} />
              <Row label="Início do curso" value={formatDateTime(course.startDate)} />
              <Row label="Valor" value={formatKz(enrollment.amount)} />
              <div>
                <dt className="text-xs text-muted-foreground">Referência</dt>
                <dd className="flex items-center gap-2 font-mono font-semibold">
                  {enrollment.reference}
                  <button onClick={() => copy(enrollment.reference, "Referência")} aria-label="Copiar referência"
                    className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </Card>

        {!confirmed && (
          <Card className="p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold">
              <Building2 className="h-5 w-5 text-primary" /> Conclua a transferência
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Transfira <strong>{formatKz(enrollment.amount)}</strong> para a conta abaixo usando a referência
              <strong className="font-mono"> {enrollment.reference}</strong>. O estado atualiza para “Confirmado” após validação.
            </p>
            <dl className="mt-4 divide-y divide-border rounded-xl border border-border">
              {[
                { label: "Banco", value: course.bank.bankName },
                { label: "Titular", value: course.bank.accountHolder },
                { label: "IBAN", value: course.bank.iban, mono: true },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">{r.label}</dt>
                    <dd className={`truncate font-semibold ${r.mono ? "font-mono" : ""}`}>{r.value}</dd>
                  </div>
                  <button onClick={() => copy(r.value, r.label)} aria-label={`Copiar ${r.label}`}
                    className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </dl>
            <Button variant="brand" className="mt-6 w-full" onClick={simulatePayment} disabled={confirming}>
              {confirming ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> A validar pagamento...</> : "Simular confirmação de pagamento (demo)"}
            </Button>
          </Card>
        )}

        {confirmed && (
          <Card className="flex flex-col items-center gap-3 p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <p className="font-display text-lg font-bold">Inscrição confirmada!</p>
            <p className="text-sm text-muted-foreground">Já tem lugar garantido no curso. Bons estudos!</p>
            <Button asChild variant="brand" className="mt-2">
              <Link to="/courses/$courseId" params={{ courseId: course.id }}>Ir para o curso <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </Card>
        )}

        <div className="flex justify-center gap-4 text-sm">
          <Link to="/courses/" className="font-medium text-primary">← Ver cursos</Link>
          <Link to="/dashboard" className="font-medium text-primary">Ir para o painel</Link>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
