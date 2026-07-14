type StarfieldProps = {
  className?: string;
  count?: number;
  seed?: number;
};

const COLORS = [
  "var(--color-fg)",
  "var(--color-accent-soft)",
  "var(--color-purple-soft)",
  "var(--color-blue-soft)",
];

/** PRNG determinista: mismo resultado en servidor y cliente (evita hydration mismatch). */
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateStars(count: number, seed: number) {
  const rand = seededRandom(seed);
  return Array.from({ length: count }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    r: 0.5 + rand() * 1,
    color: COLORS[Math.floor(rand() * COLORS.length)],
    delay: rand() * 5,
    duration: 2.5 + rand() * 3.5,
  }));
}

/**
 * Campo de estrellas titilantes, confinado al contenedor padre
 * (debe ser position: relative). Puramente decorativo.
 */
export default function Starfield({ className = "", count = 40, seed = 1 }: StarfieldProps) {
  const stars = generateStars(count, seed);

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={`${s.x}%`}
          cy={`${s.y}%`}
          r={s.r}
          fill={s.color}
          className="star"
          style={{
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </svg>
  );
}
