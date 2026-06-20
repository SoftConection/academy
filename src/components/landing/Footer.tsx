import { Logo } from "@/components/Logo";

const cols = [
  { title: "Plataforma", links: ["Cursos", "Certificação", "Para empresas", "Preços"] },
  { title: "Recursos", links: ["Blog", "Documentação", "Comunidade", "Suporte"] },
  { title: "Empresa", links: ["Sobre", "Carreiras", "Parcerias", "Contacto"] },
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
                <li key={l}>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l}
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