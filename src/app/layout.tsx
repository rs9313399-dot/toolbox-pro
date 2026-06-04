import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import JsonLdSchema from "@/components/JsonLdSchema";

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
  title: "ToolBox Pro - 15+ Free Online Tools for Everyone | No Signup Required",
  description:
    "Access 15+ free online tools: password generator, word counter, image compressor, YouTube thumbnail downloader, Instagram reel downloader, image to PDF, PDF to image, QR code generator, URL shortener, text to speech, speech to text, image resizer, background remover, JSON formatter, Base64 encoder. Fast, private, no signup. 100% browser-based.",
  keywords: [
    "free online tools",
    "password generator",
    "word counter",
    "image compressor",
    "YouTube thumbnail downloader",
    "Instagram reel downloader",
    "image to PDF converter",
    "PDF to image converter",
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
