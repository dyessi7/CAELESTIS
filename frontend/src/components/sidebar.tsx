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
    const observer = new IntersectionObserver(
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

  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:block">
      <ul className="flex flex-col gap-6">
        {sections.map(({ id, label }) => (
          <li key={id}>
            
              <a href={`#${id}`}
              className="group flex items-center gap-3 text-xs uppercase tracking-widest transition-colors duration-300"
            >
              <span
                className={`h-px transition-all duration-500 ${
                  activeSection === id
                    ? "w-10 bg-[var(--color-accent)]"
                    : "w-4 bg-[var(--color-fg-subtle)] group-hover:w-6 group-hover:bg-[var(--color-fg-muted)]"
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
    </nav>
  );
}