'use client';

import { useState, useRef, useCallback } from 'react';
import { FileImage, Upload, Download, Trash2, ChevronUp, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'Is my data secure when converting images to PDF?',
    answer:
      'Absolutely. All image processing happens entirely in your browser using JavaScript. Your images are never uploaded to any server — they stay on your device throughout the entire conversion process. Once you close the page, all data is cleared from memory.',
  },
  {
    question: 'Does converting images to PDF reduce quality?',
    answer:
      'No, this tool embeds your images into the PDF without recompressing them. The original image quality is preserved. Images are scaled to fit the PDF page dimensions while maintaining their aspect ratio, but no lossy compression is applied during the conversion process.',
  },
  {
    question: 'Is there a file size or number limit?',
    answer:
      'There is no hard limit on the number of images you can add. However, very large collections of high-resolution images may consume significant browser memory. For best performance, we recommend converting up to 50 images at a time. Individual image file sizes are limited only by your browser\'s memory.',
  },
  {
    question: 'What image formats are supported?',
    answer:
      'This tool supports all common image formats including JPEG, PNG, WebP, BMP, and GIF. Each image is embedded into a separate page in the PDF document, fitted to the page dimensions while maintaining its aspect ratio. Transparent PNG backgrounds are preserved as white in the PDF.',
  },
  {
    question: 'Can I reorder the images before converting?',
    answer:
      'Yes! You can rearrange the order of your images using the up and down arrow buttons next to each image in the list. The PDF pages will be generated in the exact order shown in the image list. You can also remove individual images before converting.',
  },
];

const relatedTools = [
  {
    name: 'PDF to Image',
    hash: '#/tools/pdf-to-image',
    description: 'Convert PDF pages to image files.',
  },
  {
    name: 'Image Resizer',
    hash: '#/tools/image-resizer',
    description: 'Resize images to any dimension easily.',
  },
  {
    name: 'Image Compressor',
    hash: '#/tools/image-compressor',
    description: 'Compress images without losing quality.',
  },
];

interface ImageItem {
  id: string;
  file: File;
  url: string;
}

interface ImageToPdfProps {
  onNavigate: (hash: string) => void;
}

export default function ImageToPdf({ onNavigate }: ImageToPdfProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImages = useCallback((files: FileList | null) => {
    if (!files) return;
    const newImages: ImageItem[] = [];
    let skipped = 0;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        newImages.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          url: URL.createObjectURL(file),
        });
      } else {
        skipped++;
      }
    });

    if (skipped > 0) {
      toast.warning(`${skipped} file(s) skipped — not valid image format`);
    }
    if (newImages.length > 0) {
      setImages((prev) => [...prev, ...newImages]);
      toast.success(`${newImages.length} image(s) added`);
    }
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.url);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const moveImage = useCallback((index: number, direction: 'up' | 'down') => {
    setImages((prev) => {
      const next = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    toast.info('All images removed');
  }, [images]);

  const convertToPdf = useCallback(async () => {
    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setIsConverting(true);

    try {
      const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage();

        const img = images[i];
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(img.file);
        });

        const image = await new Promise<HTMLImageElement>((resolve, reject) => {
          const el = document.createElement('img');
          el.onload = () => resolve(el);
          el.onerror = reject;
          el.src = dataUrl;
        });

        const imgWidth = image.naturalWidth;
        const imgHeight = image.naturalHeight;
        const ratio = Math.min(usableWidth / imgWidth, usableHeight / imgHeight);
        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;
        const offsetX = margin + (usableWidth - finalWidth) / 2;
        const offsetY = margin + (usableHeight - finalHeight) / 2;

        // Determine format based on file type
        const format = img.file.type === 'image/png' ? 'PNG' : 'JPEG';
        pdf.addImage(dataUrl, format, offsetX, offsetY, finalWidth, finalHeight);
      }

      pdf.save('images-to-pdf.pdf');
      toast.success('PDF generated and downloaded!');
    } catch (error) {
      console.error('PDF conversion error:', error);
      toast.error('Failed to convert images to PDF. Please try again.');
    } finally {
      setIsConverting(false);
    }
  }, [images]);

  return (
    <ToolLayout
      title="Image to PDF Converter"
      description="Convert your images to PDF documents instantly in your browser. Upload multiple images, rearrange them, and download as a single PDF file. No upload to servers — everything processes locally on your device for maximum privacy and speed."
      icon={FileImage}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#222222] hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 p-10 cursor-pointer transition-all duration-300"
        >
          <Upload className="h-12 w-12 text-[#555555] mb-3" />
          <p className="text-base font-semibold text-white mb-1">
            Drop images here or click to browse
          </p>
          <p className="text-sm text-[#888888]">
            JPEG, PNG, WebP, BMP, GIF &middot; Multiple files supported
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addImages(e.target.files)}
          />
        </div>

        {/* Image List */}
        {images.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-white">
                Images ({images.length})
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear All
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  className="flex items-center gap-3 p-2 rounded-xl bg-black/40 border border-[#1a1a1a] group hover:border-[#8A2BE2]/20 transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-black/30 shrink-0">
                    <img
                      src={img.url}
                      alt={img.file.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Name & Size */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{img.file.name}</p>
                    <p className="text-xs text-[#888888]">
                      {(img.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  {/* Order Buttons */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveImage(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                      aria-label="Move up"
                    >
                      <ChevronUp className="h-3.5 w-3.5 text-[#AAAAAA]" />
                    </button>
                    <button
                      onClick={() => moveImage(index, 'down')}
                      disabled={index === images.length - 1}
                      className="p-1 rounded hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-3.5 w-3.5 text-[#AAAAAA]" />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeImage(img.id)}
                    className="p-1.5 rounded-lg hover:bg-red-400/10 text-[#555555] hover:text-red-400 transition-all"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Convert Button */}
        <Button
          onClick={convertToPdf}
          disabled={images.length === 0 || isConverting}
          className="w-full h-12 text-base font-semibold cta-primary"
          size="lg"
        >
          <Download className="h-4 w-4 mr-2" />
          {isConverting ? 'Converting...' : 'Convert to PDF'}
        </Button>
      </div>
    </ToolLayout>
  );
}
