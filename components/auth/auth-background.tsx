import Image from "next/image";

/**
 * Full-bleed auth background:
 *   1. A single hero photo of many meals (public/auth-meals-bg.png)
 *   2. A black top-down gradient so the app bar / header content stays
 *      readable, fading to transparent so the image breathes below.
 */
export function AuthBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Hero meals photo */}
      <Image
        src="/auth-meals-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Black gradient at the top → transparent, so the header/logo
          remains legible while the rest of the image stays visible. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 25%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 100%)",
        }}
      />
    </div>
  );
}
