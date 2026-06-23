"use client";

import { useState } from "react";
import { detectarImagen, type RespuestaDeteccion } from "@/lib/api";

type Props = {
  onResultado: (resultado: RespuestaDeteccion, urlImagen: string) => void;
};

const EJEMPLOS = [
  {
    archivo: "comet-3i-atlas.jpg",
    titulo: "3I/ATLAS",
    subtitulo: "Cometa interestelar",
    fuente: "Hubble Space Telescope · 2025",
    descripcion: "Tercer objeto interestelar conocido en cruzar nuestro sistema solar. Capturado mientras viajaba a 365 millones de km de la Tierra.",
  },
  {
    archivo: "galaxy-am-0644-741.webp",
    titulo: "AM 0644-741",
    subtitulo: "Galaxia anular",
    fuente: "Hubble Space Telescope",
    descripcion: "A 300 millones de años luz en la constelación Volans. Su anillo de estrellas jóvenes nació de una colisión galáctica.",
  },
  {
    archivo: "galaxy-messier-51.jpg",
    titulo: "Messier 51",
    subtitulo: "Galaxia del Remolino",
    fuente: "Hubble Space Telescope",
    descripcion: "Galaxia espiral de gran diseño interactuando con su compañera NGC 5195, en la constelación Canes Venatici.",
  },
  {
    archivo: "helix-nebula.webp",
    titulo: "Helix Nebula",
    subtitulo: "Nebulosa de la Hélice",
    fuente: "Hubble Space Telescope",
    descripcion: "Nebulosa planetaria a 650 años luz. Formada por el material expulsado de una estrella moribunda, hoy una enana blanca.",
  },
  {
    archivo: "ngc-6440.webp",
    titulo: "NGC 6440",
    subtitulo: "Cúmulo globular",
    fuente: "Hubble Space Telescope",
    descripcion: "Cúmulo globular a 28,000 años luz en Sagitario. Cientos de miles de estrellas brillan en una esfera densa y antigua.",
  },
];

export default function ImageUploader({ onResultado }: Props) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const archivoABase64 = (archivo: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(archivo);
    });
  };

  const procesarArchivo = async (archivo: File) => {
    setError(null);
    setCargando(true);

    try {
      const urlImagen = await archivoABase64(archivo);
      const resultado = await detectarImagen(archivo);
      onResultado(resultado, urlImagen);
    } catch (err) {
      setError("No se pudo procesar la imagen. Verifica que el backend esté corriendo.");
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const manejarCambioInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) {
      procesarArchivo(archivo);
    }
  };

  const procesarEjemplo = async (nombreArchivo: string) => {
    setError(null);
    setCargando(true);

    try {
      const respuesta = await fetch(`/ejemplos/${nombreArchivo}`);
      const blob = await respuesta.blob();
      const archivo = new File([blob], nombreArchivo, { type: blob.type });
      await procesarArchivo(archivo);
    } catch (err) {
      setError("No se pudo cargar la imagen de ejemplo.");
      console.error(err);
      setCargando(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Sección de ejemplos */}
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">
          Explora imágenes del cosmos
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {EJEMPLOS.map((ej) => (
            <button
              key={ej.archivo}
              onClick={() => procesarEjemplo(ej.archivo)}
              disabled={cargando}
              className="group text-left border border-[var(--color-border)] overflow-hidden
                         hover:border-[var(--color-accent)] transition-all duration-500
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[var(--color-bg-soft)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/ejemplos/${ej.archivo}`}
                  alt={ej.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-serif italic text-[var(--color-fg)]">
                  {ej.titulo}
                </p>
                <p className="text-xs text-[var(--color-fg-muted)] mt-1">
                  {ej.subtitulo}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)] mt-3">
                  {ej.fuente}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Separador */}
      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-[var(--color-border)]" />
        <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          o sube tu propia imagen
        </span>
        <span className="h-px flex-1 bg-[var(--color-border)]" />
      </div>

      {/* Uploader manual */}
      <div className="border-2 border-dashed border-[var(--color-border)] p-12 text-center">
        <input
          type="file"
          accept="image/*"
          onChange={manejarCambioInput}
          disabled={cargando}
          className="block w-full text-sm text-[var(--color-fg-muted)]
                     file:mr-4 file:py-2 file:px-6
                     file:border file:border-[var(--color-accent)]
                     file:text-xs file:uppercase file:tracking-widest
                     file:bg-transparent file:text-[var(--color-accent)]
                     file:cursor-pointer hover:file:bg-[var(--color-accent)]
                     hover:file:text-[var(--color-bg)]
                     file:transition-all file:duration-300"
        />
      </div>

      {cargando && (
        <p className="text-center text-sm text-[var(--color-accent)] uppercase tracking-widest">
          Analizando imagen...
        </p>
      )}

      {error && (
        <p className="text-center text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}