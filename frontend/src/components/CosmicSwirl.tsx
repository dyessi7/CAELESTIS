type CosmicSwirlProps = {
  className?: string;
};

const RINGS = [
  { r: 340, color: "var(--color-blue)", duration: "140s", dash: undefined, width: 0.75, opacity: 0.22, reverse: false },
  { r: 260, color: "var(--color-purple)", duration: "100s", dash: "3 7", width: 1.25, opacity: 0.4, reverse: true },
  { r: 180, color: "var(--color-accent)", duration: "80s", dash: undefined, width: 0.75, opacity: 0.3, reverse: false },
  { r: 100, color: "var(--color-purple-soft)", duration: "55s", dash: "2 5", width: 1.25, opacity: 0.45, reverse: true },
];

/**
 * Anillos concéntricos que giran lentamente a distinta velocidad/dirección,
 * inspirados en el remolino cósmico del cielo de referencia, pero resueltos
 * en SVG puro (sin assets) y en la paleta negro/azul/violeta/dorado.
 */
export default function CosmicSwirl({ className = "" }: CosmicSwirlProps) {
  return (
    <svg
      className={`pointer-events-none ${className}`}
      viewBox="-360 -360 720 720"
      aria-hidden="true"
    >
      {RINGS.map((ring, i) => (
        <circle
          key={i}
          r={ring.r}
          fill="none"
          stroke={ring.color}
          strokeWidth={ring.width}
          strokeDasharray={ring.dash}
          opacity={ring.opacity}
          className="cosmic-ring"
          style={{
            animationDuration: ring.duration,
            animationDirection: ring.reverse ? "reverse" : "normal",
          }}
        />
      ))}
    </svg>
  );
}
