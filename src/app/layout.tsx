import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import JsonLdSchema from "@/components/JsonLdSchema";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ToolBox Pro - 27+ Free Online Tools | PDF, Image, Text & Developer Tools",
  description:
    "Access 27+ free online tools: PDF merge, split, compress, rotate, watermark, unlock, protect, page numbers, crop, rearrange, metadata editor, PDF to text, image to PDF, PDF to image, password generator, word counter, image compressor, QR code generator, JSON formatter, Base64 encoder and more. Fast, private, no signup. 100% browser-based.",
  keywords: [
    "free online tools",
    "PDF merge online",
    "PDF split online",
    "PDF compress",
    "PDF rotate",
    "PDF watermark",
    "PDF unlock",
    "PDF protect",
    "PDF page numbers",
    "PDF crop",
    "PDF rearrange",
    "PDF metadata editor",
    "PDF to text",
    "image to PDF converter",
    "PDF to image converter",
    "password generator",
    "word counter",
    "image compressor",
    "YouTube thumbnail downloader",
    "Instagram reel downloader",
    "QR code generator",
    "URL shortener",
    "text to speech",
    "speech to text",
    "image resizer",
    "background remover",
    "JSON formatter",
    "Base64 encoder decoder",
    "online tools no signup",
    "browser-based tools",
    "free tools website",
  ],
  authors: [{ name: "ToolBox Pro" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "ToolBox Pro - Free Online Tools for Everyone",
    description:
      "Powerful free tools that run in your browser. No signup, no uploads, 100% private. Password generator, word counter, image compressor & more.",
    siteName: "ToolBox Pro",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolBox Pro - Free Online Tools for Everyone",
    description:
      "Powerful free tools that run in your browser. No signup, no uploads, 100% private.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Tell Dark Reader extension to NOT modify this page — site is already dark */}
        <meta name="darkreader-lock" suppressHydrationWarning />
        {/* Google AdSense Verification - Replace ca-pub-XXXXXXXXXXXXXXXX with your real publisher ID */}
        <meta
          name="google-adsense-account"
          content="ca-pub-5839704910468933"
          suppressHydrationWarning
        />
        {/* Google AdSense Script - Replace ca-pub-XXXXXXXXXXXXXXXX with your real publisher ID */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5839704910468933"
          crossOrigin="anonymous"
          suppressHydrationWarning
        />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <JsonLdSchema />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
