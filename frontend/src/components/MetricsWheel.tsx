"use client";

import { useState } from "react";

type Metric = {
  label: string;
  value: number;
  color: string;
};

const METRICS: Metric[] = [
  { label: "mAP50", value: 74.6, color: "var(--color-accent)" },
  { label: "Precisión", value: 79.7, color: "var(--color-purple)" },
  { label: "Recall", value: 67.8, color: "var(--color-blue)" },
  { label: "mAP50-95", value: 43.8, color: "var(--color-fg)" },
];

const RADII = [58, 82, 106, 130];
const CENTER = 200;
const LABEL_RADIUS = 192;
const DOTS_RADIUS = 168;
const OUTER_RADIUS = 188;

/**
 * Punto sobre un círculo de radio r, con 0° arriba (12 en punto) avanzando en
 * sentido horario. Redondeado a 3 decimales: sin/cos pueden diferir en el
 * último bit entre el motor JS del servidor y el del navegador, lo que sin
 * este redondeo produce un mismatch de hidratación en cada carga.
 */
function pointAt(r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: Math.round(r * Math.sin(rad) * 1000) / 1000,
    y: Math.round(-r * Math.cos(rad) * 1000) / 1000,
  };
}

/** Estrella de 8 puntas para el núcleo, alternando radio externo/interno. */
function starPath(rOuter: number, rInner: number) {
  const points = Array.from({ length: 16 }, (_, i) => {
    const r = i % 2 === 0 ? rOuter : rInner;
    const p = pointAt(r, i * 22.5);
    return `${p.x},${p.y}`;
  });
  return `M ${points.join(" L ")} Z`;
}

/**
 * Rueda de métricas al estilo astrolabio: anillos ornamentales quietos y
 * girando lentamente (como el CosmicSwirl del inicio) enmarcan cuatro
 * órbitas de datos reales. Cada órbita traza un arco proporcional a su
 * valor desde las 12 en punto, con un planeta en la punta; al pasar el
 * cursor, su etiqueta sale despedida hacia afuera por el mismo ángulo.
 */
export default function MetricsWheel() {
  const [hovered, setHovered] = useState<number | null>(null);

  const dots = Array.from({ length: 12 }, (_, i) => pointAt(DOTS_RADIUS, i * 30));
  const ticks = Array.from({ length: 8 }, (_, i) => {
    const inner = pointAt(OUTER_RADIUS - 10, i * 45);
    const outer = pointAt(OUTER_RADIUS + 6, i * 45);
    return { inner, outer };
  });

  return (
    <div className="relative w-full max-w-[440px] aspect-square mx-auto">
      <svg
        viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}
        className="w-full h-full overflow-visible"
      >
        <g transform={`translate(${CENTER}, ${CENTER})`}>
          {/* === Marco ornamental (decorativo, sin datos) === */}
          <circle
            r={OUTER_RADIUS}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="1"
            opacity="0.6"
          />
          <circle
            r={OUTER_RADIUS - 26}
            fill="none"
            stroke="var(--color-fg-subtle)"
            strokeWidth="0.5"
            strokeDasharray="1 5"
            opacity="0.5"
          />

          {/* Anillo de doce marcas, gira lentamente como las órbitas del inicio */}
          <g
            className="cosmic-ring"
            style={{ animationDuration: "70s" }}
          >
            {dots.map((d, i) => (
              <circle
                key={i}
                cx={d.x}
                cy={d.y}
                r={i % 3 === 0 ? 2.2 : 1.2}
                fill="var(--color-purple-soft)"
                opacity={i % 3 === 0 ? 0.6 : 0.3}
              />
            ))}
          </g>

          {/* Ticks de compás, giran despacio en sentido contrario */}
          <g
            className="cosmic-ring"
            style={{ animationDuration: "100s", animationDirection: "reverse" }}
          >
            {ticks.map((t, i) => (
              <line
                key={i}
                x1={t.inner.x}
                y1={t.inner.y}
                x2={t.outer.x}
                y2={t.outer.y}
                stroke="var(--color-accent)"
                strokeWidth="1"
                opacity="0.35"
              />
            ))}
          </g>

          {/* === Órbitas de datos === */}
          {METRICS.map((metric, i) => {
            const r = RADII[i];
            const sweep = (metric.value / 100) * 360;
            const end = pointAt(r, sweep);
            const largeArc = sweep > 180 ? 1 : 0;
            const isHovered = hovered === i;

            const labelPoint = pointAt(LABEL_RADIUS, sweep);
            const lineStart = pointAt(r + 6, sweep);
            const onRight = labelPoint.x >= 0;
            const boxWidth = 118;

            return (
              <g key={metric.label}>
                <circle
                  r={r}
                  fill="none"
                  stroke="var(--color-border)"
                  strokeWidth="1"
                  opacity="0.5"
                />
                <path
                  d={`M 0 ${-r} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`}
                  fill="none"
                  stroke={metric.color}
                  strokeWidth={isHovered ? 3 : 2}
                  strokeLinecap="round"
                  opacity={isHovered ? 1 : 0.8}
                  className="transition-all duration-300"
                />
                <circle
                  r={r}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="16"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                />
                <circle
                  cx={end.x}
                  cy={end.y}
                  r={isHovered ? 6 : 4.5}
                  fill={metric.color}
                  className="transition-all duration-300"
                  style={
                    isHovered
                      ? { filter: `drop-shadow(0 0 6px ${metric.color})` }
                      : undefined
                  }
                />

                <line
                  x1={lineStart.x}
                  y1={lineStart.y}
                  x2={labelPoint.x}
                  y2={labelPoint.y}
                  stroke={metric.color}
                  strokeWidth="1"
                  opacity={isHovered ? 0.8 : 0}
                  className="transition-opacity duration-300 pointer-events-none"
                />
                <foreignObject
                  x={onRight ? labelPoint.x + 8 : labelPoint.x - boxWidth - 8}
                  y={labelPoint.y - 20}
                  width={boxWidth}
                  height="40"
                  className="pointer-events-none overflow-visible"
                >
                  <div
                    className="transition-all duration-300"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered
                        ? "translateX(0)"
                        : `translateX(${onRight ? "-6px" : "6px"})`,
                      textAlign: onRight ? "left" : "right",
                    }}
                  >
                    <p
                      className="text-[10px] uppercase tracking-[0.2em] leading-tight"
                      style={{ color: metric.color }}
                    >
                      {metric.label}
                    </p>
                    <p className="text-lg font-serif text-[var(--color-fg)] leading-tight">
                      {metric.value}%
                    </p>
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Núcleo: estrella de ocho puntas */}
          <circle r="26" fill="var(--color-bg-soft)" />
          <path
            d={starPath(20, 8)}
            fill="var(--color-accent)"
            opacity="0.25"
          />
          <path d={starPath(11, 4)} fill="var(--color-accent)" className="star" />
        </g>
      </svg>
    </div>
  );
}
