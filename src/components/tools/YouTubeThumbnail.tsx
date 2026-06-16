'use client';

import { useState } from 'react';
import { Youtube, Search, ExternalLink, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'How do I find the YouTube video URL?',
    answer:
      'Copy the URL from your browser\'s address bar when watching a video. It usually looks like "youtube.com/watch?v=..." or "youtu.be/...". You can also right-click on a video and select "Copy video URL".',
  },
  {
    question: 'What thumbnail resolutions are available?',
    answer:
      'YouTube typically provides thumbnails in these resolutions: Default (120x90), Medium (320x180), High (480x360), Standard (640x480), and Max Resolution (1280x720). Not all resolutions are available for every video.',
  },
  {
    question: 'Can I download thumbnails for any video?',
    answer:
      'Yes, you can download thumbnails for any publicly available YouTube video. Private or unlisted videos may not have accessible thumbnails. The thumbnails are provided by YouTube\'s public image servers.',
  },
];

const relatedTools = [
  {
    name: 'Instagram Reel',
    hash: '/tools/instagram-reel',
    description: 'Download Instagram reels easily.',
  },
  {
    name: 'Password Generator',
    hash: '/tools/password-generator',
    description: 'Create strong, secure passwords easily.',
  },
  {
    name: 'Image Compressor',
    hash: '/tools/image-compressor',
    description: 'Compress images without losing quality.',
  },
];

interface ThumbnailInfo {
  label: string;
  url: string;
  width: number;
  height: number;
}

