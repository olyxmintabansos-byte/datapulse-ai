'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { useState, useEffect } from "react";
import "./globals.css";
import { CommandPalette } from "@/components/CommandPalette";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <title>DataPulse AI - Enterprise E-Commerce Analytics</title>
        <meta name="description" content="Live sandbox SaaS dashboard untuk analitik e-commerce berbasis AI." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <ThemeProvider>
          {children}
          <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
        </ThemeProvider>
      </body>
    </html>
  );
}
