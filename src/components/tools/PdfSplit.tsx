'use client';

import { useState, useRef, useCallback } from 'react';
import { Scissors, Upload, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'How does PDF splitting work?',
    answer:
      'This tool uses the pdf-lib library to load your PDF and extract only the pages you specify. It reads the original PDF document, copies the selected pages into a brand-new PDF, and saves it for download. All processing happens entirely in your browser — your file is never uploaded to any server.',
  },
  {
    question: 'What page number formats are supported?',
    answer:
      'You can specify pages using individual numbers, ranges, or a combination of both. Examples: "1,3,5" extracts pages 1, 3, and 5. "1-5" extracts pages 1 through 5. "1,3,5-8" extracts pages 1, 3, and 5 through 8. Pages are separated by commas and ranges use hyphens.',
  },
  {
    question: 'Is my PDF file secure when using this tool?',
    answer:
      'Absolutely. All processing happens client-side in your browser using JavaScript. Your PDF file never leaves your device — it is not uploaded to any server. Once you close the page, all file data is cleared from memory. Your documents remain completely private.',
  },
  {
    question: 'Can I split password-protected PDFs?',
    answer:
      'This tool can handle some password-protected PDFs if the protection allows opening the file. However, PDFs with strict DRM or owner-level password protection that prevents copying content may not be processable. For best results, remove password protection before splitting.',
  },
  {
    question: 'Will splitting my PDF reduce the quality?',
    answer:
      'No. The pdf-lib library copies pages exactly as they are in the original document — no re-encoding, compression, or quality loss occurs. The extracted pages in the new PDF are byte-for-byte identical to the originals. Text, images, vectors, and annotations are all preserved perfectly.',
  },
];

const relatedTools = [
  {
    name: 'PDF Merge',
    hash: '#/tools/pdf-merge',
    description: 'Combine multiple PDFs into a single document.',
  },
  {
    name: 'PDF Rotate',
    hash: '#/tools/pdf-rotate',
    description: 'Rotate PDF pages to any orientation.',
  },
  {
    name: 'PDF Compress',
    hash: '#/tools/pdf-compress',
    description: 'Reduce PDF file size while preserving quality.',
  },
];

interface PdfSplitProps {
  onNavigate: (hash: string) => void;
}

