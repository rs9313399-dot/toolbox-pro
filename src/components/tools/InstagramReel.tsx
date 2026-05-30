'use client';

import { useState } from 'react';
import { Instagram, Download, Loader2, CheckCircle, AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'How does this Instagram Reel Downloader work?',
    answer:
      'Paste the Instagram reel URL in the input field and click "Download Reel". Our tool tries to fetch the reel details through our server (which avoids browser restrictions) and provides you with a direct download link. If the direct method fails, we provide trusted alternative services you can use.',
  },
  {
    question: 'Is it legal to download Instagram reels?',
    answer:
      'You should only download content that you have permission to use. Downloading your own reels for backup is generally fine. For others\' content, always get permission from the creator and respect copyright laws in your jurisdiction.',
  },
  {
    question: 'Why did my reel download fail?',
    answer:
      'Downloads may fail if the reel is from a private account, the URL is incorrect, or the download service is temporarily unavailable. Make sure the URL is correct and the account is public. You can always use the alternative download services provided.',
  },
  {
    question: 'Does this work on mobile devices?',
    answer:
      'Yes! Our Instagram Reel Downloader works on all devices including smartphones and tablets. Simply copy the reel link from the Instagram app, paste it here, and download.',
  },
];

const relatedTools = [
  {
    name: 'YouTube Thumbnail',
    hash: '#/tools/youtube-thumbnail',
    description: 'Download YouTube video thumbnails easily.',
  },
  {
    name: 'Image Compressor',
    hash: '#/tools/image-compressor',
    description: 'Compress images without losing quality.',
  },
  {
    name: 'Password Generator',
    hash: '#/tools/password-generator',
    description: 'Create strong, secure passwords easily.',
  },
];

function isValidInstagramUrl(url: string): boolean {
  return (
    url.includes('instagram.com') &&
    (url.includes('/reel/') || url.includes('/reels/') || url.includes('/p/'))
  );
}

interface ReelResult {
  thumbnail: string;
  videoUrl: string;
  title: string;
}

interface AlternativeService {
  name: string;
  url: string;
}

interface InstagramReelProps {
  onNavigate: (hash: string) => void;
}

export default function InstagramReel({ onNavigate }: InstagramReelProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ReelResult | null>(null);
  const [alternatives, setAlternatives] = useState<AlternativeService[]>([]);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    setError('');
    setResult(null);
    setAlternatives([]);
    setCopied(false);

    if (!url.trim()) {
      setError('Please enter an Instagram Reel URL');
      return;
    }

    if (!isValidInstagramUrl(url.trim())) {
      setError('Please enter a valid Instagram reel URL (e.g., instagram.com/reel/...)');
      return;
    }

    setIsLoading(true);

    try {
      // Use our backend API route to avoid CORS issues
      const apiUrl = `/api/instagram?url=${encodeURIComponent(url.trim())}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reel data');
      }

      const data = await response.json();

      if (data.success && data.videoUrl) {
        setResult({
          thumbnail: data.thumbnail || '',
          videoUrl: data.videoUrl,
          title: data.title || 'Instagram Reel',
        });
      } else if (data.alternatives) {
        // API returned alternative services
        setAlternatives(data.alternatives);
        setResult({
          thumbnail: '',
          videoUrl: '',
          title: '',
        });
      } else {
        throw new Error(data.error || 'No media found. The reel may be private or the URL is invalid.');
      }
    } catch {
      // Fallback: provide alternative download method
      setAlternatives([
        { name: 'SaveInsta', url: 'https://saveinsta.app' },
        { name: 'iGram', url: 'https://igram.io' },
        { name: 'FastDl', url: 'https://fastdl.app' },
        { name: 'SnapInsta', url: 'https://snapinsta.app' },
      ]);
      setResult({
        thumbnail: '',
        videoUrl: '',
        title: '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleDownload();
  };

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleOpenLink = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <ToolLayout
      title="Instagram Reel Downloader"
      description="Download Instagram reels for free. Just paste the reel URL and get your download link instantly. Works with any public reel."
      icon={Instagram}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {/* URL Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder="Paste Instagram Reel URL (e.g., instagram.com/reel/ABC123...)"
            className="flex-1 bg-black/50 border-[#222222] h-12 text-white placeholder:text-[#555555] focus:border-[#8A2BE2] transition-colors"
          />
          <Button
            onClick={handleDownload}
            className="cta-primary h-12 px-6 shrink-0"
            disabled={isLoading || !url.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Reel
              </>
            )}
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Result - Direct Download */}
        {result && result.videoUrl && (
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6">
              <div className="flex items-start gap-5">
                {/* Thumbnail */}
                {result.thumbnail && (
                  <div className="w-24 h-40 rounded-xl overflow-hidden bg-black shrink-0 border border-[#222222]">
                    <img
                      src={result.thumbnail}
                      alt="Reel thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white mb-1 truncate">
                    {result.title || 'Instagram Reel'}
                  </h3>
                  <p className="text-sm text-[#888888] mb-5">
                    Your reel is ready for download!
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => handleOpenLink(result.videoUrl)}
                      className="cta-primary"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-1.5" />
                      <span>Download Video</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyLink(result.videoUrl)}
                      className="border-[#222222] hover:border-[#8A2BE2]/50 text-white"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 mr-1.5 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4 mr-1.5" />
                      )}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Success indicator */}
            <div className="flex items-center gap-2.5 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
              <p className="text-xs text-green-400">
                Click &quot;Download Video&quot; to save the reel. If the download doesn&apos;t start, use the alternative services below.
              </p>
            </div>
          </div>
        )}

        {/* Fallback - Alternative Services (shown when direct download fails) */}
        {result && !result.videoUrl && (
          <div className="space-y-5 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
              <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0" />
              <div>
                <p className="text-sm text-yellow-400 font-semibold mb-1">
                  Direct download unavailable
                </p>
                <p className="text-xs text-[#888888]">
                  This reel may be restricted or private. Try one of these trusted services to download it.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">
                Alternative Download Methods
              </h3>
              <p className="text-sm text-[#888888]">
                Copy the reel URL and paste it on any of these trusted services:
              </p>

              {/* Copy URL Box */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0a0a0a] border border-[#222222]">
                <code className="flex-1 text-xs text-[#888888] truncate font-mono">
                  {url}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyLink(url)}
                  className="shrink-0 text-[#8A2BE2] hover:text-[#9B3FEF]"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Service Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {alternatives.map((service) => (
                  <a
                    key={service.name}
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tool-card p-5 group block"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-[#8A2BE2] transition-colors">
                        {service.name}
                      </h4>
                      <ExternalLink className="h-3.5 w-3.5 text-[#555555] group-hover:text-[#8A2BE2] transition-colors" />
                    </div>
                    <p className="text-xs text-[#666666]">
                      {service.url.replace('https://', '')}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* How to get reel URL */}
        <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4">
            How to Get Reel URL
          </h3>
          <div className="space-y-3">
            {[
              'Open the Instagram app or website',
              'Go to the reel you want to download',
              'Tap the share button (paper airplane icon)',
              'Select "Copy Link"',
              'Paste the link above and click Download',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 text-xs font-bold text-[#8A2BE2]">
                  {i + 1}
                </span>
                <p className="text-sm text-[#888888] pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
          <p className="text-xs text-yellow-400/80 leading-relaxed">
            <strong>Notice:</strong> Always respect content creators&apos; rights and
            copyright. Only download reels you have permission to use.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
