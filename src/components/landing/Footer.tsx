import { Logo } from "@/components/Logo";
import { Link } from "@tanstack/react-router";

const cols = [
  {
    title: "Plataforma",
    links: [
      { label: "Cursos", to: "/courses/" },
      { label: "Certificação", to: "/certificate/$code", params: { code: "OV-2026-AX91KD" } },
      { label: "Para empresas", to: "/", hash: "empresas" },
      { label: "Preços", to: "/courses/" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Blog", to: "/" },
      { label: "Documentação", to: "/" },
      { label: "Comunidade", to: "/auth" },
      { label: "Suporte", href: "mailto:suporte@openvision.academy" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre", to: "/", hash: "top" },
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
                  {"href" in l ? (
                    <a href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      to={l.to as never}
                      params={("params" in l ? l.params : undefined) as never}
                      hash={"hash" in l ? l.hash : undefined}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  )}
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