export default function PdfSplit({ onNavigate }: PdfSplitProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageSelection, setPageSelection] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPdf = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please upload a valid PDF file');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const count = pdf.getPageCount();

      setPdfFile(file);
      setPageCount(count);
      setPageSelection(`1-${count}`);
      toast.success(`PDF loaded — ${count} page${count !== 1 ? 's' : ''} detected`);
    } catch (error) {
      console.error('PDF load error:', error);
      toast.error('Failed to load PDF. The file may be corrupted or encrypted.');
    }
  }, []);

  const parsePageNumbers = useCallback(
    (input: string, maxPages: number): number[] => {
      const pages = new Set<number>();
      const trimmed = input.trim();

      if (!trimmed) return [];

      const parts = trimmed.split(',');

      for (const part of parts) {
        const cleaned = part.trim();
        if (!cleaned) continue;

        if (cleaned.includes('-')) {
          const [startStr, endStr] = cleaned.split('-');
          const start = parseInt(startStr.trim(), 10);
          const end = parseInt(endStr.trim(), 10);

          if (isNaN(start) || isNaN(end)) {
            throw new Error(`Invalid range: "${cleaned}"`);
          }
          if (start < 1 || end > maxPages) {
            throw new Error(
              `Page range ${start}-${end} is out of bounds (1-${maxPages})`
            );
          }
          if (start > end) {
            throw new Error(
              `Invalid range: start (${start}) is greater than end (${end})`
            );
          }

          for (let i = start; i <= end; i++) {
            pages.add(i);
          }
        } else {
          const num = parseInt(cleaned, 10);
          if (isNaN(num)) {
            throw new Error(`Invalid page number: "${cleaned}"`);
          }
          if (num < 1 || num > maxPages) {
            throw new Error(
              `Page ${num} is out of bounds (1-${maxPages})`
            );
          }
          pages.add(num);
        }
      }

      return Array.from(pages).sort((a, b) => a - b);
    },
    []
  );

  const splitPdf = useCallback(async () => {
    if (!pdfFile) {
      toast.error('Please upload a PDF file first');
      return;
    }

    if (!pageSelection.trim()) {
      toast.error('Please enter the pages you want to extract');
      return;
    }

    setIsProcessing(true);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      const pageNumbers = parsePageNumbers(pageSelection, pageCount);
      if (pageNumbers.length === 0) {
        toast.error('No valid pages specified');
        setIsProcessing(false);
        return;
      }

      // Convert 1-based page numbers to 0-based indices
      const pageIndices = pageNumbers.map((p) => p - 1);

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();

      // Create download link
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const originalName = pdfFile.name.replace(/\.pdf$/i, '');
      link.href = url;
      link.download = `${originalName}_pages_${pageSelection.replace(/\s/g, '')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(
        `Extracted ${pageNumbers.length} page${pageNumbers.length !== 1 ? 's' : ''} successfully!`
      );
    } catch (error) {
      console.error('PDF split error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to split PDF. Please check your page selection and try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFile, pageSelection, pageCount, parsePageNumbers]);

  const reset = useCallback(() => {
    setPdfFile(null);
    setPageCount(0);
    setPageSelection('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('PDF removed');
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) loadPdf(file);
    },
    [loadPdf]
  );

  return (
    <ToolLayout
      title="PDF Split"
      description="Extract specific pages from your PDF documents instantly in your browser. Select which pages to keep by entering page numbers or ranges, and download a new PDF with only the pages you need. No upload to servers — everything processes locally on your device for maximum privacy."
      icon={Scissors}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {!pdfFile ? (
          /* Upload Area */
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-16 cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-[#8A2BE2]/60 bg-[#8A2BE2]/10'
                : 'border-[#222222] hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5'
            }`}
          >
            <Upload className="h-12 w-12 text-[#555555] mb-3" />
            <p className="text-base font-semibold text-white mb-1">
              Drop a PDF here or click to browse
            </p>
            <p className="text-sm text-[#888888]">PDF files only</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) loadPdf(file);
              }}
            />
          </div>
        ) : (
          <>
            {/* File Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-black/40 border border-[#1a1a1a]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 shrink-0">
                  <Scissors className="h-5 w-5 text-[#8A2BE2]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {pdfFile.name}
                  </p>
                  <p className="text-xs text-[#888888]">
                    {pageCount} page{pageCount !== 1 ? 's' : ''} &middot; {(pdfFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={reset}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10 shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Remove
              </Button>
            </div>

            {/* Page Selection */}
            <div className="space-y-3">
              <Label htmlFor="page-selection" className="text-sm font-medium text-white">
                Pages to Extract
              </Label>
              <Input
                id="page-selection"
                type="text"
                value={pageSelection}
                onChange={(e) => setPageSelection(e.target.value)}
                placeholder="e.g., 1,3,5-8"
                className="bg-black/40 border-[#222222] text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:ring-[#8A2BE2]/20 h-11"
              />
              <p className="text-xs text-[#666666]">
                Enter page numbers separated by commas. Use hyphens for ranges. Example: 1,3,5-8
                extracts pages 1, 3, 5, 6, 7, and 8. Available pages: 1–{pageCount}.
              </p>
            </div>

            {/* Quick Selection Buttons */}
            <div className="space-y-2">
              <Label className="text-xs text-[#888888]">Quick Select</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageSelection(`1-${pageCount}`)}
                  className="border-[#222222] text-[#AAAAAA] hover:border-[#8A2BE2]/50 hover:text-white text-xs"
                >
                  All Pages
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const evenPages = Array.from(
                      { length: Math.floor(pageCount / 2) },
                      (_, i) => (i + 1) * 2
                    ).join(',');
                    setPageSelection(evenPages);
                  }}
                  className="border-[#222222] text-[#AAAAAA] hover:border-[#8A2BE2]/50 hover:text-white text-xs"
                >
                  Even Pages
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const oddPages = Array.from(
                      { length: Math.ceil(pageCount / 2) },
                      (_, i) => i * 2 + 1
                    )
                      .filter((p) => p <= pageCount)
                      .join(',');
                    setPageSelection(oddPages);
                  }}
                  className="border-[#222222] text-[#AAAAAA] hover:border-[#8A2BE2]/50 hover:text-white text-xs"
                >
                  Odd Pages
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageSelection('1')}
                  className="border-[#222222] text-[#AAAAAA] hover:border-[#8A2BE2]/50 hover:text-white text-xs"
                >
                  First Page
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageSelection(`${pageCount}`)}
                  className="border-[#222222] text-[#AAAAAA] hover:border-[#8A2BE2]/50 hover:text-white text-xs"
                >
                  Last Page
                </Button>
              </div>
            </div>

            {/* Page Preview Summary */}
            {pageSelection.trim() && (
              <div className="p-3 rounded-lg bg-[#8A2BE2]/5 border border-[#8A2BE2]/10">
                <p className="text-xs text-[#AAAAAA]">
                  <span className="text-[#8A2BE2] font-semibold">Preview:</span>{' '}
                  {(() => {
                    try {
                      const pages = parsePageNumbers(pageSelection, pageCount);
                      if (pages.length === 0) return 'No valid pages selected';
                      const display =
                        pages.length <= 12
                          ? pages.join(', ')
                          : `${pages.slice(0, 10).join(', ')} ... +${pages.length - 10} more`;
                      return `Will extract ${pages.length} page${pages.length !== 1 ? 's' : ''}: ${display}`;
                    } catch {
                      return 'Invalid page selection — please check your input';
                    }
                  })()}
                </p>
              </div>
            )}

            {/* Split Button */}
            <Button
              onClick={splitPdf}
              disabled={isProcessing || !pageSelection.trim()}
              className="w-full h-12 text-base font-semibold cta-primary"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Extracting Pages...' : 'Extract & Download PDF'}
            </Button>
          </>
        )}

        {/* Loading Indicator */}
        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="h-8 w-8 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-[#AAAAAA]">Extracting selected pages...</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
