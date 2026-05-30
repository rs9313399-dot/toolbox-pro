'use client';

import { useMemo, useEffect } from 'react';
import {
  ChevronRight,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Tag,
  Share2,
  BookOpen,
  KeyRound,
  Image,
  QrCode,
  Scissors,
  Scale,
  Volume2,
  Mic,
  Braces,
  Binary,
  FileImage,
  Link as LinkIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AdPlaceholder from './AdPlaceholder';

/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  content: string;
  author: string;
}

interface RelatedTool {
  name: string;
  hash: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

/* ────────────────────────────────────────────
   Category Colors
   ──────────────────────────────────────────── */

const categoryColors: Record<string, string> = {
  Guides: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Tutorials: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Security: 'bg-green-500/10 text-green-400 border-green-500/20',
  'Content Creation': 'bg-red-500/10 text-red-400 border-red-500/20',
  Writing: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Productivity: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Accessibility: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  Developer: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

/* ────────────────────────────────────────────
   Sidebar Tools
   ──────────────────────────────────────────── */

const sidebarTools: RelatedTool[] = [
  { name: 'Image Compressor', hash: '#/tools/image-compressor', icon: Image, color: 'text-green-400' },
  { name: 'Password Generator', hash: '#/tools/password-generator', icon: KeyRound, color: 'text-purple-400' },
  { name: 'QR Code Generator', hash: '#/tools/qr-code-generator', icon: QrCode, color: 'text-indigo-400' },
  { name: 'JSON Formatter', hash: '#/tools/json-formatter', icon: Braces, color: 'text-yellow-400' },
  { name: 'Base64 Encoder', hash: '#/tools/base64-encoder', icon: Binary, color: 'text-violet-400' },
  { name: 'Background Remover', hash: '#/tools/background-remover', icon: Scissors, color: 'text-rose-400' },
];

/* ────────────────────────────────────────────
   Markdown-like Renderer
   ──────────────────────────────────────────── */

function renderContent(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    // H2
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2
          key={i}
          className="text-xl sm:text-2xl font-bold text-white mt-10 mb-4 tracking-tight"
        >
          {trimmed.replace('## ', '')}
        </h2>
      );
      return;
    }

    // H3 (if needed)
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3
          key={i}
          className="text-lg font-bold text-white mt-8 mb-3"
        >
          {trimmed.replace('### ', '')}
        </h3>
      );
      return;
    }

    // Bold standalone line
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes('- ')) {
      elements.push(
        <p key={i} className="font-semibold text-white mt-4 mb-1 leading-relaxed">
          {trimmed.replace(/\*\*/g, '')}
        </p>
      );
      return;
    }

    // Bullet list item
    if (trimmed.startsWith('- ')) {
      elements.push(
        <li key={i} className="ml-5 text-[#BBBBBB] leading-relaxed mb-1.5 list-disc marker:text-[#8A2BE2]">
          {renderInlineMarkdown(trimmed.replace('- ', ''))}
        </li>
      );
      return;
    }

    // Numbered list item
    if (trimmed.match(/^\d+\.\s/)) {
      elements.push(
        <li key={i} className="ml-5 text-[#BBBBBB] leading-relaxed mb-1.5 list-decimal marker:text-[#8A2BE2]">
          {renderInlineMarkdown(trimmed.replace(/^\d+\.\s*/, ''))}
        </li>
      );
      return;
    }

    // Empty line = paragraph break
    if (trimmed === '') {
      elements.push(<div key={i} className="h-2" />);
      return;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="text-[#BBBBBB] leading-relaxed mb-3">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });

  return elements;
}

function renderInlineMarkdown(text: string): React.ReactNode {
  // Handle **bold** inline
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.replace(/\*\*/g, '')}
        </strong>
      );
    }
    return part;
  });
}

/* ────────────────────────────────────────────
   Component
   ──────────────────────────────────────────── */

interface BlogDetailPageProps {
  slug: string;
  onNavigate: (hash: string) => void;
  allPosts: BlogPost[];
}

