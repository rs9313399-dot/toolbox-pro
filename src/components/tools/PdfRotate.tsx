'use client';

import { useState, useRef, useCallback } from 'react';
import { RotateCw, Upload, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PDFDocument, degrees } from 'pdf-lib';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'How does PDF rotation work?',
    answer:
      'This tool uses the pdf-lib library to modify the rotation attribute of each page in your PDF. When you select a rotation angle (90°, 180°, or 270°), it is added to the existing rotation of the page. For example, if a page is already rotated 90° and you apply another 90°, the final rotation will be 180°. All processing happens entirely in your browser — no data is sent to any server.',
  },
  {
    question: 'What is the difference between rotating all pages and specific pages?',
    answer:
      'When you choose "All Pages," every page in the document is rotated by the selected angle. When you choose "Specific Pages," only the pages you list are rotated. You can specify individual pages (e.g., 1, 3, 5) or ranges (e.g., 1-4, 7-10), or a combination of both (e.g., 1, 3-5, 8). This is useful for documents where only certain pages are in the wrong orientation.',
  },
  {
    question: 'Does rotating a PDF affect its quality or content?',
    answer:
      'No. Rotating a PDF page only changes the page\'s rotation metadata — it does not re-render or recompress any content. Text, images, vectors, and all other elements remain exactly as they were, just displayed at the new angle. There is zero quality loss when rotating pages in a PDF.',
  },
  {
    question: 'Can I rotate an encrypted or password-protected PDF?',
    answer:
      'This tool cannot modify encrypted or password-protected PDFs. If your PDF requires a password to open or has editing restrictions, you will need to remove the protection first. Some PDF viewers allow you to print to PDF as a way to create an unprotected copy, which can then be rotated using this tool.',
  },
  {
    question: 'Is there a limit on the number of pages I can rotate?',
    answer:
      'There is no strict page limit. However, very large PDFs (hundreds of pages) may take slightly longer to process and save. Since all processing happens in your browser, the main constraint is your device\'s available memory. For most documents, even those with hundreds of pages, rotation is nearly instantaneous.',
  },
];

const relatedTools = [
  {
    name: 'PDF Merge',
    hash: '#/tools/pdf-merge',
    description: 'Merge multiple PDF files into one document.',
  },
  {
    name: 'PDF Split',
    hash: '#/tools/pdf-split',
    description: 'Split a PDF into separate files or pages.',
  },
  {
    name: 'PDF Watermark',
    hash: '#/tools/pdf-watermark',
    description: 'Add text or image watermarks to PDF files.',
  },
];

const ROTATION_OPTIONS = [
  { value: 90, label: '90° Clockwise' },
  { value: 180, label: '180°' },
  { value: 270, label: '90° Counter-clockwise' },
];

interface PdfRotateProps {
  onNavigate: (hash: string) => void;
}

