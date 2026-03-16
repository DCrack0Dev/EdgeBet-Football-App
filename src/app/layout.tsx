import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "EdgeBet Football | Daily Betting Insights & Premium Slips",
    template: "%s | EdgeBet Football"
  },
  description: "Get the professional edge with daily high-confidence betting slips, deep match analysis, and transparent performance tracking. Join the elite football betting community.",
  keywords: ["football betting", "soccer picks", "betting slips", "match analysis", "betting insights", "premium picks", "betting strategy"],
  authors: [{ name: "EdgeBet Team" }],
  creator: "EdgeBet Football",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://edgebetfootball.com",
    title: "EdgeBet Football | Daily Betting Insights & Premium Slips",
    description: "Professional-grade football betting insights and daily slips. Data-driven picks for serious bettors.",
    siteName: "EdgeBet Football",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EdgeBet Football Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EdgeBet Football | Daily Betting Insights",
    description: "High-confidence football betting slips and expert analysis delivered daily.",
    images: ["/og-image.png"],
    creator: "@edgebetfootball",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
