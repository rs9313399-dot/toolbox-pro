'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Crown } from 'lucide-react';
import Image from 'next/image';

const toolCategories = [
  {
    group: 'Image & PDF',
    items: [
      { name: 'Image Compressor', hash: '#/tools/image-compressor', desc: 'Compress images' },
      { name: 'Image Resizer', hash: '#/tools/image-resizer', desc: 'Resize images' },
      { name: 'Background Remover', hash: '#/tools/background-remover', desc: 'Remove backgrounds' },
      { name: 'Image to PDF', hash: '#/tools/image-to-pdf', desc: 'Images to PDF' },
      { name: 'PDF to Image', hash: '#/tools/pdf-to-image', desc: 'PDF to images' },
    ],
  },
  {
    group: 'Text & Speech',
    items: [
      { name: 'Word Counter', hash: '#/tools/word-counter', desc: 'Count words & chars' },
      { name: 'Text to Speech', hash: '#/tools/text-to-speech', desc: 'Read text aloud' },
      { name: 'Speech to Text', hash: '#/tools/speech-to-text', desc: 'Voice to text' },
    ],
  },
  {
    group: 'Developer',
    items: [
      { name: 'JSON Formatter', hash: '#/tools/json-formatter', desc: 'Format & validate JSON' },
      { name: 'Base64 Encoder', hash: '#/tools/base64-encoder', desc: 'Encode/decode Base64' },
      { name: 'QR Code Generator', hash: '#/tools/qr-code-generator', desc: 'Generate QR codes' },
      { name: 'URL Shortener', hash: '#/tools/url-shortener', desc: 'Shorten URLs' },
    ],
  },
  {
    group: 'Security & Social',
    items: [
      { name: 'Password Generator', hash: '#/tools/password-generator', desc: 'Secure passwords' },
      { name: 'YouTube Thumbnail', hash: '#/tools/youtube-thumbnail', desc: 'Download thumbnails' },
      { name: 'Instagram Reel', hash: '#/tools/instagram-reel', desc: 'Download reels' },
    ],
  },
];

const allTools = toolCategories.flatMap(c => c.items);

const navLinks = [
  { name: 'Home', hash: '#/' },
  { name: 'Blog', hash: '#/blog' },
  { name: 'Pricing', hash: '#/pricing' },
  { name: 'Contact', hash: '#/contact' },
];

interface HeaderProps {
  currentHash: string;
  onNavigate: (hash: string) => void;
}

export default function Header({ currentHash, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setToolsOpen(false);
    setMobileOpen(false);
  }, [currentHash]);

  const handleNav = (hash: string) => {
    onNavigate(hash);
    setMobileOpen(false);
    setToolsOpen(false);
  };

  const isToolsActive = currentHash.startsWith('#/tools');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/50'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNav('#/')}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative">
              <Image
                src="/logo.png"
                alt="ToolBox Pro Logo"
                width={34}
                height={34}
                className="rounded-lg transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-lg bg-[#8A2BE2]/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold tracking-tight gradient-text">
              ToolBox Pro
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNav('#/')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                currentHash === '#/' || currentHash === '#'
                  ? 'text-white bg-white/5'
                  : 'text-[#AAAAAA] hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </button>

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                onMouseEnter={() => setToolsOpen(true)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isToolsActive
                    ? 'text-white bg-white/5'
                    : 'text-[#AAAAAA] hover:text-white hover:bg-white/5'
                }`}
              >
                Tools
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${
                    toolsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown - CSS transition */}
              <div
                onMouseLeave={() => setToolsOpen(false)}
                className={`absolute top-full right-0 mt-3 w-72 max-h-[70vh] overflow-y-auto rounded-2xl bg-[#111111] border border-[#222222] p-2 shadow-2xl shadow-black/60 transition-all duration-200 origin-top-right ${
                  toolsOpen
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
                }`}
              >
                {toolCategories.map((cat) => (
                  <div key={cat.group} className="mb-1 last:mb-0">
                    <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#555555]">{cat.group}</p>
                    {cat.items.map((tool) => (
                      <button
                        key={tool.hash}
                        onClick={() => handleNav(tool.hash)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 group ${
                          currentHash === tool.hash
                            ? 'text-white bg-[#8A2BE2]/10 border border-[#8A2BE2]/20'
                            : 'text-[#AAAAAA] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="block text-sm font-medium group-hover:text-white transition-colors">
                          {tool.name}
                        </span>
                        <span className="block text-[11px] text-[#555555] mt-0.5 group-hover:text-[#888888]">
                          {tool.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {navLinks.slice(1).map((link) => (
              <button
                key={link.hash}
                onClick={() => handleNav(link.hash)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  currentHash === link.hash || (link.hash === '#/blog' && currentHash.startsWith('#/blog'))
                    ? 'text-white bg-white/5'
                    : 'text-[#AAAAAA] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </button>
            ))}

            {/* CTA */}
            <button
              onClick={() => handleNav('#/pricing')}
              className="ml-3 cta-primary px-5 py-2 rounded-xl text-white text-sm font-semibold inline-flex items-center gap-1.5"
            >
              <Crown className="h-3.5 w-3.5" />
              <span>Go Pro</span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-white" />
            ) : (
              <Menu className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - CSS transition */}
      <div
        className={`md:hidden bg-black/98 backdrop-blur-2xl border-t border-white/5 transition-all duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-[800px] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-5 space-y-1">
          <button
            onClick={() => handleNav('#/')}
            className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all ${
              currentHash === '#/' || currentHash === '#'
                ? 'text-white bg-white/5'
                : 'text-[#AAAAAA] hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </button>

          <div className="py-1">
            <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#444444]">
              Tools
            </p>
            {toolCategories.map((cat) => (
              <div key={cat.group}>
                <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#444444]">{cat.group}</p>
                {cat.items.map((tool) => (
                  <button
                    key={tool.hash}
                    onClick={() => handleNav(tool.hash)}
                    className={`block w-full text-left px-4 py-2.5 text-sm rounded-lg transition-all ${
                      currentHash === tool.hash
                        ? 'text-white bg-white/5'
                        : 'text-[#AAAAAA] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tool.name}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-2">
            {navLinks.slice(1).map((link) => (
              <button
                key={link.hash}
                onClick={() => handleNav(link.hash)}
                className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  currentHash === link.hash || (link.hash === '#/blog' && currentHash.startsWith('#/blog'))
                    ? 'text-white bg-white/5'
                    : 'text-[#AAAAAA] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="pt-2 px-4">
            <button
              onClick={() => handleNav('#/pricing')}
              className="w-full cta-primary py-3 rounded-xl text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5"
            >
              <Crown className="h-3.5 w-3.5" />
              <span>Go Pro</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
