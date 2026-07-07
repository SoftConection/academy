import { Logo } from "@/components/Logo";

const cols = [
  {
    title: "Plataforma",
    links: [
      { label: "Cursos", href: "/courses/" },
      { label: "Certificação", href: "/certificate/OV-2026-AX91KD" },
      { label: "Para empresas", href: "/#empresas" },
      { label: "Preços", href: "/courses/" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Blog", href: "/" },
      { label: "Documentação", href: "/" },
      { label: "Comunidade", href: "/auth" },
      { label: "Suporte", href: "mailto:suporte@openvision.academy" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre", href: "/#top" },
      { label: "Carreiras", href: "mailto:rh@openvision.academy" },
      { label: "Parcerias", href: "mailto:parcerias@openvision.academy" },
      { label: "Contacto", href: "mailto:equipa@openvision.academy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            A academia digital que democratiza a educação e a formação profissional.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="font-display text-sm font-bold">{c.title}</h4>
            <ul className="mt-4 space-y-2">
              {c.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} OpenVision Academy. Todos os direitos reservados.
      </div>
    </footer>
  );
}