import { ImageResponse } from "next/og";
import { brandColors } from "@/lib/constants/branding";

export function generatePwaIcon(size: number) {
  const fontSize = Math.round(size * 0.55);
  const borderRadius = size >= 96 ? Math.round(size * 0.2) : 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brandColors.primary,
          borderRadius,
        }}
      >
        <span
          style={{
            fontSize,
            fontWeight: 800,
            color: brandColors.primaryForeground,
            fontFamily: "sans-serif",
          }}
        >
          D
        </span>
      </div>
    ),
    { width: size, height: size },
  );
}
