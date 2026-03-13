import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hall of Shame 💀 — Layoff Tracker",
  description: "They said the economy was fine. Real-time meme-grade layoff tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
        {children}
      </body>
    </html>
  );
}
