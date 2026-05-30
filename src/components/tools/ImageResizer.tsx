'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Scale, Upload, Download, Trash2, Lock, Unlock, ImageIcon } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'Will resizing reduce my image quality?',
    answer:
      'Resizing an image to a smaller dimension will reduce the amount of detail, as pixels are merged together. However, when upsizing, the Canvas API uses bilinear interpolation to smooth the result. You can control the output quality using the quality slider, which affects JPEG and WebP compression.',
  },
  {
    question: 'How does the aspect ratio lock work?',
    answer:
      'When the aspect ratio lock is enabled (lock icon), changing either the width or height will automatically adjust the other dimension to maintain the original image proportions. This prevents stretching or distortion. Disable the lock to set custom dimensions independently.',
  },
  {
    question: 'What output formats are supported?',
    answer:
      'You can export resized images in three formats: PNG (lossless, best for graphics with transparency), JPEG (lossy, best for photos, smallest file size), and WebP (modern format with excellent compression and quality). Choose the format that best suits your needs.',
  },
  {
    question: 'What is the maximum image size I can resize?',
    answer:
      'The maximum size depends on your browser and device memory. Most modern browsers support canvas dimensions up to 16,384 x 16,384 pixels. Very large images may cause performance issues on devices with limited RAM. For best results, work with images under 8,000 x 8,000 pixels.',
  },
  {
    question: 'Are my images uploaded to a server?',
    answer:
      'No, all image processing happens entirely in your browser using the HTML5 Canvas API. Your images never leave your device, ensuring complete privacy and fast processing.',
  },
];

const relatedTools = [
  {
    name: 'Image Compressor',
    hash: '#/tools/image-compressor',
    description: 'Compress images without losing quality.',
  },
  {
    name: 'Image to PDF',
    hash: '#/tools/image-to-pdf',
    description: 'Convert images to PDF documents.',
  },
  {
    name: 'Background Remover',
    hash: '#/tools/background-remover',
    description: 'Remove image backgrounds instantly.',
  },
];

const PRESETS = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Facebook Cover', width: 820, height: 312 },
  { name: 'Twitter Header', width: 1500, height: 500 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
];

const OUTPUT_FORMATS = [
  { value: 'image/png', label: 'PNG' },
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'image/webp', label: 'WebP' },
];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

interface ImageResizerProps {
  onNavigate: (hash: string) => void;
}

