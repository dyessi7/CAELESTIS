"use client";

import { useEffect, useState } from "react";
import {
  describirObjeto,
  type Deteccion,
  type DescripcionObjeto,
} from "@/lib/api";

type Props = {
  deteccion: Deteccion | null;
  onCerrar: () => void;
};

export default function DetectionPanel({ deteccion, onCerrar }: Props) {
  const [descripcion, setDescripcion] = useState<DescripcionObjeto | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!deteccion) {
      setDescripcion(null);
      return;
    }

    const cargarDescripcion = async () => {
      setCargando(true);
      setError(null);
      try {
        const resultado = await describirObjeto(
          deteccion.clase,
          deteccion.confianza
        );
        setDescripcion(resultado);
      } catch (err) {
        setError("No se pudo cargar la descripción.");
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDescripcion();
  }, [deteccion]);

  if (!deteccion) {
    return (
      <div className="border border-[var(--color-border)] p-6 h-full">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
          Detalles
        </p>
        <p className="text-sm text-[var(--color-fg-muted)] italic">
          Selecciona un objeto detectado en la imagen para ver su información.
        </p>
      </div>
    );
  }

  const colorCerteza = (nivel: string) => {
    switch (nivel) {
      case "alta":
        return "#4ade80";
      case "media":
        return "#c9a14a";
      case "baja":
        return "#f87171";
      default:
        return "#a3a3a3";
    }
  };

  return (
    <div className="border border-[var(--color-border)] p-6 h-full overflow-y-auto max-h-[700px]">
      {/* Header con botón cerrar */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-2">
            Objeto detectado
          </p>
          <h3 className="text-2xl font-serif italic">
            {deteccion.nombre}
          </h3>
        </div>
        <button
          onClick={onCerrar}
          className="text-[var(--color-fg-subtle)] hover:text-[var(--color-accent)] transition-colors duration-300 text-lg leading-none"
          aria-label="Cerrar panel"
        >
          ×
        </button>
      </div>

      {/* Indicador de confianza */}
      <div className="flex items-center gap-2 mb-6">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: colorCerteza(deteccion.nivel_certeza) }}
        />
        <span className="text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
          Confianza {deteccion.confianza_pct}
        </span>
        <span className="text-xs text-[var(--color-fg-subtle)]">
          · nivel {deteccion.nivel_certeza}
        </span>
      </div>

      {/* Contenido principal */}
      {cargando && (
        <p className="text-sm text-[var(--color-accent)] uppercase tracking-widest">
          Cargando información...
        </p>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {descripcion && (
        <div className="space-y-6">
          {descripcion.advertencia && (
            <p className="text-xs italic text-[var(--color-fg-subtle)] border-l-2 border-[var(--color-border)] pl-3">
              {descripcion.advertencia}
            </p>
          )}

          <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
            {descripcion.descripcion_larga}
          </p>

          {descripcion.caracteristicas && descripcion.caracteristicas.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-3">
                Características
              </p>
              <ul className="space-y-2">
                {descripcion.caracteristicas.map((c, i) => (
                  <li key={i} className="text-sm text-[var(--color-fg-muted)] flex gap-2">
                    <span className="text-[var(--color-accent)]">·</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {descripcion.ejemplos && descripcion.ejemplos.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-3">
                Ejemplos
              </p>
              <ul className="space-y-1">
                {descripcion.ejemplos.map((e, i) => (
                  <li key={i} className="text-sm text-[var(--color-fg-muted)] italic">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {descripcion.datos_curiosos && descripcion.datos_curiosos.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-3">
                Datos curiosos
              </p>
              <ul className="space-y-2">
                {descripcion.datos_curiosos.map((d, i) => (
                  <li key={i} className="text-sm text-[var(--color-fg-muted)] flex gap-2">
                    <span className="text-[var(--color-accent)]">·</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {descripcion.fuente && (
            <p className="text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)] pt-4 border-t border-[var(--color-border)]">
              Fuente · {descripcion.fuente}
            </p>
          )}
        </div>
      )}
    </div>
  );
}