import type { Metadata, Viewport } from "next";
import { Nunito, Sansita } from "next/font/google";
import { BRAND, brandColors } from "@/lib/constants/branding";
import "./globals.css";

/**
 * Body: Nunito — rounded, friendly, excellent for health/nutrition UI.
 * Heading: Sansita — bold italic display, gives strong visual hierarchy.
 */
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const sansita = Sansita({
  subsets: ["latin"],
  variable: "--font-sansita",
  display: "swap",
  weight: ["400", "700", "800"],
});

export const metadata: Metadata = {
  title: BRAND.name,
  description: BRAND.tagline,
  applicationName: BRAND.name,
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: BRAND.name,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: brandColors.primary,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${nunito.variable} ${sansita.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
