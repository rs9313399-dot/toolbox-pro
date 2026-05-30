'use client';

import { Users, Zap, Shield, Globe, Heart, Star } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (hash: string) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 mb-5">
            <Users className="h-7 w-7 text-[#8A2BE2]" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            About <span className="gradient-text">ToolBox Pro</span>
          </h1>
          <p className="text-[#AAAAAA] max-w-lg mx-auto text-base">
            Free, fast, and private online tools that run entirely in your browser.
          </p>
        </div>

        <div className="space-y-8">
          {/* Our Mission */}
          <section className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-[#00FFFF]" />
              <h2 className="text-xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-[#AAAAAA] leading-relaxed text-sm">
              ToolBox Pro was created with a simple mission: to provide powerful, free online tools that respect your privacy. We believe that everyone deserves access to professional-grade utilities without having to download software, create accounts, or worry about their data being collected. Every tool on our platform runs entirely in your browser using modern web technologies, ensuring that your files, text, and data never leave your device. Whether you need to generate a secure password, compress an image, format JSON data, or convert files between formats, ToolBox Pro has you covered.
            </p>
          </section>

          {/* What We Offer */}
          <section className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4">What We Offer</h2>
            <p className="text-[#AAAAAA] leading-relaxed text-sm mb-4">
              Our growing collection of 15+ free tools covers a wide range of everyday needs for developers, content creators, students, and professionals alike. Each tool is carefully designed with simplicity and performance in mind, featuring clean interfaces that get the job done without unnecessary complexity.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Shield, title: 'Privacy First', desc: 'All processing happens locally in your browser. Your data never touches our servers.' },
                { icon: Zap, title: 'Lightning Fast', desc: 'No server uploads or downloads. Instant results powered by client-side technology.' },
                { icon: Star, title: 'No Signup Required', desc: 'Use any tool instantly without creating an account or providing personal information.' },
                { icon: Globe, title: 'Works Everywhere', desc: 'All modern browsers supported. Desktop, tablet, and mobile friendly.' },
              ].map((item) => (
                <div key={item.title} className="bg-black/40 border border-[#1a1a1a] rounded-xl p-4">
                  <item.icon className="h-5 w-5 text-[#8A2BE2] mb-2" />
                  <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-[#888888] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Our Tools */}
          <section className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4">Our Tools</h2>
            <p className="text-[#AAAAAA] leading-relaxed text-sm mb-4">
              We offer a comprehensive suite of free tools organized into categories to help you find exactly what you need:
            </p>
            <div className="space-y-3">
              {[
                { category: 'Image & PDF', tools: 'Image Compressor, Image Resizer, Background Remover, Image to PDF, PDF to Image' },
                { category: 'Text & Speech', tools: 'Word Counter, Text to Speech, Speech to Text' },
                { category: 'Developer', tools: 'JSON Formatter, Base64 Encoder, QR Code Generator, URL Shortener' },
                { category: 'Security & Social', tools: 'Password Generator, YouTube Thumbnail Downloader, Instagram Reel Downloader' },
              ].map((item) => (
                <div key={item.category} className="bg-black/40 border border-[#1a1a1a] rounded-xl p-4">
                  <h3 className="text-sm font-bold text-[#00FFFF] mb-1">{item.category}</h3>
                  <p className="text-xs text-[#888888]">{item.tools}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-[#8A2BE2]/10 to-[#00FFFF]/5 border border-[#8A2BE2]/20 rounded-2xl p-6 sm:p-8 text-center">
            <Heart className="h-8 w-8 text-[#8A2BE2] mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-2">Start Using Our Free Tools</h2>
            <p className="text-[#AAAAAA] text-sm mb-5 max-w-md mx-auto">
              No signup, no downloads, no limits. Just powerful tools that work.
            </p>
            <button
              onClick={() => onNavigate('#/')}
              className="cta-primary inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold text-sm"
            >
              Explore All Tools
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
