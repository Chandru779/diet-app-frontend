/**
 * Empty-feed illustration (~550 bytes): empty bowl + gentle spark.
 * Matches MealLoadingIllustration language (bowl, currentColor).
 */
export function MealEmptyIllustration({
  className,
  label = "No meals yet",
}: {
  className?: string;
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
      <path
        d="M10 26c0 9.4 7.6 17 17 17s17-7.6 17-17V24H10v2Z"
        fill="currentColor"
        fillOpacity="0.04"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeDasharray="3 4"
      />
      <path
        d="M8 24h40"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M22 18h12"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="40" cy="14" r="2" fill="currentColor" fillOpacity="0.12" />
      <circle cx="44" cy="18" r="1.2" fill="currentColor" fillOpacity="0.1" />
    </svg>
  );
}
