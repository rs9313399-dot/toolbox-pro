'use client';

import { useState, useRef, useCallback } from 'react';
import { Scissors, Upload, Download, Trash2, Pipette, ImageIcon } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'How does the background removal work?',
    answer:
      'This tool uses color thresholding via the Canvas API. It identifies pixels that match the selected background color within a specified tolerance and makes them transparent. This works best with solid-color backgrounds (white, green screen, etc.). For complex backgrounds, consider using an AI-powered service.',
  },
  {
    question: 'What types of images work best?',
    answer:
      'Images with solid, uniform backgrounds work best — such as white backgrounds on product photos or green screen images. The more contrast between the foreground subject and the background color, the better the result. Complex or gradient backgrounds may produce less precise results.',
  },
  {
    question: 'Can I get a transparent background?',
    answer:
      'Yes! The output is always a PNG image with transparency. The removed areas become fully transparent, which you can verify by the checkerboard pattern in the preview. When you download the result, it will have a transparent background.',
  },
  {
    question: 'What does the tolerance slider do?',
    answer:
      'The tolerance slider controls how much color variation is accepted when removing the background. A low tolerance only removes colors very close to your selected color, while a high tolerance removes a broader range of similar colors. Start with a low tolerance and increase it gradually for best results.',
  },
  {
    question: 'Is there an advanced AI-based removal option?',
    answer:
      'This tool uses basic color-based thresholding which works well for simple backgrounds. For advanced AI-powered background removal with complex scenes, you would need to integrate with a dedicated API service. This browser-based approach ensures complete privacy with no server processing.',
  },
];

const relatedTools = [
  {
    name: 'Image Resizer',
    hash: '/tools/image-resizer',
    description: 'Resize images to any dimension.',
  },
  {
    name: 'Image Compressor',
    hash: '/tools/image-compressor',
    description: 'Compress images without losing quality.',
  },
  {
    name: 'Image to PDF',
    hash: '/tools/image-to-pdf',
    description: 'Convert images to PDF documents.',
  },
];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

interface BackgroundRemoverProps {
  onNavigate: (hash: string) => void;
}

