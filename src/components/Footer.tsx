'use client';

import { Twitter, Github, Youtube, Mail, Heart } from 'lucide-react';
import Image from 'next/image';

interface FooterProps {
  onNavigate: (hash: string) => void;
}

const toolLinks = [
  { name: 'PDF Tools', hash: '#/pdf-tools' },
  { name: 'Password Generator', hash: '#/tools/password-generator' },
  { name: 'Word Counter', hash: '#/tools/word-counter' },
  { name: 'Image Compressor', hash: '#/tools/image-compressor' },
  { name: 'YouTube Thumbnail', hash: '#/tools/youtube-thumbnail' },
  { name: 'Instagram Reel', hash: '#/tools/instagram-reel' },
];

const legalLinks = [
  { name: 'Privacy Policy', hash: '#/privacy-policy' },
  { name: 'Terms of Service', hash: '#/terms-of-service' },
  { name: 'Disclaimer', hash: '#/disclaimer' },
  { name: 'About', hash: '#/about' },
];

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'GitHub', icon: Github, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
  { name: 'Email', icon: Mail, href: 'mailto:hello@toolboxpro.com' },
];

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-[#1a1a1a] bg-[#000000]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Column 1: Logo & Tagline */}
          <div className="sm:col-span-2 lg:col-span-1">
            <button
              onClick={() => onNavigate('#/')}
              className="flex items-center gap-2.5 mb-5 group"
            >
              <Image
                src="/logo.png"
                alt="ToolBox Pro Logo"
                width={30}
                height={30}
                className="rounded-lg transition-transform group-hover:scale-110"
              />
              <span className="text-xl font-bold tracking-tight gradient-text">
                ToolBox Pro
              </span>
            </button>
            <p className="text-sm text-[#888888] leading-relaxed mb-5">
              Free online tools for everyone. Fast, powerful, and completely browser-based. Your privacy is our priority.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111111] border border-[#1a1a1a] text-[#666666] hover:text-white hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/10 transition-all duration-300"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#444444] mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => onNavigate('#/')}
                  className="text-sm text-[#888888] hover:text-white transition-colors duration-300"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#/blog')}
                  className="text-sm text-[#888888] hover:text-white transition-colors duration-300"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#/contact')}
                  className="text-sm text-[#888888] hover:text-white transition-colors duration-300"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#/about')}
                  className="text-sm text-[#888888] hover:text-white transition-colors duration-300"
                >
                  About
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Tools */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#444444] mb-5">
              Tools
            </h3>
            <ul className="space-y-3">
              {toolLinks.map((tool) => (
                <li key={tool.hash}>
                  <button
                    onClick={() => onNavigate(tool.hash)}
                    className="text-sm text-[#888888] hover:text-white transition-colors duration-300"
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#444444] mb-5">
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.hash}>
                  <button
                    onClick={() => onNavigate(link.hash)}
                    className="text-sm text-[#888888] hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-[#1a1a1a]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#444444]">
              &copy; {new Date().getFullYear()} ToolBox Pro. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-xs text-[#444444]">
              Made with <Heart className="h-3 w-3 text-[#8A2BE2] fill-[#8A2BE2]" /> for the community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
