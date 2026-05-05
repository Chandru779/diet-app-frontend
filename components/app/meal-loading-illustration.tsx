/**
 * Tiny inline loader (~450 bytes): bowl + fruit dots + steam.
 * No external assets; uses currentColor for theme fit.
 */
export function MealLoadingIllustration({
  className,
  label = "Loading",
}: {
  className?: string;
  /** Screen reader label when this is the only loading indicator */
  label?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 56 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
    >
      {/* bowl */}
      <path
        d="M10 26c0 9.4 7.6 17 17 17s17-7.6 17-17V24H10v2Z"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M8 24h40"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      {/* fruit / toppings */}
      <circle cx="22" cy="22" r="3.2" fill="currentColor" fillOpacity="0.18" />
      <circle cx="28" cy="19" r="2.8" fill="currentColor" fillOpacity="0.26" />
      <circle cx="34" cy="22" r="3.2" fill="currentColor" fillOpacity="0.18" />
      <circle cx="26" cy="25" r="2.2" fill="currentColor" fillOpacity="0.14" />
      {/* steam */}
      <path
        d="M25 10c1.2-1.8 1-3.6-.2-5M30 11c1-1.6.8-3.2-.5-4.5M34 10c.9-1.4.7-2.8-.3-4"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
