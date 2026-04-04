import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import React from "react";
import { Toaster } from 'sonner';
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
  title: "VidMetrics",
  description: "Identify crushing competitor content strategies in seconds with AI-driven quantitative analytics and strategic brand benchmarking.",
  keywords: ["YouTube Analytics", "Competitor Intelligence", "Content Strategy", "Video Marketing", "AI Analysis"],
  openGraph: {
    title: "VidMetrics",
    description: "Identify crushing competitor content strategies in seconds with AI-driven quantitative analytics.",
    type: "website",
    locale: "en_US",
    siteName: "VidMetrics",
  },
  twitter: {
    card: "summary_large_image",
    title: "VidMetrics",
    description: "Identify crushing content strategies with AI-driven analytics.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      style={{ colorScheme: 'light' }}
    >
      <body className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
        {children}
        <Toaster position="top-right" richColors theme="light" />
      </body>
    </html>
  );
}
