'use client';

import { useState, useRef, useCallback } from 'react';
import { FileDown, Upload, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'How does PDF compression work?',
    answer:
      'This tool uses pdf-lib to re-save your PDF with object streams enabled, which compacts the internal structure by combining scattered objects into compressed streams. It also strips unused objects and removes metadata (title, author, subject, keywords, producer, creator) that unnecessarily bloats file size. All processing happens entirely in your browser — your file never leaves your device.',
  },
  {
    question: 'Will compression reduce the visual quality of my PDF?',
    answer:
      'No. This tool performs lossless compression — it reorganizes and optimizes the PDF\'s internal structure without altering any page content, images, or text. The visual output remains identical to the original. The size reduction comes from eliminating redundancy, unused objects, and metadata rather than degrading quality.',
  },
  {
    question: 'How much file size reduction can I expect?',
    answer:
      'Results vary depending on the PDF. Documents with lots of unused objects, verbose metadata, or older PDF structures can see 10–60% reduction. PDFs that are already well-optimized may see minimal reduction or even a slight increase due to object stream overhead. PDFs with large embedded images may see smaller savings since image data is already compressed.',
  },
  {
    question: 'Is my PDF data secure?',
    answer:
      'Absolutely. All processing happens client-side in your browser using JavaScript. Your PDF is never uploaded to any server, and no data leaves your device. Once you close the page, all file data is cleared from memory. We take your privacy seriously — that\'s why every tool on this site runs locally.',
  },
  {
    question: 'Are there any file size or page limits?',
    answer:
      'There are no strict limits, but very large PDFs (hundreds of megabytes) may consume significant browser memory during processing. For most documents under 100 MB, compression completes in seconds. If you encounter issues with very large files, try closing other browser tabs to free up memory.',
  },
];

const relatedTools = [
  {
    name: 'PDF Merge',
    hash: '#/tools/pdf-merge',
    description: 'Merge multiple PDFs into a single document.',
  },
  {
    name: 'PDF Split',
    hash: '#/tools/pdf-split',
    description: 'Split a PDF into separate pages or sections.',
  },
  {
    name: 'Image to PDF',
    hash: '#/tools/image-to-pdf',
    description: 'Convert multiple images into a single PDF.',
  },
];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

interface PdfCompressProps {
  onNavigate: (hash: string) => void;
}

export default function PdfCompress({ onNavigate }: PdfCompressProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedBlob, setCompressedBlob] = useState<Uint8Array | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressPdf = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please upload a valid PDF file');
      return;
    }

    setIsCompressing(true);
    setIsDone(false);
    setOriginalFile(file);
    setOriginalSize(file.size);
    setCompressedSize(0);
    setCompressedBlob(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      // Remove metadata to further reduce size
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');

      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
      });

      setCompressedBlob(compressedBytes);
      setCompressedSize(compressedBytes.length);
      setIsDone(true);

      const savings = Math.round((1 - compressedBytes.length / file.size) * 100);
      if (savings > 0) {
        toast.success(`Compressed! Reduced by ${savings}%`);
      } else if (savings === 0) {
        toast.info('PDF is already well-optimized — no further reduction possible');
      } else {
        toast.info('PDF is already well-optimized — re-saving added minimal overhead');
      }
    } catch (error) {
      console.error('PDF compression error:', error);
      toast.error(
        'Failed to compress PDF. The file may be corrupted or use unsupported features.'
      );
    } finally {
      setIsCompressing(false);
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (!compressedBlob || !originalFile) return;

    const blob = new Blob([compressedBlob.buffer as ArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = originalFile.name.replace(/\.pdf$/i, '_compressed.pdf');
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Download started');
  }, [compressedBlob, originalFile]);

  const handleReset = useCallback(() => {
    setOriginalFile(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setCompressedBlob(null);
    setIsDone(false);
    setIsDragging(false);
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      compressPdf(file);
    },
    [compressPdf]
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

  const savings =
    originalSize > 0 && compressedSize > 0
      ? Math.round((1 - compressedSize / originalSize) * 100)
      : 0;

  const sizeDifference =
    originalSize > 0 && compressedSize > 0 ? originalSize - compressedSize : 0;

  return (
    <ToolLayout
      title="PDF Compressor"
      description="Compress PDF files directly in your browser — no uploads, no servers. Reduce file size by stripping unused objects and metadata while preserving all visual content. Your files stay private and never leave your device."
      icon={FileDown}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {!originalFile ? (
          /* Upload Area */
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
              Drop your PDF here
            </p>
            <p className="text-sm text-[#888888]">
              or click to browse &middot; PDF files only
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>
        ) : (
          <>
            {/* File Info & Actions Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20">
                  <FileDown className="h-5 w-5 text-[#8A2BE2]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white truncate max-w-[240px]">
                    {originalFile.name}
                  </p>
                  <p className="text-xs text-[#888888]">
                    Original: {formatFileSize(originalSize)}
                  </p>
                </div>
              </div>
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

            {/* Compressing State */}
            {isCompressing && (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="h-8 w-8 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-[#AAAAAA]">Compressing PDF...</p>
              </div>
            )}

            {/* Results */}
            {isDone && !isCompressing && (
              <>
                {/* Size Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Original */}
                  <div className="rounded-xl bg-black/30 border border-[#1a1a1a] p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">
                        Original
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#222222] text-[#AAAAAA]">
                        Before
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {formatFileSize(originalSize)}
                    </p>
                  </div>

                  {/* Compressed */}
                  <div className="rounded-xl bg-black/30 border border-[#1a1a1a] p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">
                        Compressed
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#8A2BE2]/10 text-[#8A2BE2]">
                        After
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {formatFileSize(compressedSize)}
                    </p>
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-black/30 border border-[#1a1a1a]">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-[#888888]">Savings</p>
                      <p
                        className={`text-xl font-bold ${
                          savings > 0 ? 'text-green-400' : 'text-orange-400'
                        }`}
                      >
                        {savings > 0 ? '-' : '+'}
                        {Math.abs(savings)}%
                      </p>
                    </div>
                    <div className="h-10 w-px bg-[#222222]" />
                    <div className="text-center">
                      <p className="text-xs text-[#888888]">Reduced by</p>
                      <p className="text-sm font-semibold text-white">
                        {sizeDifference > 0
                          ? formatFileSize(sizeDifference)
                          : `+${formatFileSize(Math.abs(sizeDifference))}`}
                      </p>
                    </div>
                    <div className="h-10 w-px bg-[#222222]" />
                    <div className="text-center">
                      <p className="text-xs text-[#888888]">New size</p>
                      <p className="text-sm font-semibold text-[#8A2BE2]">
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
                  </div>
                </div>

                {/* Info message */}
                {savings <= 0 && (
                  <p className="text-xs text-[#666666] text-center">
                    This PDF is already well-optimized. Re-saving with object streams
                    may add slight overhead, but the file structure has been cleaned.
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
