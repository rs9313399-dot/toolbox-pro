'use client';

import { useState, useCallback } from 'react';
import { Link, Copy, Trash2, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'How does URL shortening work?',
    answer:
      'URL shortening creates a compact alias for a long URL. When someone visits the short link, they are redirected to the original long URL. This tool creates a simulated short link using a hash-based encoding of your original URL, making it easier to share in messages, social media, and printed materials.',
  },
  {
    question: 'What are the limitations of this tool?',
    answer:
      'This is a client-side simulation for demo purposes. The shortened URLs are generated locally in your browser using base64 encoding. They are not registered with any DNS server and will not actually redirect when visited. For production URL shortening, you would need a backend service with a database and redirect logic, such as bit.ly or your own server.',
  },
  {
    question: 'Can I create custom URL aliases?',
    answer:
      'Currently, this tool generates short codes automatically using a hash-based algorithm derived from your original URL. Custom aliases are not supported in this demo. In a production URL shortening service, custom aliases would allow you to create memorable links like tbx.pro/my-custom-link instead of random codes.',
  },
  {
    question: 'Does this tool provide click analytics?',
    answer:
      'No, this is a client-side simulation and does not track clicks or provide analytics. A full URL shortening service would typically track the number of clicks, geographic locations of visitors, referrers, and device types. To get analytics for your links, you would need to integrate with a service like bit.ly or build a backend with tracking capabilities.',
  },
  {
    question: 'Why use shortened URLs?',
    answer:
      'Shortened URLs are easier to share, especially on platforms with character limits like Twitter. They look cleaner in printed materials, are easier to type manually, and can be tracked for analytics in a full URL shortening service. They also hide the original long URL parameters, which can make links appear more trustworthy and professional.',
  },
];

const relatedTools = [
  {
    name: 'QR Code Generator',
    hash: '#/tools/qr-code-generator',
    description: 'Generate QR codes from URLs or text.',
  },
  {
    name: 'Base64 Encoder',
    hash: '#/tools/base64-encoder',
    description: 'Encode and decode Base64 strings.',
  },
  {
    name: 'Password Generator',
    hash: '#/tools/password-generator',
    description: 'Create strong, secure passwords easily.',
  },
];

interface ShortenedUrl {
  id: string;
  original: string;
  short: string;
  code: string;
  createdAt: Date;
}

interface UrlShortenerProps {
  onNavigate: (hash: string) => void;
}

export default function UrlShortener({ onNavigate }: UrlShortenerProps) {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState<ShortenedUrl[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateShortCode = useCallback((inputUrl: string): string => {
    try {
      const encoded = btoa(inputUrl).replace(/[+/=]/g, '');
      return encoded.slice(0, 7).toLowerCase();
    } catch {
      return btoa(encodeURIComponent(inputUrl)).replace(/[+/=]/g, '').slice(0, 7).toLowerCase();
    }
  }, []);

  const isValidUrl = useCallback((inputUrl: string): boolean => {
    try {
      new URL(inputUrl);
      return true;
    } catch {
      return false;
    }
  }, []);

  const shortenUrl = useCallback(() => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      toast.error('Please enter a URL');
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      toast.error('Please enter a valid URL (include https://)');
      return;
    }

    const code = generateShortCode(trimmedUrl);
    const shortUrl = `https://tbx.pro/${code}`;

    const entry: ShortenedUrl = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      original: trimmedUrl,
      short: shortUrl,
      code,
      createdAt: new Date(),
    };

    setHistory((prev) => [entry, ...prev]);
    setUrl('');
    toast.success('URL shortened!');
  }, [url, isValidUrl, generateShortCode]);

  const copyUrl = useCallback(async (shortUrl: string, id: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      toast.success('Shortened URL copied!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy URL');
    }
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    toast.info('History cleared');
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  return (
    <ToolLayout
      title="URL Shortener"
      description="Shorten long URLs into compact, shareable links. This tool creates shortened URLs using a client-side encoding algorithm. Perfect for social media posts, text messages, or any situation where you need a shorter URL."
      icon={Link}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {/* Demo Notice */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#8A2BE2]/5 border border-[#8A2BE2]/20">
          <span className="text-[#8A2BE2] text-sm">ℹ️</span>
          <p className="text-xs text-[#AAAAAA] leading-relaxed">
            This is a client-side simulation for demo purposes. The shortened URLs are generated
            locally using hash-based encoding and are not registered with any DNS server. For
            production use, integrate with a service like bit.ly.
          </p>
        </div>

        {/* URL Input */}
        <div>
          <Label className="text-sm font-medium text-white mb-2 block">
            Enter Long URL
          </Label>
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url/..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') shortenUrl();
              }}
              className="flex-1 bg-black/40 border border-[#222222] rounded-xl p-3 text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:outline-none transition-colors"
            />
            <Button
              onClick={shortenUrl}
              disabled={!url.trim()}
              className="cta-primary shrink-0"
              size="lg"
            >
              Shorten
            </Button>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-white">
                Shortened URLs ({history.length})
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear History
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl bg-black/40 border border-[#1a1a1a] hover:border-[#8A2BE2]/20 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[#00FFFF] text-sm font-mono truncate">
                        {entry.short}
                      </span>
                      <ExternalLink className="h-3 w-3 text-[#555555] shrink-0" />
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => copyUrl(entry.short, entry.id)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-[#AAAAAA] hover:text-white transition-all"
                        aria-label="Copy shortened URL"
                      >
                        {copiedId === entry.id ? (
                          <Check className="h-3.5 w-3.5 text-green-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => removeEntry(entry.id)}
                        className="p-1.5 rounded-lg hover:bg-red-400/10 text-[#555555] hover:text-red-400 transition-all"
                        aria-label="Remove entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#555555] truncate">{entry.original}</p>
                  <p className="text-[10px] text-[#444444] mt-1">
                    {entry.createdAt.toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
