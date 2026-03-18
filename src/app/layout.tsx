import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orkestra",
  description:
    "Explora campos harmônicos, gera progressões de acordes e visualiza posições em guitarra, ukulele e teclado.",
  keywords: [
    "teoria musical",
    "campo harmônico",
    "progressão de acordes",
    "guitarra",
    "ukulele",
    "teclado",
    "modos",
    "música",
  ],
  authors: [{ name: "Leo Nycz", url: "https://portfolio-leo-nycz.vercel.app" }],
  openGraph: {
    title: "Orkestra",
    description:
      "Explora campos harmônicos e gera progressões de acordes com IA.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
