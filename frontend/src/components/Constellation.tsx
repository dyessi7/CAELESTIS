type ConstellationProps = {
  className?: string;
  variant?: "small" | "medium";
};

export default function Constellation({
  className = "",
  variant = "small",
}: ConstellationProps) {
  if (variant === "medium") {
    return (
      <svg
        className={className}
        width="120"
        height="80"
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="10" y1="20" x2="40" y2="35" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
        <line x1="40" y1="35" x2="70" y2="20" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
        <line x1="70" y1="20" x2="100" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
        <line x1="40" y1="35" x2="55" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
        <circle cx="10" cy="20" r="1.5" fill="currentColor" />
        <circle cx="40" cy="35" r="2" fill="currentColor" />
        <circle cx="70" cy="20" r="1.5" fill="currentColor" />
        <circle cx="100" cy="40" r="1.5" fill="currentColor" />
        <circle cx="55" cy="60" r="1.5" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      width="60"
      height="40"
      viewBox="0 0 60 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="5" y1="10" x2="25" y2="20" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="25" y1="20" x2="50" y2="15" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="25" y1="20" x2="35" y2="35" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <circle cx="5" cy="10" r="1" fill="currentColor" />
      <circle cx="25" cy="20" r="1.5" fill="currentColor" />
      <circle cx="50" cy="15" r="1" fill="currentColor" />
      <circle cx="35" cy="35" r="1" fill="currentColor" />
    </svg>
  );
}