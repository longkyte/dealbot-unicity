import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "DealBot - Autonomous P2P Negotiation & Settlement",
  description:
    "DealBot: Two autonomous economic agents negotiate deals and execute atomic swaps peer-to-peer on Unicity Testnet v2 using the Sphere SDK.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} dark`}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
