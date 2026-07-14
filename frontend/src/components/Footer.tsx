import Link from "next/link";
import Constellation from "@/components/Constellation";

const enlaces = [
  { id: "inicio", label: "Inicio" },
  { id: "que-es", label: "Qué es" },
  { id: "problema", label: "Problema" },
  { id: "resultados", label: "Resultados" },
  { id: "antecedentes", label: "Antecedentes" },
  { id: "probar", label: "Probar" },
];

const fuentes = [
  { label: "NASA", href: "https://science.nasa.gov" },
  { label: "COSMICA", href: "https://www.kaggle.com" },
  { label: "Roboflow", href: "https://roboflow.com" },
  { label: "Ultralytics", href: "https://ultralytics.com" },
];

export default function Footer() {
  return (
    <footer className="relative px-6 pt-20 pb-10 overflow-hidden">
      <div className="rule-cosmic" />

      <Constellation
        variant="medium"
        className="absolute -top-4 right-10 text-[var(--color-purple)] opacity-15 pointer-events-none"
      />

      <div className="max-w-4xl mx-auto pt-16 grid grid-cols-1 sm:grid-cols-3 gap-12">
        <div>
          <p className="font-serif italic text-2xl mb-3">Caelestis</p>
          <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed max-w-xs">
            Detección y descripción automatizada de objetos celestes mediante
            visión por computadora e IA.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] mb-4">
            Navegación
          </p>
          <ul className="space-y-2">
            {enlaces.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-accent)] transition-colors duration-300"
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/detector"
                className="text-sm text-[var(--color-purple-soft)] hover:text-[var(--color-accent)] transition-colors duration-300"
              >
                Probar el detector →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] mb-4">
            Fuentes
          </p>
          <ul className="space-y-2">
            {fuentes.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-blue-soft)] transition-colors duration-300"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-16 pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
        <p>© {new Date().getFullYear()} Caelestis · Yessica Gómez Salinas · UPAO</p>
        <a
          href="#inicio"
          className="hover:text-[var(--color-accent)] transition-colors duration-300"
        >
          Volver arriba ↑
        </a>
      </div>
    </footer>
  );
}