export default function BackgroundRemover({ onNavigate }: BackgroundRemoverProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [processedSize, setProcessedSize] = useState(0);
  const [targetColor, setTargetColor] = useState<string>('#ffffff');
  const [tolerance, setTolerance] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageDataRef = useRef<ImageData | null>(null);
  const imageDimensionsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  const processImage = useCallback(
    (imgSrc: string, color: string, tol: number) => {
      setIsProcessing(true);
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        originalImageDataRef.current = imageData;
        imageDimensionsRef.current = { width: canvas.width, height: canvas.height };
        canvasRef.current = canvas;

        const data = imageData.data;

        // Parse target color
        const tr = parseInt(color.slice(1, 3), 16);
        const tg = parseInt(color.slice(3, 5), 16);
        const tb = parseInt(color.slice(5, 7), 16);

        // Max possible color distance is ~441 (sqrt(255^2 * 3))
        // Map tolerance (0-100) to actual distance (0-441)
        const maxDist = 441.67;
        const actualTol = (tol / 100) * maxDist;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const dist = colorDistance(r, g, b, tr, tg, tb);
          if (dist <= actualTol) {
            // Make pixel transparent based on distance
            const alpha = Math.min(255, Math.round((dist / actualTol) * 255));
            data[i + 3] = alpha;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setProcessedUrl(dataUrl);

        const base64Length = dataUrl.split(',')[1].length;
        const sizeInBytes = Math.round((base64Length * 3) / 4);
        setProcessedSize(sizeInBytes);
        setIsProcessing(false);
      };
      img.onerror = () => {
        setIsProcessing(false);
        toast.error('Failed to load image');
      };
      img.src = imgSrc;
    },
    []
  );

  const reprocess = useCallback(
    (color: string, tol: number) => {
      if (!originalImageDataRef.current || !canvasRef.current) return;
      setIsProcessing(true);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clone the original image data
      const clonedData = new ImageData(
        new Uint8ClampedArray(originalImageDataRef.current.data),
        originalImageDataRef.current.width,
        originalImageDataRef.current.height
      );
      const data = clonedData.data;

      const tr = parseInt(color.slice(1, 3), 16);
      const tg = parseInt(color.slice(3, 5), 16);
      const tb = parseInt(color.slice(5, 7), 16);

      const maxDist = 441.67;
      const actualTol = (tol / 100) * maxDist;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const dist = colorDistance(r, g, b, tr, tg, tb);
        if (dist <= actualTol) {
          const alpha = Math.min(255, Math.round((dist / actualTol) * 255));
          data[i + 3] = alpha;
        }
      }

      ctx.putImageData(clonedData, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      setProcessedUrl(dataUrl);

      const base64Length = dataUrl.split(',')[1].length;
      const sizeInBytes = Math.round((base64Length * 3) / 4);
      setProcessedSize(sizeInBytes);
      setIsProcessing(false);
    },
    []
  );

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }

      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (processedUrl) URL.revokeObjectURL(processedUrl);

      const url = URL.createObjectURL(file);
      setOriginalFile(file);
      setOriginalUrl(url);
      setProcessedUrl('');
      setProcessedSize(0);
      setTargetColor('#ffffff');
      setTolerance(30);

      processImage(url, '#ffffff', 30);
    },
    [originalUrl, processedUrl, processImage]
  );

  const handleColorChange = (color: string) => {
    setTargetColor(color);
    if (originalUrl) {
      reprocess(color, tolerance);
    }
  };

  const handleToleranceChange = (value: number[]) => {
    const newTol = value[0];
    setTolerance(newTol);
    if (originalUrl) {
      reprocess(targetColor, newTol);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isPicking || !originalUrl) return;
    
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) * (img.naturalWidth / rect.width));
    const y = Math.round((e.clientY - rect.top) * (img.naturalHeight / rect.height));

    // Read pixel color from the canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Draw the original image back temporarily to read the color
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = imageDimensionsRef.current.width;
        tempCanvas.height = imageDimensionsRef.current.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx && originalImageDataRef.current) {
          tempCtx.putImageData(originalImageDataRef.current, 0, 0);
          const pixel = tempCtx.getImageData(x, y, 1, 1).data;
          const hex = '#' +
            pixel[0].toString(16).padStart(2, '0') +
            pixel[1].toString(16).padStart(2, '0') +
            pixel[2].toString(16).padStart(2, '0');
          setTargetColor(hex);
          reprocess(hex, tolerance);
        }
      }
    }
    setIsPicking(false);
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
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = `no_bg_${originalFile?.name?.replace(/\.[^.]+$/, '.png') || 'image.png'}`;
    link.click();
  }, [processedUrl, originalFile]);

  const handleReset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    setOriginalFile(null);
    setOriginalUrl('');
    setProcessedUrl('');
    setProcessedSize(0);
    setTargetColor('#ffffff');
    setTolerance(30);
    setIsPicking(false);
    canvasRef.current = null;
    originalImageDataRef.current = null;
  }, [originalUrl, processedUrl]);

  return (
    <ToolLayout
      title="Background Remover"
      description="Remove image backgrounds instantly using advanced browser-based processing. Upload any image and get a transparent PNG version. Perfect for creating profile pictures, product photos, and design assets — all processed locally in your browser for complete privacy."
      icon={Scissors}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
      seoContent={`
        <h2>Free Background Remover — Create Transparent PNG Images Online</h2>
        <p>Removing backgrounds from images is essential for creating professional product photos, profile pictures, design assets, and marketing materials. Our free online Background Remover tool lets you eliminate solid-color backgrounds directly in your browser, producing transparent PNG images without uploading your photos to any server. Whether you are an e-commerce seller, graphic designer, or social media manager, this tool saves you time and money on background removal.</p>
        <h3>Why Background Removal Matters for E-Commerce</h3>
        <p>Product photography with clean, consistent backgrounds is a cornerstone of professional e-commerce. Marketplaces like Amazon, eBay, and Shopify recommend or require white backgrounds for product listings. Studies show that products displayed on clean white backgrounds receive higher click-through rates and conversion rates than those with cluttered or distracting backgrounds. Professional background removal services can cost $1-5 per image, but our free tool handles common scenarios instantly — saving businesses significant costs on high-volume product catalogs.</p>
        <h3>How It Works</h3>
        <p>This tool uses color thresholding via the HTML5 Canvas API to identify and remove pixels that match a specified background color within a given tolerance range. It works best with images that have solid, uniform backgrounds — such as white product photography backgrounds, green screen images, or solid-color backdrops. You can select the background color using the color picker, enter a hex code manually, or use the eyedropper tool to click on the image and sample the exact background color. The tolerance slider controls how much color variation is accepted, allowing you to fine-tune the removal for best results.</p>
        <h3>Key Features</h3>
        <ul>
          <li>Remove solid-color backgrounds (white, green screen, any color) with adjustable tolerance</li>
          <li>Eyedropper tool to sample the exact background color from your image</li>
          <li>Real-time preview with checkerboard transparency pattern</li>
          <li>Output as transparent PNG — ready for compositing on any background</li>
          <li>Side-by-side comparison of original and processed images</li>
          <li>Complete client-side processing — your images never leave your device</li>
        </ul>
        <h3>Tips for Best Results</h3>
        <ul>
          <li>Images with solid, uniform backgrounds produce the cleanest results</li>
          <li>Start with a low tolerance and increase gradually to avoid removing parts of your subject</li>
          <li>Use the eyedropper tool to pick the exact background color for most accurate removal</li>
          <li>For complex backgrounds with gradients or patterns, consider using an AI-powered background removal service</li>
        </ul>
      `}
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
            {/* Color Picker & Tolerance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-white mb-2 block">
                  Background Color to Remove
                </Label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={targetColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="h-10 w-14 rounded-lg border border-[#222222] cursor-pointer bg-transparent"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-[#222222]">
                    <span className="text-sm font-mono text-white">{targetColor}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPicking(!isPicking)}
                    className={`shrink-0 ${
                      isPicking
                        ? 'border-[#8A2BE2]/50 bg-[#8A2BE2]/10 text-[#8A2BE2]'
                        : 'border-[#222222] text-white hover:border-[#8A2BE2]/50'
                    }`}
                  >
                    <Pipette className="h-4 w-4 mr-1" />
                    Pick
                  </Button>
                </div>
                {isPicking && (
                  <p className="text-xs text-[#8A2BE2] mt-2">
                    Click on the original image to pick the background color
                  </p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-white">Tolerance</Label>
                  <span className="text-sm font-mono text-[#8A2BE2] font-bold">{tolerance}</span>
                </div>
                <Slider
                  value={[tolerance]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={handleToleranceChange}
                  className="w-full"
                  disabled={isProcessing}
                />
                <p className="text-[10px] text-[#555555] mt-1">
                  Higher = more colors removed
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Original */}
              <div className="rounded-xl bg-black/30 border border-[#1a1a1a] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white">Original</span>
                  <span className="text-xs text-[#888888]">
                    {formatFileSize(originalFile?.size || 0)}
                  </span>
                </div>
                <div
                  className="aspect-video rounded-lg overflow-hidden bg-black/30 flex items-center justify-center cursor-crosshair"
                  style={isPicking ? { cursor: 'crosshair' } : {}}
                >
                  <img
                    src={originalUrl}
                    alt="Original"
                    className="max-w-full max-h-full object-contain"
                    onClick={handleCanvasClick}
                    style={isPicking ? { cursor: 'crosshair' } : {}}
                  />
                </div>
              </div>

              {/* Processed */}
              <div className="rounded-xl bg-black/30 border border-[#1a1a1a] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white">Result</span>
                  <span className="text-xs text-[#888888]">
                    {processedSize > 0 ? formatFileSize(processedSize) : '...'}
                  </span>
                </div>
                <div
                  className="aspect-video rounded-lg overflow-hidden flex items-center justify-center"
                  style={{
                    backgroundImage:
                      'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)',
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
                    backgroundColor: '#222',
                  }}
                >
                  {isProcessing ? (
                    <div className="h-8 w-8 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin" />
                  ) : processedUrl ? (
                    <img
                      src={processedUrl}
                      alt="Processed"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-[#444444]" />
                  )}
                </div>
              </div>
            </div>

            {/* Info note */}
            <div className="p-3 rounded-xl bg-[#8A2BE2]/5 border border-[#8A2BE2]/10">
              <p className="text-xs text-[#AAAAAA]">
                <strong className="text-[#8A2BE2]">Note:</strong> This tool uses basic color thresholding for background removal. 
                It works best with solid-color backgrounds. For complex backgrounds, consider using an AI-powered service.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleDownload}
                disabled={!processedUrl || isProcessing}
                className="flex-1 cta-primary h-12"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PNG
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
