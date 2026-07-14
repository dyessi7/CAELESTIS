"use client";

import { type Deteccion } from "@/lib/api";

type Props = {
  imagenUrl: string;
  detecciones: Deteccion[];
  imagenAncho: number;
  imagenAlto: number;
  deteccionSeleccionada: number | null;
  onSeleccionar: (indice: number | null) => void;
  mostrarTodas: boolean;
};

export default function DetectionCanvas({
  imagenUrl,
  detecciones,
  imagenAncho,
  imagenAlto,
  deteccionSeleccionada,
  onSeleccionar,
  mostrarTodas,
}: Props) {
  // Con mostrarTodas=true se incluyen también las de baja confianza (rojo):
  // el color ya comunica la incertidumbre, y descartarlas del todo ocultaría
  // justamente los casos límite donde podría haber un hallazgo real.
  // Con mostrarTodas=false solo quedan las de media/alta certeza.
  const deteccionesVisibles = detecciones
    .map((d, indiceOriginal) => ({ ...d, indiceOriginal }))
    .filter(
      (d) =>
        mostrarTodas || d.nivel_certeza === "alta" || d.nivel_certeza === "media"
    );

  const colorPorCerteza = (nivel: string) => {
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
    <div className="relative inline-block max-w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagenUrl}
        alt="Imagen analizada"
        className="block max-w-full h-auto max-h-[700px] object-contain"
      />

      {/* SVG con los bordes — clickeables */}
      <svg
        viewBox={`0 0 ${imagenAncho} ${imagenAlto}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute top-0 left-0 w-full h-full"
      >
        {deteccionesVisibles.map((det) => {
          const [x1, y1, x2, y2] = det.bbox;
          const color = colorPorCerteza(det.nivel_certeza);
          const estaSeleccionada = deteccionSeleccionada === det.indiceOriginal;
          const haySeleccionada = deteccionSeleccionada !== null;
          const opacidad = !haySeleccionada || estaSeleccionada ? 1 : 0.25;

          return (
            <rect
              key={det.indiceOriginal}
              x={x1}
              y={y1}
              width={x2 - x1}
              height={y2 - y1}
              fill="transparent"
              stroke={color}
              strokeWidth={estaSeleccionada ? "2.5" : "1.5"}
              vectorEffect="non-scaling-stroke"
              opacity={opacidad}
              style={{ cursor: "pointer", transition: "opacity 0.3s, stroke-width 0.2s" }}
              onClick={() =>
                onSeleccionar(
                  estaSeleccionada ? null : det.indiceOriginal
                )
              }
            />
          );
        })}
      </svg>

      {/* Etiquetas HTML — tamaño fijo */}
      {deteccionesVisibles.map((det) => {
        const [x1, y1] = det.bbox;
        const color = colorPorCerteza(det.nivel_certeza);
        const leftPct = (x1 / imagenAncho) * 100;
        const topPct = (y1 / imagenAlto) * 100;
        const estaSeleccionada = deteccionSeleccionada === det.indiceOriginal;
        const haySeleccionada = deteccionSeleccionada !== null;
        const opacidad = !haySeleccionada || estaSeleccionada ? 1 : 0.25;

        return (
          <div
            key={`label-${det.indiceOriginal}`}
            className="absolute pointer-events-none"
            style={{
              left: `${leftPct}%`,
              top: `${topPct}%`,
              transform: "translateY(-100%)",
              opacity: opacidad,
              transition: "opacity 0.3s",
            }}
          >
            <span
              className="inline-block px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap"
              style={{
                backgroundColor: "rgba(5, 5, 7, 0.85)",
                color: color,
              }}
            >
              {det.nombre} · {det.confianza_pct}
            </span>
          </div>
        );
      })}
    </div>
  );
}