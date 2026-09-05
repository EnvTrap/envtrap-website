import type { Metadata } from "next";
import { Roboto, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "./components/SmoothScroll";
import "./globals.css";

import "lenis/dist/lenis.css";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "envtrap | Runtime Security Agent for Node.js",
  description: "Block secret exfiltration from your Node.js processes in real-time. Zero-instrumentation runtime protection monitoring network egress, subprocesses, DNS tunneling, and console output.",
  keywords: ["nodejs security", "runtime protection", "secret exfiltration", "supply chain attacks", "npm security", "sandboxing"],
  authors: [{ name: "envtrap team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${jetbrainsMono.variable} h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-zinc-800 selection:text-white">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
