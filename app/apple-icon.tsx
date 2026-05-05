import { ImageResponse } from "next/og";
import { brandColors } from "@/lib/constants/branding";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Same salad-bowl motif as app/icon.svg, rasterized at 180×180 for iOS home screen.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brandColors.background,
        }}
      >
        <div
          aria-hidden
          style={{
            position: "relative",
            width: 118,
            height: 118,
            display: "flex",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 10,
              top: 18,
              width: 5,
              height: 58,
              borderRadius: 4,
              background: "#a7f3d0",
              transform: "rotate(14deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 22,
              top: 14,
              width: 5,
              height: 64,
              borderRadius: 4,
              background: "#86efac",
              transform: "rotate(-8deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 12,
              display: "flex",
              gap: 3,
              transform: "rotate(-8deg)",
            }}
          >
            <div
              style={{
                width: 3,
                height: 14,
                borderRadius: 2,
                background: "#86efac",
              }}
            />
            <div
              style={{
                width: 3,
                height: 14,
                borderRadius: 2,
                background: "#86efac",
              }}
            />
            <div
              style={{
                width: 3,
                height: 14,
                borderRadius: 2,
                background: "#86efac",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 9,
              width: 100,
              height: 48,
              background: brandColors.primary,
              borderRadius: "10px 10px 52% 52% / 10px 10px 72% 72%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 28,
              left: 22,
              width: 52,
              height: 10,
              borderRadius: 8,
              background: "rgba(94,234,212,0.55)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 44,
              left: 12,
              width: 94,
              height: 38,
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 48,
              left: 18,
              width: 78,
              height: 28,
              borderRadius: "50%",
              background: "#4ade80",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 72,
              left: 28,
              width: 36,
              height: 18,
              borderRadius: "50% 50% 50% 50% / 100% 100% 0 0",
              background: "#ef4444",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 70,
              left: 68,
              width: 30,
              height: 15,
              borderRadius: "50% 50% 50% 50% / 100% 100% 0 0",
              background: "#ef4444",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 58,
              left: 44,
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#facc15",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 56,
              left: 72,
              width: 11,
              height: 11,
              borderRadius: 999,
              background: "#facc15",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 54,
              left: 26,
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#facc15",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 56,
              left: 58,
              width: 12,
              height: 12,
              borderRadius: 3,
              background: "#fff",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 54,
              left: 84,
              width: 11,
              height: 11,
              borderRadius: 2,
              background: "#f8fafc",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