export default function BlogDetailPage({ slug, onNavigate, allPosts }: BlogDetailPageProps) {
  const post = useMemo(() => allPosts.find((p) => p.slug === slug), [allPosts, slug]);

  // Related articles (same category, different post)
  const relatedArticles = useMemo(() => {
    if (!post) return [];
    return allPosts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3);
  }, [allPosts, post]);

  // Related tools based on category
  const relatedTools = useMemo((): RelatedTool[] => {
    if (!post) return [];
    const toolMap: Record<string, RelatedTool[]> = {
      Security: [
        { name: 'Password Generator', hash: '#/tools/password-generator', icon: KeyRound, color: 'text-purple-400' },
        { name: 'Base64 Encoder', hash: '#/tools/base64-encoder', icon: Binary, color: 'text-violet-400' },
        { name: 'URL Shortener', hash: '#/tools/url-shortener', icon: LinkIcon, color: 'text-blue-400' },
      ],
      Tutorials: [
        { name: 'Image Compressor', hash: '#/tools/image-compressor', icon: Image, color: 'text-green-400' },
        { name: 'Image Resizer', hash: '#/tools/image-resizer', icon: Scale, color: 'text-lime-400' },
        { name: 'Background Remover', hash: '#/tools/background-remover', icon: Scissors, color: 'text-rose-400' },
      ],
      'Content Creation': [
        { name: 'YouTube Thumbnail', hash: '#/tools/youtube-thumbnail', icon: Image, color: 'text-red-400' },
        { name: 'Image Resizer', hash: '#/tools/image-resizer', icon: Scale, color: 'text-lime-400' },
        { name: 'QR Code Generator', hash: '#/tools/qr-code-generator', icon: QrCode, color: 'text-indigo-400' },
      ],
      Writing: [
        { name: 'Word Counter', hash: '#/tools/word-counter', icon: BookOpen, color: 'text-cyan-400' },
        { name: 'Text to Speech', hash: '#/tools/text-to-speech', icon: Volume2, color: 'text-teal-400' },
        { name: 'JSON Formatter', hash: '#/tools/json-formatter', icon: Braces, color: 'text-yellow-400' },
      ],
      Productivity: [
        { name: 'QR Code Generator', hash: '#/tools/qr-code-generator', icon: QrCode, color: 'text-indigo-400' },
        { name: 'Password Generator', hash: '#/tools/password-generator', icon: KeyRound, color: 'text-purple-400' },
        { name: 'Word Counter', hash: '#/tools/word-counter', icon: BookOpen, color: 'text-cyan-400' },
      ],
      Accessibility: [
        { name: 'Text to Speech', hash: '#/tools/text-to-speech', icon: Volume2, color: 'text-teal-400' },
        { name: 'Speech to Text', hash: '#/tools/speech-to-text', icon: Mic, color: 'text-sky-400' },
        { name: 'Word Counter', hash: '#/tools/word-counter', icon: BookOpen, color: 'text-cyan-400' },
      ],
      Developer: [
        { name: 'JSON Formatter', hash: '#/tools/json-formatter', icon: Braces, color: 'text-yellow-400' },
        { name: 'Base64 Encoder', hash: '#/tools/base64-encoder', icon: Binary, color: 'text-violet-400' },
        { name: 'URL Shortener', hash: '#/tools/url-shortener', icon: LinkIcon, color: 'text-blue-400' },
      ],
      Guides: [
        { name: 'Image Compressor', hash: '#/tools/image-compressor', icon: Image, color: 'text-green-400' },
        { name: 'QR Code Generator', hash: '#/tools/qr-code-generator', icon: QrCode, color: 'text-indigo-400' },
        { name: 'Password Generator', hash: '#/tools/password-generator', icon: KeyRound, color: 'text-purple-400' },
      ],
    };
    return toolMap[post.category] || toolMap.Guides;
  }, [post]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Inject JSON-LD for article
  useEffect(() => {
    if (!post) return;

    const existingScript = document.getElementById('blog-schema');
    if (existingScript) existingScript.remove();

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      author: { '@type': 'Person', name: post.author },
      datePublished: post.date,
      category: post.category,
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'blog-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const s = document.getElementById('blog-schema');
      if (s) s.remove();
    };
  }, [post]);

  if (!post) {
    return (
      <main className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-6xl font-black gradient-text mb-4">404</h1>
          <p className="text-xl text-[#AAAAAA] mb-2">Article not found</p>
          <p className="text-sm text-[#555555] mb-8">
            The article you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <button
            onClick={() => onNavigate('#/blog')}
            className="cta-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
          >
            Back to Blog
          </button>
        </div>
      </main>
    );
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      // User cancelled or error
    }
  };

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* ── Breadcrumb ── */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-1.5 text-sm text-[#555555]">
            <li>
              <button
                onClick={() => onNavigate('#/')}
                className="hover:text-white transition-colors duration-300"
              >
                Home
              </button>
            </li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li>
              <button
                onClick={() => onNavigate('#/blog')}
                className="hover:text-white transition-colors duration-300"
              >
                Blog
              </button>
            </li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li className="text-white font-medium truncate max-w-[200px]">{post.title}</li>
          </ol>
        </nav>

        {/* ── Main Layout: Article + Sidebar ── */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Article Column ── */}
          <article className="flex-1 min-w-0">
            {/* Category + Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                  categoryColors[post.category] || 'bg-[#8A2BE2]/10 text-[#8A2BE2] border-[#8A2BE2]/20'
                }`}
              >
                <Tag className="h-3 w-3 mr-1.5" />
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#555555]">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#555555]">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime} read
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight leading-[1.1]">
              {post.title}
            </h1>

            {/* Author + Share */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#00FFFF] flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{post.author}</p>
                  <p className="text-xs text-[#555555]">Contributing Writer</p>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111111] border border-[#1a1a1a] text-[#888888] hover:border-[#8A2BE2]/30 hover:text-white transition-all duration-300 text-sm"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>

            {/* Featured Image */}
            <div
              className="w-full h-56 sm:h-72 lg:h-80 rounded-2xl relative overflow-hidden mb-10 bg-[#111111]"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Article Content */}
            <div className="max-w-none">
              {renderContent(post.content)}
            </div>

            {/* ── In-content Ad ── */}
            <div className="my-10">
              <AdPlaceholder size="in-content" />
            </div>

            {/* ── Related Tools Section ── */}
            <section className="py-8 border-t border-[#1a1a1a]">
              <h2 className="text-xl font-bold text-white mb-6 tracking-tight">
                Related <span className="gradient-text">Tools</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedTools.map((tool) => (
                  <button
                    key={tool.hash}
                    onClick={() => onNavigate(tool.hash)}
                    className="tool-card p-5 text-left group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <tool.icon className={`h-5 w-5 ${tool.color}`} />
                      <h3 className="text-sm font-bold text-white group-hover:text-[#8A2BE2] transition-colors duration-300">
                        {tool.name}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#8A2BE2] group-hover:gap-2 transition-all duration-300">
                      Try Now
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* ── Related Articles Section ── */}
            {relatedArticles.length > 0 && (
              <section className="py-8 border-t border-[#1a1a1a]">
                <h2 className="text-xl font-bold text-white mb-6 tracking-tight">
                  Related <span className="gradient-text-reverse">Articles</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedArticles.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => onNavigate(`#/blog/${article.slug}`)}
                      className="tool-card p-5 text-left group"
                    >
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold border mb-3 ${
                          categoryColors[article.category] || 'bg-[#8A2BE2]/10 text-[#8A2BE2] border-[#8A2BE2]/20'
                        }`}
                      >
                        {article.category}
                      </span>
                      <h3 className="text-sm font-bold text-white mb-2 group-hover:text-[#8A2BE2] transition-colors duration-300 leading-snug line-clamp-2">
                        {article.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#00FFFF] group-hover:gap-2 transition-all duration-300">
                        Read More
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* ── Back to Blog CTA ── */}
            <div className="py-8 border-t border-[#1a1a1a]">
              <button
                onClick={() => onNavigate('#/blog')}
                className="cta-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back to All Articles
              </button>
            </div>
          </article>

          {/* ── Sticky Sidebar ── */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Try Our Tools */}
              <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8A2BE2]/30 to-transparent" />
                <h3 className="text-base font-bold text-white mb-1">Try Our Tools</h3>
                <p className="text-xs text-[#555555] mb-4">Free, no signup required</p>
                <div className="space-y-2">
                  {sidebarTools.map((tool) => (
                    <button
                      key={tool.hash}
                      onClick={() => onNavigate(tool.hash)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-[#1a1a1a] hover:border-[#8A2BE2]/30 transition-all duration-300 group text-left"
                    >
                      <tool.icon className={`h-4 w-4 ${tool.color} shrink-0`} />
                      <span className="text-sm text-[#AAAAAA] group-hover:text-white transition-colors duration-300">
                        {tool.name}
                      </span>
                      <ArrowRight className="h-3 w-3 text-[#333333] group-hover:text-[#8A2BE2] ml-auto transition-all duration-300" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sidebar Ad */}
              <AdPlaceholder size="sidebar" />

              {/* Newsletter / CTA */}
              <div className="bg-gradient-to-br from-[#8A2BE2]/10 to-[#00FFFF]/5 border border-[#8A2BE2]/10 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-2">15+ Free Tools</h3>
                <p className="text-xs text-[#AAAAAA] leading-relaxed mb-4">
                  All tools run in your browser. No data uploaded, no signup needed.
                </p>
                <button
                  onClick={() => onNavigate('#/')}
                  className="w-full cta-primary py-2.5 rounded-xl text-white text-sm font-semibold"
                >
                  Explore All Tools
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Bottom Ad ── */}
        <div className="mt-12">
          <AdPlaceholder size="banner" />
        </div>
      </div>
    </main>
  );
}