export default function PdfRotate({ onNavigate }: PdfRotateProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rotationAngle, setRotationAngle] = useState<number>(90);
  const [pageMode, setPageMode] = useState<'all' | 'specific'>('all');
  const [specificPages, setSpecificPages] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState<ArrayBuffer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please upload a valid PDF file');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      setPdfFile(file);
      setPageCount(pages.length);
      setPdfArrayBuffer(arrayBuffer);
      setSpecificPages('');
      setPageMode('all');
      toast.success(`PDF loaded — ${pages.length} page(s) detected`);
    } catch (error) {
      console.error('PDF load error:', error);
      toast.error('Failed to load PDF. The file may be corrupted or encrypted.');
    }
  }, []);

  const parsePageNumbers = useCallback(
    (input: string, total: number): number[] => {
      const pages = new Set<number>();
      const parts = input.split(',').map((s) => s.trim()).filter(Boolean);

      for (const part of parts) {
        if (part.includes('-')) {
          const [startStr, endStr] = part.split('-').map((s) => s.trim());
          const start = parseInt(startStr, 10);
          const end = parseInt(endStr, 10);

          if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > total || end > total) {
            throw new Error(`Invalid page range: "${part}". Pages must be between 1 and ${total}.`);
          }

          const lo = Math.min(start, end);
          const hi = Math.max(start, end);
          for (let i = lo; i <= hi; i++) {
            pages.add(i);
          }
        } else {
          const num = parseInt(part, 10);
          if (isNaN(num) || num < 1 || num > total) {
            throw new Error(`Invalid page number: "${part}". Pages must be between 1 and ${total}.`);
          }
          pages.add(num);
        }
      }

      return Array.from(pages).sort((a, b) => a - b);
    },
    []
  );

  const rotateAndDownload = useCallback(async () => {
    if (!pdfFile || !pdfArrayBuffer) {
      toast.error('No PDF loaded. Please upload a file first.');
      return;
    }

    let targetPages: number[];

    if (pageMode === 'specific') {
      if (!specificPages.trim()) {
        toast.error('Please specify which pages to rotate.');
        return;
      }

      try {
        targetPages = parsePageNumbers(specificPages, pageCount);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Invalid page specification.');
        return;
      }

      if (targetPages.length === 0) {
        toast.error('No valid pages specified.');
        return;
      }
    } else {
      targetPages = Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
      const pages = pdfDoc.getPages();

      const targetSet = new Set(targetPages);

      pages.forEach((page, index) => {
        const pageNum = index + 1;
        if (targetSet.has(pageNum)) {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + rotationAngle));
        }
      });

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfFile.name.replace(/\.pdf$/i, '_rotated.pdf');
      link.click();
      URL.revokeObjectURL(url);

      toast.success(
        `Rotated ${targetPages.length} page(s) by ${rotationAngle}° successfully!`
      );
    } catch (error) {
      console.error('PDF rotation error:', error);
      toast.error('Failed to rotate PDF. The file may be corrupted or encrypted.');
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFile, pdfArrayBuffer, rotationAngle, pageMode, specificPages, pageCount, parsePageNumbers]);

  const reset = useCallback(() => {
    setPdfFile(null);
    setPageCount(0);
    setPdfArrayBuffer(null);
    setSpecificPages('');
    setPageMode('all');
    setRotationAngle(90);
    toast.info('PDF cleared');
  }, []);

  return (
    <ToolLayout
      title="PDF Rotate"
      description="Rotate PDF pages instantly in your browser. Upload any PDF, choose a rotation angle, select which pages to rotate, and download the result. All processing happens locally — your files never leave your device."
      icon={RotateCw}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {!pdfFile ? (
          /* Upload Area */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#222222] hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 p-16 cursor-pointer transition-all duration-300"
          >
            <Upload className="h-12 w-12 text-[#555555] mb-3" />
            <p className="text-base font-semibold text-white mb-1">
              Drop a PDF here or click to browse
            </p>
            <p className="text-sm text-[#888888]">PDF files only</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </div>
        ) : (
          <>
            {/* File Info Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20">
                  <RotateCw className="h-5 w-5 text-[#8A2BE2]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                    {pdfFile.name}
                  </p>
                  <p className="text-xs text-[#888888]">
                    {pageCount} page{pageCount !== 1 ? 's' : ''} &middot; {(pdfFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={reset}
                className="border-[#222222] text-white hover:border-[#8A2BE2]/50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>

            {/* Rotation Angle Selection */}
            <div>
              <Label className="text-sm font-medium text-white mb-3 block">
                Rotation Angle
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {ROTATION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setRotationAngle(option.value)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
                      rotationAngle === option.value
                        ? 'border-[#8A2BE2] bg-[#8A2BE2]/10 text-white'
                        : 'border-[#1a1a1a] bg-black/40 text-[#AAAAAA] hover:border-[#8A2BE2]/30 hover:bg-[#8A2BE2]/5'
                    }`}
                  >
                    <RotateCw
                      className={`h-6 w-6 transition-transform duration-300 ${
                        rotationAngle === option.value ? 'text-[#8A2BE2]' : 'text-[#555555]'
                      }`}
                      style={{
                        transform: `rotate(${option.value === 270 ? -90 : option.value}deg)`,
                      }}
                    />
                    <span className="text-xs font-semibold">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Page Selection Mode */}
            <div>
              <Label className="text-sm font-medium text-white mb-3 block">
                Pages to Rotate
              </Label>
              <div className="flex gap-3 mb-3">
                <button
                  onClick={() => setPageMode('all')}
                  className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all duration-300 ${
                    pageMode === 'all'
                      ? 'border-[#8A2BE2] bg-[#8A2BE2]/10 text-white'
                      : 'border-[#1a1a1a] bg-black/40 text-[#AAAAAA] hover:border-[#8A2BE2]/30'
                  }`}
                >
                  All Pages
                </button>
                <button
                  onClick={() => setPageMode('specific')}
                  className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all duration-300 ${
                    pageMode === 'specific'
                      ? 'border-[#8A2BE2] bg-[#8A2BE2]/10 text-white'
                      : 'border-[#1a1a1a] bg-black/40 text-[#AAAAAA] hover:border-[#8A2BE2]/30'
                  }`}
                >
                  Specific Pages
                </button>
              </div>

              {pageMode === 'specific' && (
                <div>
                  <input
                    type="text"
                    value={specificPages}
                    onChange={(e) => setSpecificPages(e.target.value)}
                    placeholder="e.g., 1, 3-5, 8"
                    className="w-full rounded-xl border border-[#222222] bg-black/40 px-4 py-3 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#8A2BE2]/50 focus:ring-1 focus:ring-[#8A2BE2]/20 transition-all duration-300"
                  />
                  <p className="text-xs text-[#666666] mt-2">
                    Enter page numbers separated by commas. Use dashes for ranges. Example: 1, 3-5, 8-10
                  </p>
                </div>
              )}
            </div>

            {/* Summary & Rotate Button */}
            <div className="rounded-xl bg-black/40 border border-[#1a1a1a] p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-sm text-[#AAAAAA]">
                  <span className="text-white font-medium">
                    {pageMode === 'all'
                      ? `${pageCount} page${pageCount !== 1 ? 's' : ''}`
                      : specificPages.trim()
                        ? 'Selected pages'
                        : '0 pages'}
                  </span>
                  {' '}will be rotated{' '}
                  <span className="text-[#8A2BE2] font-medium">{rotationAngle}°</span>
                </div>
                <Button
                  onClick={rotateAndDownload}
                  disabled={isProcessing}
                  className="cta-primary shrink-0"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Rotating...' : 'Rotate & Download'}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Loading Overlay */}
        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="h-8 w-8 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-[#AAAAAA]">Rotating PDF pages...</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