export default function ImageResizer({ onNavigate }: ImageResizerProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [quality, setQuality] = useState(90);
  const [outputFormat, setOutputFormat] = useState('image/png');
  const [resizedUrl, setResizedUrl] = useState<string>('');
  const [resizedSize, setResizedSize] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const aspectRatioRef = useRef(1);

  // Resize image whenever parameters change
  useEffect(() => {
    if (!originalUrl || width === 0 || height === 0) return;

    const timer = setTimeout(() => {
      setIsResizing(true);
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsResizing(false);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const q = outputFormat === 'image/png' ? undefined : quality / 100;
        const dataUrl = canvas.toDataURL(outputFormat, q);

        setResizedUrl(dataUrl);
        const base64Length = dataUrl.split(',')[1].length;
        const sizeInBytes = Math.round((base64Length * 3) / 4);
        setResizedSize(sizeInBytes);
        setIsResizing(false);
      };
      img.onerror = () => {
        setIsResizing(false);
      };
      img.src = originalUrl;
    }, 300);

    return () => clearTimeout(timer);
  }, [originalUrl, width, height, quality, outputFormat]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);

    const url = URL.createObjectURL(file);
    setOriginalFile(file);
    setOriginalUrl(url);

    const img = new window.Image();
    img.onload = () => {
      setOriginalWidth(img.naturalWidth);
      setOriginalHeight(img.naturalHeight);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      aspectRatioRef.current = img.naturalWidth / img.naturalHeight;
    };
    img.src = url;
    setResizedUrl('');
    setResizedSize(0);
  }, [originalUrl, resizedUrl]);

  const handleWidthChange = (value: string) => {
    const w = parseInt(value) || 0;
    setWidth(w);
    if (lockAspect && w > 0) {
      setHeight(Math.round(w / aspectRatioRef.current));
    }
  };

  const handleHeightChange = (value: string) => {
    const h = parseInt(value) || 0;
    setHeight(h);
    if (lockAspect && h > 0) {
      setWidth(Math.round(h * aspectRatioRef.current));
    }
  };

  const applyPreset = (preset: { width: number; height: number }) => {
    setWidth(preset.width);
    setHeight(preset.height);
    setLockAspect(false);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDownload = useCallback(() => {
    if (!resizedUrl) return;
    const ext = outputFormat === 'image/png' ? 'png' : outputFormat === 'image/jpeg' ? 'jpg' : 'webp';
    const link = document.createElement('a');
    link.href = resizedUrl;
    link.download = `resized_${width}x${height}.${ext}`;
    link.click();
  }, [resizedUrl, outputFormat, width, height]);

  const handleReset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    setOriginalFile(null);
    setOriginalUrl('');
    setOriginalWidth(0);
    setOriginalHeight(0);
    setWidth(0);
    setHeight(0);
    setLockAspect(true);
    setResizedUrl('');
    setResizedSize(0);
    setQuality(90);
    setOutputFormat('image/png');
  }, [originalUrl, resizedUrl]);

  return (
    <ToolLayout
      title="Image Resizer"
      description="Resize your images to any dimension directly in your browser. Upload an image, set custom width and height, and download the resized version. Maintain aspect ratio or stretch to exact dimensions — all processing happens locally for maximum speed and privacy."
      icon={Scale}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {!originalFile ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-16 cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-[#8A2BE2] bg-[#8A2BE2]/5'
                : 'border-[#222222] hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5'
            }`}
          >
            <Upload className={`h-14 w-14 mb-4 ${isDragging ? 'text-[#8A2BE2]' : 'text-[#555555]'}`} />
            <p className="text-lg font-semibold text-white mb-1">Drop your image here</p>
            <p className="text-sm text-[#888888]">or click to browse · JPEG, PNG, WebP</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>
        ) : (
          <>
            {/* Original Info */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-5 w-5 text-[#8A2BE2]" />
                <div>
                  <p className="text-sm font-medium text-white">{originalFile?.name}</p>
                  <p className="text-xs text-[#888888]">
                    {originalWidth} × {originalHeight}px · {formatFileSize(originalFile?.size || 0)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-[#888888] hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Dimension Inputs */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
              <div>
                <Label className="text-sm font-medium text-white mb-2 block">Width (px)</Label>
                <Input
                  type="number"
                  value={width || ''}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  min={1}
                  max={16384}
                  className="bg-black/40 border-[#222222] text-white focus:border-[#8A2BE2]/50"
                />
              </div>
              <button
                onClick={() => setLockAspect(!lockAspect)}
                className={`mb-0.5 p-2 rounded-lg transition-all duration-300 ${
                  lockAspect
                    ? 'text-[#8A2BE2] bg-[#8A2BE2]/10 border border-[#8A2BE2]/20'
                    : 'text-[#555555] bg-black/20 border border-[#1a1a1a] hover:border-[#8A2BE2]/30'
                }`}
                aria-label={lockAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                title={lockAspect ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
              >
                {lockAspect ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              </button>
              <div>
                <Label className="text-sm font-medium text-white mb-2 block">Height (px)</Label>
                <Input
                  type="number"
                  value={height || ''}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  min={1}
                  max={16384}
                  className="bg-black/40 border-[#222222] text-white focus:border-[#8A2BE2]/50"
                />
              </div>
            </div>

            {/* Preset Sizes */}
            <div>
              <Label className="text-sm font-medium text-white mb-3 block">Preset Sizes</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                      width === preset.width && height === preset.height
                        ? 'bg-[#8A2BE2]/10 border-[#8A2BE2]/30'
                        : 'bg-black/20 border-[#1a1a1a] hover:border-[#8A2BE2]/30'
                    }`}
                  >
                    <p className="text-xs font-medium text-white">{preset.name}</p>
                    <p className="text-[10px] text-[#888888]">{preset.width}×{preset.height}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Output Format & Quality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-white mb-2 block">Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger className="w-full bg-black/40 border border-[#222222] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-[#222222]">
                    {OUTPUT_FORMATS.map((fmt) => (
                      <SelectItem key={fmt.value} value={fmt.value}>
                        {fmt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-white">Quality</Label>
                  <span className="text-sm font-mono text-[#8A2BE2] font-bold">{quality}%</span>
                </div>
                <Slider
                  value={[quality]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(v) => setQuality(v[0])}
                  disabled={outputFormat === 'image/png'}
                  className="w-full"
                />
                {outputFormat === 'image/png' && (
                  <p className="text-[10px] text-[#555555] mt-1">PNG is lossless — quality setting not applicable</p>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-xl bg-black/30 border border-[#1a1a1a] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">Preview</span>
                {resizedSize > 0 && (
                  <span className="text-xs text-[#888888]">
                    {width} × {height}px · {formatFileSize(resizedSize)}
                  </span>
                )}
              </div>
              <div className="aspect-video rounded-lg overflow-hidden bg-black/30 flex items-center justify-center relative">
                {isResizing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <div className="h-6 w-6 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {resizedUrl ? (
                  <img
                    src={resizedUrl}
                    alt="Resized preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-[#333333]" />
                )}
              </div>
            </div>

            {/* Download Button */}
            <div className="flex gap-3">
              <Button
                onClick={handleDownload}
                disabled={!resizedUrl || isResizing}
                className="flex-1 cta-primary h-12"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Resized Image
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-[#222222] text-white hover:border-red-400/50 hover:bg-red-400/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
