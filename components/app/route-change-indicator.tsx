"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function RouteChangeIndicatorInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (!anchor || anchor.getAttribute("target") === "_blank") return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:")) {
        return;
      }

      try {
        const url = new URL(rawHref, window.location.origin);
        if (url.origin !== window.location.origin) return;

        const next = `${url.pathname}${url.search}`;
        const current = `${pathname}${searchParams.size ? `?${searchParams}` : ""}`;
        if (next !== current) {
          setPending(true);
        }
      } catch {
        /* ignore malformed href */
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname, searchParams]);

  if (!pending) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden bg-primary/10"
      role="progressbar"
      aria-label="Loading page"
    >
      <div className="route-progress-bar h-full w-2/5 bg-primary" />
    </div>
  );
}

export function RouteChangeIndicator() {
  return (
    <Suspense fallback={null}>
      <RouteChangeIndicatorInner />
    </Suspense>
  );
}
