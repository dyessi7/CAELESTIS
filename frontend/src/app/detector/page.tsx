"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import DetectionCanvas from "@/components/DetectionCanvas";
import DetectionPanel from "@/components/DetectionPanel";
import ReportButton from "@/components/ReportButton";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import { type RespuestaDeteccion } from "@/lib/api";

export default function DetectorPage() {
  const [resultado, setResultado] = useState<RespuestaDeteccion | null>(null);
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);
  const [seleccionada, setSeleccionada] = useState<number | null>(null);
  const [mostrarTodas, setMostrarTodas] = useState(true);

  const manejarResultado = (data: RespuestaDeteccion, url: string) => {
    setResultado(data);
    setImagenUrl(url);
    setSeleccionada(null);
  };

  const reiniciar = () => {
    setResultado(null);
    setImagenUrl(null);
    setSeleccionada(null);
  };

  const conteoVisible = resultado
    ? mostrarTodas
      ? resultado.total
      : resultado.detecciones.filter(
          (d) => d.nivel_certeza === "alta" || d.nivel_certeza === "media"
        ).length
    : 0;

  return (
    <main className="min-h-screen px-6 py-12 relative overflow-hidden">
      <Starfield count={35} seed={99} />

      <header className="max-w-7xl mx-auto flex items-center justify-between mb-16 relative">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-accent)] transition-colors duration-300"
        >
          ← Volver
        </Link>
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
          Caelestis · Detector
        </div>
      </header>

      <div className="max-w-7xl mx-auto mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
          Herramienta de análisis
        </p>
        <h1 className="text-5xl md:text-6xl font-serif italic">
          Sube una imagen del cosmos.
        </h1>
        <p className="mt-6 text-lg text-[var(--color-fg-muted)] max-w-2xl">
          El sistema detectará los objetos celestes presentes y te dirá qué son.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {!resultado && <ImageUploader onResultado={manejarResultado} />}

        {resultado && imagenUrl && (
          <div className="space-y-8">
            {/* Grid: imagen a la izquierda, panel a la derecha */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 border border-[var(--color-border)] p-4 flex justify-center bg-[var(--color-bg-soft)]">
                <DetectionCanvas
                  imagenUrl={imagenUrl}
                  detecciones={resultado.detecciones}
                  imagenAncho={resultado.imagen_ancho}
                  imagenAlto={resultado.imagen_alto}
                  deteccionSeleccionada={seleccionada}
                  onSeleccionar={setSeleccionada}
                  mostrarTodas={mostrarTodas}
                />
              </div>

              <div className="lg:col-span-1">
                <DetectionPanel
                  deteccion={
                    seleccionada !== null
                      ? resultado.detecciones[seleccionada]
                      : null
                  }
                  onCerrar={() => setSeleccionada(null)}
                />
              </div>
            </div>

            {/* Resumen y acciones */}
            <div className="border border-[var(--color-border)] p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
                  Detecciones encontradas: {conteoVisible}
                  {!mostrarTodas && resultado.total !== conteoVisible && (
                    <span className="text-[var(--color-fg-subtle)] normal-case tracking-normal">
                      {" "}
                      (de {resultado.total} totales)
                    </span>
                  )}
                </p>

                <button
                  onClick={() => setMostrarTodas((v) => !v)}
                  title={
                    mostrarTodas
                      ? "Mostrar solo detecciones confiables (media/alta)"
                      : "Mostrar todas las detecciones, incluidas las de baja confianza"
                  }
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)] hover:text-[var(--color-accent)] transition-colors duration-300 shrink-0"
                >
                  {mostrarTodas ? (
                    <Eye size={14} strokeWidth={1.5} />
                  ) : (
                    <EyeOff size={14} strokeWidth={1.5} />
                  )}
                  {mostrarTodas ? "Mostrando todas" : "Solo confiables"}
                </button>
              </div>
              <p className="text-sm text-[var(--color-fg-muted)] italic mb-4">
                Haz click en cualquier objeto resaltado en la imagen para ver
                sus detalles, o genera un reporte completo.
              </p>
            </div>

            <ReportButton detecciones={resultado.detecciones} />

            <button
              onClick={reiniciar}
              className="border border-[var(--color-accent)] px-6 py-3 text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-all duration-300"
            >
              Probar otra imagen
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}