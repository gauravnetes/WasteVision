"use client";

import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import ParticlesBackground from "@/components/ParticlesBackground";
import LoaderWrapper from "@/components/LoaderWrapper";
import { metadata } from "./metadata";
import { useAuth } from "@/hooks/useAuth";  // ⬅️ import your hook

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const customFont = localFont({
  src: [
    {
      path: "../fonts/Syncopate-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Syncopate-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-custom",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useAuth(); // ✅ runs everywhere (dashboard, profile, etc.)

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${customFont.variable} font-sans antialiased relative`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ParticlesBackground />
          <LoaderWrapper />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
