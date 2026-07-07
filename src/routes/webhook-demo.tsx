import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Webhook, Send, CheckCircle2, XCircle, Loader2, Zap } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getEnrollment, setStatus, listEnrollments, makeReference } from "@/lib/enrollments";
import { formatKz } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/webhook-demo")({
  head: () => ({ meta: [{ title: "Simulador de webhook — OpenVision" }] }),
  component: WebhookDemo,
});

type Result = {
  ok: boolean;
  status: number;
  body: Record<string, unknown>;
};

function WebhookDemo() {
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [event] = useState("payment.succeeded");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const pending = listEnrollments().filter((e) => e.status === "pendente");

  function buildPayload() {
    return {
      id: makeReference("EVT"),
      type: event,
      created: new Date().toISOString(),
      data: {
        reference: reference.trim().toUpperCase(),
        amount: Number(amount) || 0,
        currency: "AOA",
        method: "bank_transfer",
      },
    };
  }

  // Demo: emulates a payment provider POSTing a webhook that we validate by reference.
  function send() {
    const ref = reference.trim().toUpperCase();
    if (!ref) return toast.error("Indique a referência bancária.");
    setSending(true);
    setResult(null);

    setTimeout(() => {
      const enrollment = getEnrollment(ref);
      let res: Result;

      if (!enrollment) {
        res = { ok: false, status: 404, body: { error: "reference_not_found", reference: ref } };
      } else if (enrollment.status === "confirmado") {
        res = { ok: true, status: 200, body: { status: "already_confirmed", reference: ref } };
      } else if (amount && Number(amount) !== enrollment.amount) {
        res = {
          ok: false,
          status: 422,
          body: { error: "amount_mismatch", expected: enrollment.amount, received: Number(amount) },
        };
      } else {
        setStatus(ref, "confirmado");
        res = {
          ok: true,
          status: 200,
          body: { status: "payment_confirmed", reference: ref, enrollmentId: enrollment.id, student: enrollment.name },
        };
      }

      setResult(res);
      setSending(false);
      if (res.ok && res.body.status === "payment_confirmed") toast.success("Webhook processado — pagamento confirmado!");
      else if (!res.ok) toast.error(`Webhook rejeitado (${res.status}).`);
    }, 1400);
  }

  function quickFill(ref: string, amt: number) {
    setReference(ref);
    setAmount(String(amt));
    setResult(null);
  }

  return (
    <AppShell title="Simulador de webhook de pagamento">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="flex items-center gap-2 font-display text-lg font-bold">
            <Webhook className="h-5 w-5 text-primary" /> Enviar evento de pagamento
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Simula um provedor de pagamento a chamar o webhook <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">POST /api/public/payments</code>.
            A inscrição é confirmada quando a <strong>referência</strong> corresponde.
          </p>

          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ref">Referência bancária</Label>
              <Input id="ref" value={reference} onChange={(e) => setReference(e.target.value)}
                placeholder="IA-FUND-XXXXX" className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amt">Valor recebido (opcional, valida o montante)</Label>
              <Input id="amt" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="45000" />
            </div>
            <div className="space-y-1.5">
              <Label>Evento</Label>
              <div><Badge variant="secondary" className="font-mono">{event}</Badge></div>
            </div>
            <Button variant="brand" className="w-full" onClick={send} disabled={sending}>
              {sending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> A enviar webhook...</> : <><Send className="mr-2 h-4 w-4" /> Enviar webhook</>}
            </Button>
          </div>

          {pending.length > 0 && (
            <div className="mt-6 border-t border-border pt-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Zap className="h-3.5 w-3.5" /> Inscrições pendentes (preenchimento rápido)
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {pending.slice(0, 6).map((e) => (
                  <button type="button" key={e.id} onClick={() => quickFill(e.reference, e.amount)}
                    className="rounded-lg border border-border px-2.5 py-1 font-mono text-xs hover:bg-accent">
                    {e.reference}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payload enviado</p>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-foreground p-4 text-xs text-background">
{JSON.stringify(buildPayload(), null, 2)}
            </pre>
          </Card>

          {result && (
            <Card className={`p-6 ${result.ok ? "border-primary/30" : "border-destructive/30"}`}>
              <div className="flex items-center gap-2">
                {result.ok ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <XCircle className="h-5 w-5 text-destructive" />}
                <p className="font-display font-bold">Resposta do webhook</p>
                <Badge variant={result.ok ? "default" : "secondary"} className={`ml-auto font-mono ${result.ok ? "bg-primary" : "bg-destructive text-destructive-foreground"}`}>
                  HTTP {result.status}
                </Badge>
              </div>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-secondary p-4 text-xs">
{JSON.stringify(result.body, null, 2)}
              </pre>
              {typeof result.body.expected === "number" && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Esperado: {formatKz(result.body.expected as number)} · Recebido: {formatKz(result.body.received as number)}
                </p>
              )}
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
