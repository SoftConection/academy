import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/card";
import { certificates } from "@/lib/mock-data";

export const Route = createFileRoute("/certificate/$code")({
  head: () => ({ meta: [{ title: "Verificação de certificado — OpenVision Academy" }] }),
  component: CertificatePage,
});

function CertificatePage() {
  const { code } = useParams({ from: "/certificate/$code" });
  const cert = certificates.find((c) => c.code === code) ?? certificates[0];

  return (
    <div className="min-h-screen bg-gradient-hero px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="flex justify-center"><Logo /></Link>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-primary">
          <ShieldCheck className="h-4 w-4" /> Certificado verificado
        </div>

        <Card className="mt-6 overflow-hidden border-2 border-primary/30">
          <div className="bg-gradient-brand p-8 text-center text-brand-foreground">
            <BadgeCheck className="mx-auto h-12 w-12" />
            <p className="mt-3 text-sm uppercase tracking-widest text-brand-foreground/80">Certificado de conclusão</p>
          </div>
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">Este certificado confirma que</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold">{cert.student}</h1>
            <p className="mt-2 text-sm text-muted-foreground">concluiu com êxito o curso</p>
            <h2 className="mt-2 font-display text-xl font-bold text-gradient-brand">{cert.course}</h2>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 text-left text-sm">
              <div><p className="text-muted-foreground">Instrutor</p><p className="font-semibold">{cert.instructor}</p></div>
              <div><p className="text-muted-foreground">Data de conclusão</p><p className="font-semibold">{cert.date}</p></div>
              <div><p className="text-muted-foreground">Código de verificação</p><p className="font-mono font-semibold">{cert.code}</p></div>
              <div className="flex items-end justify-end">
                <div className="grid grid-cols-5 gap-0.5" aria-hidden>
                  {Array.from({ length: 25 }).map((_, i) => (
                    <span key={i} className={(i * 7) % 3 === 0 ? "h-2.5 w-2.5 bg-foreground" : "h-2.5 w-2.5 bg-transparent"} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Verificação em openvision.academy/certificate/{cert.code} · Demonstração
        </p>
      </div>
    </div>
  );
}