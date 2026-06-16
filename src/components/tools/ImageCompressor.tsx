'use client';

import { useState, useRef, useCallback } from 'react';
import { Image, Upload, Download, Trash2, ImageIcon } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'How does image compression work?',
    answer:
      'This tool uses the browser Canvas API to re-encode your image at a lower quality setting. The image is drawn onto an HTML5 Canvas element and then exported as JPEG with your chosen quality level, reducing file size while maintaining acceptable visual quality.',
  },
  {
    question: 'Is my image uploaded to a server?',
    answer:
      'No, all image processing happens entirely in your browser using the Canvas API. Your images are never uploaded to any server, and no data leaves your device.',
  },
  {
    question: 'What image formats are supported?',
    answer:
      'This tool supports JPEG, PNG, and WebP image formats. You can compress any of these formats, and the output will be in JPEG format for better compression.',
  },
];

const relatedTools = [
  {
    name: 'Password Generator',
    hash: '/tools/password-generator',
    description: 'Create strong, secure passwords easily.',
  },
  {
    name: 'Word Counter',
    hash: '/tools/word-counter',
    description: 'Count words, characters, and more.',
  },
  {
    name: 'YouTube Thumbnail',
    hash: '/tools/youtube-thumbnail',
    description: 'Download YouTube video thumbnails easily.',
  },
];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

interface ImageCompressorProps {
  onNavigate: (hash: string) => void;
}

