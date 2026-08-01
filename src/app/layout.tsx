import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luthfi — 自己紹介",
  description:
    "Jakarta → Tokyo. Interactive self-introduction by Luthfi (Rufi), software engineer & explorer.",
  openGraph: {
    title: "Luthfi — 自己紹介",
    description:
      "Jakarta → Tokyo. An interactive scrollytelling self-introduction.",
    type: "website",
    locale: "ja_JP",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luthfi — 自己紹介",
    description: "Jakarta → Tokyo. Interactive self-introduction.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${syne.variable} h-full antialiased`}>
      <body className="min-h-full bg-[var(--bg-primary)] text-[var(--ink)]">
        {children}
      </body>
    </html>
  );
}