function extractVideoId(url: string): string | null {
  let match = url.match(/[?&]v=([^&#]+)/);
  if (match) return match[1];

  match = url.match(/youtu\.be\/([^?&#]+)/);
  if (match) return match[1];

  match = url.match(/youtube\.com\/shorts\/([^?&#]+)/);
  if (match) return match[1];

  match = url.match(/youtube\.com\/embed\/([^?&#]+)/);
  if (match) return match[1];

  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();

  return null;
}

function getThumbnails(videoId: string): ThumbnailInfo[] {
  return [
    {
      label: 'Max Resolution',
      url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      width: 1280,
      height: 720,
    },
    {
      label: 'Standard',
      url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      width: 640,
      height: 480,
    },
    {
      label: 'High',
      url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      width: 480,
      height: 360,
    },
    {
      label: 'Medium',
      url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      width: 320,
      height: 180,
    },
    {
      label: 'Default',
      url: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      width: 120,
      height: 90,
    },
  ];
}

interface YouTubeThumbnailProps {
  onNavigate: (hash: string) => void;
}

export default function YouTubeThumbnail({ onNavigate }: YouTubeThumbnailProps) {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [thumbnails, setThumbnails] = useState<ThumbnailInfo[]>([]);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleGetThumbnail = () => {
    setError('');
    setThumbnails([]);
    setVideoId(null);
    setFailedImages(new Set());

    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    const id = extractVideoId(url.trim());
    if (!id) {
      setError(
        'Could not parse video ID. Please enter a valid YouTube URL.'
      );
      return;
    }

    setVideoId(id);
    setThumbnails(getThumbnails(id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGetThumbnail();
  };

  const handleOpenImage = (imageUrl: string) => {
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  };

  const handleImageError = (thumbUrl: string) => {
    setFailedImages((prev) => new Set(prev).add(thumbUrl));
  };

  return (
    <ToolLayout
      title="YouTube Thumbnail Downloader"
      description="Download YouTube video thumbnails in multiple resolutions. Just paste the video URL and get all available thumbnail sizes."
      icon={Youtube}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
      seoContent={`
        <h2>YouTube Thumbnail Downloader — Get Any YouTube Video Thumbnail in HD</h2>
        <p>A compelling thumbnail is one of the most important elements of a successful YouTube video. Studies show that 90% of the best-performing videos on YouTube use custom thumbnails. Our free YouTube Thumbnail Downloader lets you instantly grab any publicly available YouTube video thumbnail in multiple resolutions — from the standard 120x90 default up to the full 1280x720 HD max resolution version.</p>
        <h3>Why YouTube Thumbnails Matter for Click-Through Rate</h3>
        <p>YouTube thumbnails are the first thing viewers see when browsing search results, suggested videos, and their subscription feed. A well-designed thumbnail can dramatically increase your click-through rate (CTR), which is one of YouTube's most important ranking signals. Videos with engaging thumbnails consistently outperform those with auto-generated frames. Top creators spend significant time designing thumbnails that feature expressive faces, bold text overlays, vibrant colors, and clear visual storytelling that communicates the video's value at a glance.</p>
        <h3>Available Thumbnail Resolutions</h3>
        <p>YouTube generates several thumbnail resolutions for each video. Not all resolutions are available for every video — the max resolution thumbnail (1280x720) is only generated for videos uploaded in HD. Our tool shows all available sizes and automatically indicates which ones are unavailable for a given video. The standard resolutions include: Max Resolution (1280x720), Standard (640x480), High (480x360), Medium (320x180), and Default (120x90).</p>
        <h3>Key Features</h3>
        <ul>
          <li>Extract thumbnails from any public YouTube video using the URL or video ID</li>
          <li>Supports all YouTube URL formats: standard watch URLs, short links (youtu.be), Shorts, and embed URLs</li>
          <li>Displays all available thumbnail resolutions with dimensions</li>
          <li>One-click open to view the full-size thumbnail image in a new tab</li>
          <li>Shows the video ID for reference and verification</li>
          <li>No registration, no watermarks, completely free to use</li>
        </ul>
        <h3>Thumbnail Design Best Practices</h3>
        <ul>
          <li>Use the 1280x720 (16:9) aspect ratio — this is YouTube's recommended thumbnail dimensions</li>
          <li>Keep file size under 2MB — YouTube's maximum allowed thumbnail size</li>
          <li>Use high contrast colors and large, readable text (minimum 30pt font in your design tool)</li>
          <li>Include a human face with an expressive emotion whenever possible — these generate the highest CTR</li>
          <li>Create a consistent visual style across your channel to build brand recognition</li>
        </ul>
      `}
    >
      <div className="space-y-6">
        {/* URL Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste YouTube URL here (e.g., youtube.com/watch?v=...)"
            className="flex-1 bg-black/40 border-[#222222] h-12 text-white placeholder:text-[#555555] focus:border-[#8A2BE2] transition-colors"
          />
          <Button
            onClick={handleGetThumbnail}
            className="cta-primary h-12 px-6 shrink-0"
            disabled={!url.trim()}
          >
            <Search className="h-4 w-4 mr-2" />
            <span>Get Thumbnail</span>
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {/* Thumbnails Grid */}
        {thumbnails.length > 0 && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-white">
              Available Thumbnails
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {thumbnails.map((thumb) => {
                const isFailed = failedImages.has(thumb.url);
                return (
                  <div
                    key={thumb.label}
                    className={`rounded-xl bg-black/30 border p-4 transition-all duration-300 group ${
                      isFailed
                        ? 'border-[#1a1a1a] opacity-40'
                        : 'border-[#1a1a1a] hover:border-[#8A2BE2]/30'
                    }`}
                  >
                    <div className="aspect-video rounded-lg overflow-hidden bg-black/20 mb-3 relative flex items-center justify-center">
                      {isFailed ? (
                        <div className="text-center">
                          <ImageIcon className="h-8 w-8 text-[#333333] mx-auto mb-1" />
                          <p className="text-[10px] text-[#444444]">Not available</p>
                        </div>
                      ) : (
                        <img
                          src={thumb.url}
                          alt={`${thumb.label} thumbnail`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={() => handleImageError(thumb.url)}
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {thumb.label}
                        </p>
                        <p className="text-xs text-[#888888]">
                          {thumb.width} × {thumb.height}
                        </p>
                      </div>
                      {!isFailed && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenImage(thumb.url)}
                          className="border-[#222222] text-white hover:border-[#8A2BE2]/50 hover:text-[#8A2BE2] transition-all"
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          Open
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Video preview */}
        {videoId && (
          <div className="p-4 rounded-xl bg-black/30 border border-[#1a1a1a]">
            <p className="text-xs text-[#888888] mb-2">
              Video ID: <span className="font-mono text-white">{videoId}</span>
            </p>
            <p className="text-xs text-[#888888]">
              Click &quot;Open&quot; to view the full-size thumbnail in a new tab, then
              right-click and save the image.
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
