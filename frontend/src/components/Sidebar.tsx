"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "inicio", label: "Inicio" },
  { id: "que-es", label: "Qué es" },
  { id: "problema", label: "Problema" },
  { id: "resultados", label: "Resultados" },
  { id: "antecedentes", label: "Antecedentes" },
  { id: "probar", label: "Probar" },
];

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    const observer = new IntersectionObserver( //mi vigilador de navegador muaja
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const activeIndex = sections.findIndex((s) => s.id === activeSection);

  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:block">
      <div className="relative flex">
        {/* Riel vertical degradado (azul → violeta → dorado) que da
            profundidad al indicador de progreso, sin alterar la posición
            ni el comportamiento del nav. */}
        <div
          className="absolute left-[3px] top-1 bottom-1 w-px opacity-40"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-blue), var(--color-purple), var(--color-accent))",
          }}
        />
        {/* Punto que sigue la sección activa a lo largo del riel. */}
        {activeIndex >= 0 && (
          <div
            className="absolute left-0 w-[7px] h-[7px] rounded-full -translate-x-1/2 glow-accent transition-all duration-500 ease-out"
            style={{
              top: `calc(${(activeIndex / (sections.length - 1)) * 100}% - 3px)`,
              backgroundColor: "var(--color-accent)",
            }}
          />
        )}

        <ul className="flex flex-col gap-6 pl-5">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="group flex items-center gap-3 text-sm font-medium tracking-wide transition-colors duration-300"
              >
                <span
                  className={`h-px transition-all duration-500 ${
                    activeSection === id
                      ? "w-10 bg-[var(--color-accent)]"
                      : "w-4 bg-[var(--color-fg-subtle)] group-hover:w-6 group-hover:bg-[var(--color-purple-soft)]"
                  }`}
                />
                <span
                  className={`transition-colors duration-300 ${
                    activeSection === id
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-fg-subtle)] group-hover:text-[var(--color-fg-muted)]"
                  }`}
                >
                  {label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}