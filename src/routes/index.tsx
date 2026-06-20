import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Audience } from "@/components/landing/Audience";
import { Enterprise } from "@/components/landing/Enterprise";
import { CTA } from "@/components/landing/CTA";
import { Newsletter } from "@/components/landing/Newsletter";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OpenVision Academy — Aprenda as tecnologias do futuro" },
      {
        name: "description",
        content:
          "Academia digital de IA, engenharia de software, cloud e cibersegurança. Para estudantes, instrutores e empresas. Formação com certificação verificável.",
      },
      { property: "og:title", content: "OpenVision Academy" },
      {
        property: "og:description",
        content:
          "Aprenda, ensine e certifique num ecossistema digital de classe mundial.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <Audience />
        <Enterprise />
        <CTA />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
