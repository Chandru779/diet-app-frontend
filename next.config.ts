import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Hide the built-in Next.js “N” dev indicator in the corner */
  devIndicators: false,
  images: {
    qualities: [70, 75, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
