/**
 * Meal cover URLs come from the API as absolute HTTPS links (resolved on the backend).
 * Remote images use `unoptimized` so Next.js does not proxy them (avoids SSRF / private-IP blocks).
 */
export function shouldUnoptimizeMealImage(src: string): boolean {
  return (
    src.startsWith("data:") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  );
}
