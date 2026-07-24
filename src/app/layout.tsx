import "@/themes/globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { RootProviders } from "@/providers/root-providers";
import { siteConfig } from "@/config/site-config";

const geistSans = localFont({
  src: [
    {
      path: "../themes/fonts/Geist/Geist-VariableFont_wght.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../themes/fonts/Geist/Geist-Italic-VariableFont_wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = localFont({
  src: [
    {
      path: "../themes/fonts/JetBrainsMono/jetbrains-mono-latin-100-normal.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../themes/fonts/JetBrainsMono/jetbrains-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../themes/fonts/JetBrainsMono/jetbrains-mono-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
