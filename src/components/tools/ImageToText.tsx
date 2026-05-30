'use client';

import { useState, useCallback } from 'react';
import { ScanText, Upload, Copy, Check, Download, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

/* ─── FAQ Items ─── */
const faqItems = [
  {
    question: 'What is OCR (Optical Character Recognition)?',
    answer:
      'OCR is a technology that converts images of text into machine-readable text. It analyzes the shapes and patterns in an image to identify letters, numbers, and symbols, then outputs the recognized text that you can edit, search, and copy.',
  },
  {
    question: 'What image formats are supported?',
    answer:
      'Our OCR tool supports common image formats including JPEG, PNG, WebP, BMP, and GIF. For best results, use high-resolution images with clear, printed text on a clean background.',
  },
  {
    question: 'How accurate is the OCR?',
    answer:
      'Accuracy depends on image quality, text clarity, and language. Printed text on a clean background typically achieves 95-99% accuracy. Handwritten text, blurry images, or complex backgrounds may reduce accuracy. For best results, ensure good lighting and minimal distortion.',
  },
  {
    question: 'Is my image data sent to a server?',
    answer:
      'No. Our OCR tool processes everything directly in your browser using Tesseract.js. Your images never leave your device, ensuring complete privacy and security. No data is uploaded to any server.',
  },
  {
    question: 'Which languages are supported?',
    answer:
      'The tool primarily supports English text recognition. Tesseract.js supports over 100 languages, but we load English by default for faster processing. The recognition works best with printed, clear text in the supported language.',
  },
];

/* ─── Related Tools ─── */
const relatedTools = [
  {
    name: 'Image Compressor',
    hash: '#/tools/image-compressor',
    description: 'Compress images before OCR for faster processing.',
  },
  {
    name: 'Image Resizer',
    hash: '#/tools/image-resizer',
    description: 'Resize images to improve OCR accuracy.',
  },
  {
    name: 'Word Counter',
    hash: '#/tools/word-counter',
    description: 'Count words and characters in extracted text.',
  },
];

/* ─── Component ─── */
interface ImageToTextProps {
  onNavigate: (hash: string) => void;
}

export default function ImageToText({ onNavigate }: ImageToTextProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);

  /* Handle file selection */
  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, WebP, BMP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setExtractedText('');
      setConfidence(null);
    };
    reader.readAsDataURL(file);
  }, []);

  /* Process image with Tesseract.js */
  const processImage = useCallback(async () => {
    if (!imagePreview) {
      toast.error('Please upload an image first');
      return;
    }

    setIsProcessing(true);
    setExtractedText('');
    setConfidence(null);

    try {
      const Tesseract = await import('tesseract.js');
      const result = await Tesseract.recognize(imagePreview, 'eng', {
        logger: () => {},
      });

      setExtractedText(result.data.text);
      setConfidence(result.data.confidence);
      toast.success('Text extracted successfully!');
    } catch (error) {
      console.error('OCR Error:', error);
      toast.error('Failed to extract text. Please try a clearer image.');
    } finally {
      setIsProcessing(false);
    }
  }, [imagePreview]);

  /* Copy extracted text */
  const handleCopy = useCallback(async () => {
    if (!extractedText.trim()) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      toast.success('Text copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy text');
    }
  }, [extractedText]);

  /* Download extracted text */
  const handleDownload = useCallback(() => {
    if (!extractedText.trim()) return;
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Text downloaded!');
  }, [extractedText]);

  /* Reset everything */
  const handleReset = useCallback(() => {
    setImagePreview(null);
    setExtractedText('');
    setConfidence(null);
  }, []);

  return (
    <ToolLayout
      title="Image to Text (OCR)"
      description="Extract text from images using OCR technology. Upload a photo and get editable text instantly."
      icon={ScanText}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {/* Upload Area */}
        {!imagePreview ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFileSelect(file);
            }}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-[#8A2BE2] bg-[#8A2BE2]/5'
                : 'border-[#222222] hover:border-[#8A2BE2]/50 bg-black/20'
            }`}
          >
            <Upload className="h-12 w-12 text-[#555555] mx-auto mb-4" />
            <p className="text-white font-semibold mb-2">
              Drop your image here or click to upload
            </p>
            <p className="text-sm text-[#555555] mb-6">
              Supports JPEG, PNG, WebP, BMP (Max 10MB)
            </p>
            <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl cta-primary text-white text-sm font-semibold cursor-pointer">
              <Upload className="h-4 w-4" />
              Choose Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative rounded-xl overflow-hidden border border-[#1a1a1a]">
              <img
                src={imagePreview}
                alt="Uploaded image for OCR"
                className="w-full max-h-80 object-contain bg-black/40"
              />
              <button
                onClick={handleReset}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/70 text-white text-xs font-medium hover:bg-black/90 transition-colors"
              >
                Change Image
              </button>
            </div>

            {/* Extract Button */}
            <Button
              onClick={processImage}
              disabled={isProcessing}
              className="w-full h-12 text-base font-semibold cta-primary"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Extracting Text...
                </>
              ) : (
                <>
                  <ScanText className="h-4 w-4 mr-2" />
                  Extract Text
                </>
              )}
            </Button>

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="p-4 rounded-xl bg-[#8A2BE2]/5 border border-[#8A2BE2]/20">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 text-[#8A2BE2] animate-spin" />
                  <div>
                    <p className="text-sm font-medium text-white">Processing your image...</p>
                    <p className="text-xs text-[#888888]">This may take 10-30 seconds depending on image complexity</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {extractedText && (
          <div className="space-y-4">
            {/* Confidence Score */}
            {confidence !== null && (
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                confidence > 70
                  ? 'bg-green-500/5 border-green-500/20'
                  : confidence > 40
                    ? 'bg-yellow-500/5 border-yellow-500/20'
                    : 'bg-red-500/5 border-red-500/20'
              }`}>
                <AlertCircle className={`h-5 w-5 ${
                  confidence > 70 ? 'text-green-400' : confidence > 40 ? 'text-yellow-400' : 'text-red-400'
                }`} />
                <div>
                  <p className="text-sm font-medium text-white">
                    Confidence: {confidence.toFixed(1)}%
                  </p>
                  <p className="text-xs text-[#888888]">
                    {confidence > 70
                      ? 'High confidence - text is likely accurate'
                      : confidence > 40
                        ? 'Medium confidence - please review extracted text'
                        : 'Low confidence - image quality may be poor'}
                  </p>
                </div>
              </div>
            )}

            {/* Extracted Text */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white">Extracted Text</label>
                <span className="text-xs text-[#555555]">
                  {extractedText.length} characters
                </span>
              </div>
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                rows={10}
                className="w-full rounded-xl bg-black/40 border border-[#222222] px-4 py-3 text-white text-sm leading-relaxed resize-y focus:outline-none focus:border-[#8A2BE2]/50 focus:ring-1 focus:ring-[#8A2BE2]/20 transition-all placeholder:text-[#444444]"
                placeholder="Extracted text will appear here..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleCopy}
                disabled={!extractedText.trim()}
                className="flex-1 h-11 cta-primary font-semibold"
                size="lg"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Text
                  </>
                )}
              </Button>
              <Button
                onClick={handleDownload}
                disabled={!extractedText.trim()}
                variant="outline"
                className="h-11 px-5 border-[#222222] text-[#AAAAAA] hover:text-white hover:border-[#8A2BE2]/40 hover:bg-white/5 transition-all"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
