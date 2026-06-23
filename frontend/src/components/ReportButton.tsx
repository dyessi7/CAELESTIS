"use client";

import { useState } from "react";
import { generarReporte, type Deteccion } from "@/lib/api";

type Props = {
  detecciones: Deteccion[];
};

export default function ReportButton({ detecciones }: Props) {
  const [reporte, setReporte] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const solicitarReporte = async () => {
    setCargando(true);
    setError(null);

    try {
      const datos = detecciones.map((d) => ({
        clase: d.clase,
        confianza: d.confianza,
      }));
      const resultado = await generarReporte(datos);
      setReporte(resultado.reporte);
    } catch (err) {
      setError("No se pudo generar el reporte.");
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="space-y-6">
      {!reporte && (
        <button
          onClick={solicitarReporte}
          disabled={cargando || detecciones.length === 0}
          className="border border-[var(--color-accent)] px-8 py-3 text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cargando ? "Generando reporte..." : "Generar reporte"}
        </button>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {reporte && (
        <div className="border border-[var(--color-border)] p-8 bg-[var(--color-bg-soft)]">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">
            Reporte del agente
          </p>
          <div className="text-[var(--color-fg-muted)] leading-relaxed whitespace-pre-line">
            {reporte}
          </div>
          <button
            onClick={() => setReporte(null)}
            className="mt-8 text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] hover:text-[var(--color-accent)] transition-colors duration-300"
          >
            ← Cerrar reporte
          </button>
        </div>
      )}
    </div>
  );
}