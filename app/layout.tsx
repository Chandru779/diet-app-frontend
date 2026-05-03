import type { Metadata } from "next";
import { Nunito, Sansita } from "next/font/google";
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
  title: "Protein Bar",
  description: "Track meals, explore macros, eat with clarity.",
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
