import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FoodStack Commerce",
  description: "A modular food commerce SaaS for Nigerian foodstuff businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-stone-50 text-zinc-950">{children}</body>
    </html>
  );
}
