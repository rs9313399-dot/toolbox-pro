'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import AdPlaceholder from './AdPlaceholder';
import FAQSection from './FAQSection';

interface FAQItem {
  question: string;
  answer: string;
}

interface RelatedTool {
  name: string;
  hash: string;
  description: string;
}

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  faqItems: FAQItem[];
  relatedTools: RelatedTool[];
  children: React.ReactNode;
  onNavigate: (hash: string) => void;
  seoContent?: string;
}

export default function ToolLayout({
  title,
  description,
  icon: Icon,
  faqItems,
  relatedTools,
  children,
  onNavigate,
  seoContent,
}: ToolLayoutProps) {
  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 pt-6">
          <ol className="flex items-center gap-1.5 text-sm text-[#555555]">
            <li>
              <button
                onClick={() => onNavigate('/')}
                className="hover:text-white transition-colors duration-300"
              >
                Home
              </button>
            </li>
            <li>
              <ChevronRight className="h-3 w-3" />
            </li>
            <li>
              <button
                onClick={() => onNavigate('/')}
                className="hover:text-white transition-colors duration-300"
              >
                Tools
              </button>
            </li>
            <li>
              <ChevronRight className="h-3 w-3" />
            </li>
            <li className="text-white font-medium">{title}</li>
          </ol>
        </nav>

        {/* H1 with icon */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20">
              <Icon className="h-7 w-7 text-[#8A2BE2]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {title}
            </h1>
          </div>
          <p className="text-[#AAAAAA] leading-relaxed max-w-2xl text-base">
            {description}
          </p>
        </div>

        {/* Tool Interface — BEFORE ads so content is visible first */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 sm:p-8 mb-10 relative overflow-hidden">
          {/* Subtle top border glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8A2BE2]/30 to-transparent" />
          {children}
        </div>

        {/* SEO Content Section — Rich descriptive content for AdSense compliance */}
        {seoContent && (
          <section className="mb-10 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 sm:p-8">
            <div
              className="prose prose-invert prose-sm max-w-none text-[#AAAAAA] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: seoContent }}
            />
          </section>
        )}

        {/* Banner Ad — AFTER content so Google sees publisher content first */}
        <div className="mb-8">
          <AdPlaceholder size="banner" />
        </div>

        {/* FAQ Section */}
        <FAQSection items={faqItems} pageTitle={title} />

        {/* In-content Ad — After FAQ (more content before ad) */}
        <div className="my-10">
          <AdPlaceholder size="in-content" />
        </div>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <section className="py-8">
            <h2 className="text-xl font-bold text-white mb-6 tracking-tight">
              Related Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTools.map((tool) => (
                <button
                  key={tool.hash}
                  onClick={() => onNavigate(tool.hash)}
                  className="tool-card p-5 text-left"
                >
                  <h3 className="text-sm font-bold text-white group-hover:text-[#8A2BE2] transition-colors duration-300 mb-1">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-[#888888] leading-relaxed">
                    {tool.description}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
