'use client';

import {
  KeyRound,
  Type,
  Image,
  Youtube,
  Instagram,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Users,
  ImagePlus,
  Video,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  FileImage,
  QrCode,
  Link,
  Volume2,
  Mic,
  Scale,
  Scissors,
  Braces,
  Binary,
  Crown,
  Sparkles,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AdPlaceholder from './AdPlaceholder';
import AffiliateSection from './AffiliateSection';
import FAQSection from './FAQSection';

interface HomePageProps {
  onNavigate: (hash: string) => void;
}

const tools = [
  {
    name: 'Password Generator',
    path: '/tools/password-generator',
    icon: KeyRound,
    description:
      'Create strong, secure passwords with customizable length and character options. Uses crypto.getRandomValues() for maximum security.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    premium: false,
  },
  {
    name: 'Word Counter',
    hash: '/tools/word-counter',
    icon: Type,
    description:
      'Count words, characters, sentences, and paragraphs instantly with reading time estimation. Real-time text analysis.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    premium: false,
  },
  {
    name: 'Image Compressor',
    hash: '/tools/image-compressor',
    icon: Image,
    description:
      'Compress images in your browser without uploading. Adjust quality, preview side-by-side, and download instantly.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    premium: false,
  },
  {
    name: 'YouTube Thumbnail',
    hash: '/tools/youtube-thumbnail',
    icon: Youtube,
    description:
      'Download YouTube video thumbnails in multiple resolutions. Just paste the URL and get all sizes instantly.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    premium: false,
  },
  {
    name: 'Instagram Reel',
    hash: '/tools/instagram-reel',
    icon: Instagram,
    description:
      'Download Instagram reels for free. Paste the reel URL and get your download link or use alternative services.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    premium: false,
  },
  {
    name: 'Image to PDF',
    hash: '/tools/image-to-pdf',
    icon: FileImage,
    description:
      'Convert images to PDF documents instantly. Upload multiple images, rearrange, and download as a single PDF.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    premium: true,
  },
  {
    name: 'PDF to Image',
    hash: '/tools/pdf-to-image',
    icon: FileImage,
    description:
      'Convert PDF pages to high-quality PNG images. Export each page individually or download all at once.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    premium: true,
  },
  {
    name: 'QR Code Generator',
    hash: '/tools/qr-code-generator',
    icon: QrCode,
    description:
      'Generate custom QR codes for URLs, text, WiFi, and more. Download high-quality PNG images instantly.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    premium: false,
  },
  {
    name: 'URL Shortener',
    hash: '/tools/url-shortener',
    icon: Link,
    description:
      'Shorten long URLs into compact, shareable links. Perfect for social media, messages, and marketing.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    premium: true,
  },
  {
    name: 'Text to Speech',
    hash: '/tools/text-to-speech',
    icon: Volume2,
    description:
      'Convert text to natural speech using browser speech synthesis. Adjust speed, pitch, and volume.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    premium: false,
  },
  {
    name: 'Speech to Text',
    hash: '/tools/speech-to-text',
    icon: Mic,
    description:
      'Convert voice to text in real-time using speech recognition. Perfect for dictation and note-taking.',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    premium: false,
  },
  {
    name: 'Image Resizer',
    hash: '/tools/image-resizer',
    icon: Scale,
    description:
      'Resize images to any dimension. Maintain aspect ratio, use presets, and download in multiple formats.',
    color: 'text-lime-400',
    bg: 'bg-lime-500/10',
    border: 'border-lime-500/20',
    premium: true,
  },
  {
    name: 'Background Remover',
    hash: '/tools/background-remover',
    icon: Scissors,
    description:
      'Remove image backgrounds instantly with color-based processing. Get transparent PNG output.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    premium: true,
  },
  {
    name: 'Color Grade Transfer',
    hash: '/tools/color-grade-transfer',
    icon: ImagePlus,
    description:
      'Transfer the color palette and mood from any reference photo to your image with AI-powered color analysis.',
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/20',
    premium: true,
  },
  {
    name: 'JSON Formatter',
    hash: '/tools/json-formatter',
    icon: Braces,
    description:
      'Format, validate, and beautify JSON data. Detect errors, minify output, and convert between formats.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    premium: false,
  },
  {
    name: 'Base64 Encoder',
    hash: '/tools/base64-encoder',
    icon: Binary,
    description:
      'Encode text or files to Base64 and decode back. Essential for developers working with APIs and data URIs.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    premium: false,
  },
];

const categories = [
  {
    name: 'Image Tools',
    icon: ImagePlus,
    count: 6,
    toolHash: '/tools/image-compressor',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    name: 'Video Tools',
    icon: Video,
    count: 2,
    toolHash: '/tools/youtube-thumbnail',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  {
    name: 'Text Tools',
    icon: Type,
    count: 5,
    toolHash: '/tools/word-counter',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    name: 'Security Tools',
    icon: ShieldCheck,
    count: 1,
    toolHash: '/tools/password-generator',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    name: 'Developer Tools',
    icon: Braces,
    count: 3,
    toolHash: '/tools/json-formatter',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
  },
  {
    name: 'PDF Tools',
    icon: FileImage,
    count: 2,
    toolHash: '/tools/image-to-pdf',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
];

const stats = [
  { label: 'Trusted by 100K+ users', icon: Users },
  { label: '16+ Free Tools', icon: Zap },
  { label: 'No Signup Required', icon: ShieldCheck },
  { label: '100% Browser-Based', icon: Globe },
];

const benefits = [
  'No account or signup needed',
  'Your data stays in your browser',
  'Lightning-fast processing',
  'Works on any device',
];

const homeFAQ = [
  {
    question: 'Are these tools really free?',
    answer:
      'Yes, all tools on ToolBox Pro are 100% free to use with no hidden fees, no premium tiers, and no signup required. We monetize through non-intrusive advertising so you can use all features without any limitations.',
  },
  {
    question: 'Is my data safe when using these tools?',
    answer:
      'Absolutely. Most of our tools process everything directly in your browser using client-side technologies like the Canvas API and crypto.getRandomValues(). Your data never leaves your device and is never sent to any server. Privacy is our core principle.',
  },
  {
    question: 'Do I need to install anything?',
    answer:
      'No installation required. All tools run directly in your web browser on any device — desktop, tablet, or mobile. Just visit the site, pick a tool, and start using it immediately.',
  },
  {
    question: 'Can I use these tools on my phone?',
    answer:
      'Yes! ToolBox Pro is fully responsive and works perfectly on all mobile devices. Every tool is optimized for touch interfaces and smaller screens so you can be productive on the go.',
  },
  {
    question: 'How do you make money if everything is free?',
    answer:
      'We display non-intrusive advertisements on our pages and include affiliate recommendations for related products and services. This allows us to keep all tools free while covering our operational costs.',
  },
];

// Scroll reveal hook — starts visible, adds animation only after JS loads
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setIsVisible(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const categoriesReveal = useReveal();
  const statsReveal = useReveal();
  const faqReveal = useReveal();
  const toolsReveal = useReveal();
  const blogReveal = useReveal();

  return (
    <main className="min-h-screen pt-18">
      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-44">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#8A2BE2]/12 blur-[180px] animate-orb" />
          <div className="absolute top-20 -right-40 w-[400px] h-[400px] rounded-full bg-[#00FFFF]/8 blur-[150px] animate-orb-reverse" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#8A2BE2]/5 blur-[200px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 mb-8 animate-fade-in-up">
            <Zap className="h-3.5 w-3.5 text-[#8A2BE2]" />
            <span className="text-xs font-medium text-[#8A2BE2]">100% Free &middot; No Signup</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-6 leading-[1.05] animate-fade-in-up">
            <span className="gradient-text">Free Online</span>
            <br />
            <span className="text-white">Tools for Everyone</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#AAAAAA] max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            Powerful browser-based tools that respect your privacy. No uploads, no servers, no signups. Everything runs locally on your device.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => onNavigate('/tools/password-generator')}
              className="cta-primary inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white font-semibold text-sm animate-btn-glow"
            >
              <span>Explore Tools</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('/blog')}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl border border-[#222222] text-white font-semibold text-sm hover:border-[#8A2BE2]/50 hover:bg-white/5 transition-all duration-300"
            >
              <BookOpen className="h-4 w-4" />
              Read Our Blog
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            {benefits.map((benefit) => (
              <span key={benefit} className="flex items-center gap-1.5 text-sm text-[#666666]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#8A2BE2]" />
                {benefit}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ AD BANNER ═══════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <AdPlaceholder size="banner" />
      </div>

      {/* ═══════════════════ FEATURED TOOLS ═══════════════════ */}
      <div ref={toolsReveal.ref} className={`reveal-section ${toolsReveal.isVisible ? 'js-reveal' : ''} mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24`}>
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">
              Popular <span className="gradient-text">Tools</span>
            </h2>
            <p className="text-[#AAAAAA] text-base sm:text-lg max-w-xl mx-auto">
              Powerful tools that work right in your browser. No downloads, no uploads, no limits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {tools.map((tool) => (
              <button
                key={tool.hash}
                onClick={() => onNavigate(tool.hash)}
                className="tool-card p-7 text-left group relative"
              >
                {tool.premium && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 text-[10px] font-bold text-[#8A2BE2] z-10">
                    <Crown className="h-2.5 w-2.5" />
                    PRO
                  </span>
                )}
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${tool.bg} border ${tool.border} mb-6 transition-all duration-300 group-hover:scale-110`}
                >
                  <tool.icon className={`h-7 w-7 ${tool.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#8A2BE2] transition-colors duration-300">
                  {tool.name}
                </h3>
                <p className="text-sm text-[#888888] leading-relaxed mb-5">
                  {tool.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#8A2BE2] group-hover:gap-3 transition-all duration-300">
                  {tool.premium ? 'Try Pro Feature' : 'Use Tool'}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* ═══════════════════ CATEGORIES ═══════════════════ */}
      <div ref={categoriesReveal.ref} className={`reveal-section ${categoriesReveal.isVisible ? 'js-reveal' : ''} mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24`}>
        <section>
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
              Browse by <span className="gradient-text-reverse">Category</span>
            </h2>
            <p className="text-[#AAAAAA] text-base max-w-lg mx-auto">
              Find the right tool for your needs
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => onNavigate(cat.toolHash)}
                className="tool-card p-6 sm:p-8 text-center cursor-pointer"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${cat.bg} border ${cat.border} mb-4`}>
                  <cat.icon className={`h-6 w-6 ${cat.color}`} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">
                  {cat.name}
                </h3>
                <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-2.5 rounded-full bg-white/5 text-[10px] font-medium text-[#888888]">
                  {cat.count} tool{cat.count !== 1 ? 's' : ''}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* ═══════════════════ STATS/TRUST ═══════════════════ */}
      <div ref={statsReveal.ref} className={`reveal-section ${statsReveal.isVisible ? 'js-reveal' : ''} mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24`}>
        <section>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-3xl p-10 sm:p-16 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#8A2BE2]/5 blur-[200px] pointer-events-none" />
            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 mb-4">
                    <stat.icon className="h-6 w-6 text-[#8A2BE2]" />
                  </div>
                  <p className="text-sm font-medium text-[#AAAAAA] leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════════ PRICING CTA ═══════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-gradient-to-br from-[#8A2BE2]/10 via-[#0a0a0a] to-[#00FFFF]/5 border border-[#8A2BE2]/20 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#8A2BE2]/8 blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-[#00FFFF]/5 blur-[120px] pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 mb-4">
                <Crown className="h-3 w-3 text-[#8A2BE2]" />
                <span className="text-[10px] font-bold text-[#8A2BE2] uppercase tracking-wider">Go Premium</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
                Unlock <span className="gradient-text">Pro Features</span>
              </h2>
              <p className="text-sm sm:text-base text-[#AAAAAA] leading-relaxed max-w-lg">
                Get ad-free experience, 3x faster processing, HD exports, batch processing up to 50 files, and 4 exclusive Pro tools. Starting at just $4.99/month.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => onNavigate('/pricing')}
                className="cta-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold text-sm animate-btn-glow"
              >
                <Sparkles className="h-4 w-4" />
                View Plans
                <ArrowRight className="h-4 w-4" />
              </button>
              <span className="text-xs text-[#555555]">7-day free trial</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ IN-CONTENT AD ═══════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24">
        <AdPlaceholder size="in-content" />
      </div>

      {/* ═══════════════════ BLOG PREVIEW ═══════════════════ */}
      <div ref={blogReveal.ref} className={`reveal-section ${blogReveal.isVisible ? 'js-reveal' : ''} mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24`}>
        <section>
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
                Latest from the <span className="gradient-text">Blog</span>
              </h2>
              <p className="text-[#AAAAAA] text-base">
                Tips, tutorials, and insights for productivity
              </p>
            </div>
            <button
              onClick={() => onNavigate('/blog')}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#8A2BE2] hover:gap-3 transition-all duration-300"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: 'Best Free Online Tools in 2026',
                excerpt: 'Discover top free tools that boost productivity and make life easier.',
                category: 'Guides',
                color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
              },
              {
                title: 'How to Compress Images Without Losing Quality',
                excerpt: 'Learn techniques for image compression that maintain visual quality.',
                category: 'Tutorials',
                color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
              },
              {
                title: 'The Ultimate Guide to Strong Passwords',
                excerpt: 'Protect your accounts with these password security tips.',
                category: 'Security',
                color: 'bg-green-500/10 text-green-400 border-green-500/20',
              },
            ].map((post) => (
              <button
                key={post.title}
                onClick={() => onNavigate('/blog')}
                className="tool-card p-6 text-left group"
              >
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium border ${post.color} mb-4`}>
                  {post.category}
                </span>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#8A2BE2] transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-sm text-[#888888] leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#8A2BE2] group-hover:gap-2.5 transition-all duration-300">
                  Read More
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
            ))}
          </div>

          {/* Mobile View All */}
          <div className="sm:hidden mt-6 text-center">
            <button
              onClick={() => onNavigate('/blog')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#8A2BE2]"
            >
              View All Posts
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>

      {/* ═══════════════════ FAQ SECTION ═══════════════════ */}
      <div ref={faqReveal.ref} className={`reveal-section ${faqReveal.isVisible ? 'js-reveal' : ''} mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-24`}>
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00FFFF]/10 border border-[#00FFFF]/20 mb-5">
              <HelpCircle className="h-7 w-7 text-[#00FFFF]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-[#AAAAAA] text-base max-w-lg mx-auto">
              Got questions? We&apos;ve got answers.
            </p>
          </div>
          <FAQSection items={homeFAQ} pageTitle="ToolBox Pro" />
        </section>
      </div>

      {/* ═══════════════════ AFFILIATE SECTION ═══════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <AffiliateSection />
      </div>

      {/* ═══════════════════ BOTTOM AD ═══════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <AdPlaceholder size="banner" />
      </div>
    </main>
  );
}