export default function ImageCompressor({ onNavigate }: ImageCompressorProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = useCallback(
    (file: File, q: number) => {
      setIsCompressing(true);
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsCompressing(false);
          return;
        }

        ctx.drawImage(img, 0, 0);

        const outputType = 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputType, q / 100);

        setCompressedUrl(dataUrl);

        const base64Length = dataUrl.split(',')[1].length;
        const sizeInBytes = Math.round((base64Length * 3) / 4);
        setCompressedSize(sizeInBytes);
        setIsCompressing(false);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        setIsCompressing(false);
      };
      img.src = objectUrl;
    },
    []
  );

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        return;
      }

      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);

      const url = URL.createObjectURL(file);
      setOriginalFile(file);
      setOriginalUrl(url);
      setOriginalSize(file.size);
      setCompressedUrl('');
      setCompressedSize(0);

      compressImage(file, quality);
    },
    [quality, originalUrl, compressedUrl, compressImage]
  );

  const handleQualityChange = useCallback(
    (value: number[]) => {
      const newQuality = value[0];
      setQuality(newQuality);
      if (originalFile) {
        compressImage(originalFile, newQuality);
      }
    },
    [originalFile, compressImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDownload = useCallback(() => {
    if (!compressedUrl) return;
    const link = document.createElement('a');
    link.href = compressedUrl;
    link.download = `compressed_${originalFile?.name?.replace(/\.[^.]+$/, '.jpg') || 'image.jpg'}`;
    link.click();
  }, [compressedUrl, originalFile]);

  const handleReset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setOriginalFile(null);
    setOriginalUrl('');
    setCompressedUrl('');
    setOriginalSize(0);
    setCompressedSize(0);
    setQuality(80);
  }, [originalUrl, compressedUrl]);

  const savings =
    originalSize > 0 && compressedSize > 0
      ? Math.round((1 - compressedSize / originalSize) * 100)
      : 0;

  return (
    <ToolLayout
      title="Image Compressor"
      description="Compress images directly in your browser. No uploads, no servers — your images stay private. Adjust quality and download the compressed result."
      icon={Image}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
      seoContent={`
        <h2>Free Online Image Compressor — Reduce Image File Size Without Losing Quality</h2>
        <p>Large image files are one of the biggest contributors to slow website performance. Our free online image compressor lets you reduce the file size of JPEG, PNG, and WebP images directly in your browser, with no uploads to external servers. Simply drag and drop your image, adjust the quality slider, and download the compressed result — all in seconds.</p>
        <h3>Why Image Compression Matters for Web Performance</h3>
        <p>Page load speed is a critical factor for both user experience and search engine rankings. Google's Core Web Vitals initiative specifically measures Largest Contentful Paint (LCP), which is heavily influenced by image loading times. Unoptimized images can add hundreds of kilobytes or even megabytes to a page, dramatically increasing load times especially on mobile networks. By compressing images before uploading them to your website, you can reduce page weight by 40–70% while maintaining visual quality that is virtually indistinguishable from the original.</p>
        <h3>JPEG, PNG, and WebP Optimization</h3>
        <p>Each image format has different compression characteristics. JPEG uses lossy compression and works best for photographs and complex images with many colors. PNG uses lossless compression and is ideal for graphics, logos, and images with transparency. WebP is a modern format developed by Google that provides superior lossy and lossless compression — WebP files are typically 25–35% smaller than equivalent JPEGs with comparable quality. Our tool outputs compressed JPEG format, which offers the best balance of quality and file size for most web use cases.</p>
        <h3>Key Features</h3>
        <ul>
          <li>Client-side compression using the HTML5 Canvas API — your images never leave your device</li>
          <li>Adjustable quality slider from 1% to 100% for precise control over the quality-to-size ratio</li>
          <li>Side-by-side comparison of original and compressed images with file size savings displayed</li>
          <li>Support for JPEG, PNG, and WebP input formats</li>
          <li>One-click download of the compressed image</li>
          <li>No watermarks, no file limits, no registration required</li>
        </ul>
        <h3>Tips for Best Compression Results</h3>
        <ul>
          <li>For photographs, a quality setting of 70–85% typically produces excellent results with significant file size reduction</li>
          <li>For graphics and screenshots, try 80–95% quality to preserve sharp edges and text clarity</li>
          <li>Consider converting PNG graphics to JPEG format when transparency is not needed for additional savings</li>
          <li>For maximum web performance, pair compression with proper image dimensions — resize large images before compressing</li>
        </ul>
      `}
    >
      <div className="space-y-6">
        {!originalFile ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-16 cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-[#8A2BE2] bg-[#8A2BE2]/5'
                : 'border-[#222222] hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5'
            }`}
          >
            <Upload
              className={`h-14 w-14 mb-4 ${
                isDragging ? 'text-[#8A2BE2]' : 'text-[#555555]'
              }`}
            />
            <p className="text-lg font-semibold text-white mb-1">
              Drop your image here
            </p>
            <p className="text-sm text-[#888888]">
              or click to browse &middot; JPEG, PNG, WebP
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>
        ) : (
          <>
            {/* Quality Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-white">
                  Quality
                </Label>
                <span className="text-sm font-mono text-[#8A2BE2] font-bold">
                  {quality}%
                </span>
              </div>
              <Slider
                value={[quality]}
                min={1}
                max={100}
                step={1}
                onValueChange={handleQualityChange}
                className="w-full"
                disabled={isCompressing}
              />
            </div>

            {/* Preview Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Original */}
              <div className="rounded-xl bg-black/30 border border-[#1a1a1a] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white">
                    Original
                  </span>
                  <span className="text-xs text-[#888888]">
                    {formatFileSize(originalSize)}
                  </span>
                </div>
                <div className="aspect-video rounded-lg overflow-hidden bg-black/30 flex items-center justify-center">
                  <img
                    src={originalUrl}
                    alt="Original"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

              {/* Compressed */}
              <div className="rounded-xl bg-black/30 border border-[#1a1a1a] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white">
                    Compressed
                  </span>
                  <span className="text-xs text-[#888888]">
                    {compressedSize > 0 ? formatFileSize(compressedSize) : '...'}
                  </span>
                </div>
                <div className="aspect-video rounded-lg overflow-hidden bg-black/30 flex items-center justify-center">
                  {compressedUrl ? (
                    <img
                      src={compressedUrl}
                      alt="Compressed"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-[#333333]" />
                  )}
                </div>
              </div>
            </div>

            {/* Stats & Actions */}
            {compressedSize > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-black/30 border border-[#1a1a1a]">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-[#888888]">Savings</p>
                    <p
                      className={`text-xl font-bold ${
                        savings > 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {savings > 0 ? '-' : '+'}
                      {Math.abs(savings)}%
                    </p>
                  </div>
                  <div className="h-10 w-px bg-[#222222]" />
                  <div className="text-center">
                    <p className="text-xs text-[#888888]">Original</p>
                    <p className="text-sm font-semibold text-white">
                      {formatFileSize(originalSize)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#888888]">Compressed</p>
                    <p className="text-sm font-semibold text-white">
                      {formatFileSize(compressedSize)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleDownload}
                    className="cta-primary"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    <span>Download</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="border-[#222222] text-white hover:border-[#8A2BE2]/50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
