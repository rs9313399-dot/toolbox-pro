'use client';

import { useState, useRef, useCallback } from 'react';
import { Hash, Upload, Download, Trash2 } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
    question: 'How does the PDF page numbering tool work?',
    answer:
      'This tool uses the pdf-lib library to add page numbers directly onto every page of your PDF. It loads your PDF into the browser, embeds a standard Helvetica font, and draws the page number text at your chosen position and size on each page. All processing happens entirely in your browser — your files are never uploaded to any server.',
  },
  {
    question: 'Can I customize the position of the page numbers?',
    answer:
      'Yes! You can place page numbers in six positions: bottom-center, bottom-left, bottom-right, top-center, top-left, or top-right. The default is bottom-center, which is the most common placement for professional documents. Each position automatically calculates the correct x and y coordinates based on the page dimensions.',
  },
  {
    question: 'What is the "starting page number" option?',
    answer:
      'The starting page number lets you control the number printed on the first page of your PDF. By default it starts at 1, but you can set it to any number — for example, if your PDF is part of a larger document and you want page numbering to begin at 25, you can set the starting page number to 25. Subsequent pages will increment from that value.',
  },
  {
    question: 'Will adding page numbers affect the existing PDF content?',
    answer:
      'The page numbers are drawn as a new text layer on top of the existing page content. The tool does not modify or remove any existing text, images, or annotations in your PDF — it only adds the page number overlay. If a page number overlaps with existing content, you can change the position or font size to avoid conflicts.',
  },
  {
    question: 'Can I remove page numbers after adding them?',
    answer:
      'Once page numbers are added and the PDF is saved, they become part of the page content and cannot be easily removed with this tool. We recommend keeping a backup of your original PDF before adding page numbers. If you need different numbering, start over with the original file and apply new settings.',
  },
];

const relatedTools = [
  {
    name: 'PDF Merge',
    hash: '#/tools/pdf-merge',
    description: 'Merge multiple PDF files into one document.',
  },
  {
    name: 'PDF Rotate',
    hash: '#/tools/pdf-rotate',
    description: 'Rotate PDF pages to any orientation.',
  },
  {
    name: 'PDF Watermark',
    hash: '#/tools/pdf-watermark',
    description: 'Add text or image watermarks to PDF files.',
  },
];

type PageNumberPosition =
  | 'bottom-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'top-right'
  | 'top-left';

const POSITION_OPTIONS: { value: PageNumberPosition; label: string }[] = [
  { value: 'bottom-center', label: 'Bottom Center' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'top-center', label: 'Top Center' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'top-left', label: 'Top Left' },
];

interface PdfPageNumbersProps {
  onNavigate: (hash: string) => void;
}

export default function PdfPageNumbers({ onNavigate }: PdfPageNumbersProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [position, setPosition] = useState<PageNumberPosition>('bottom-center');
  const [fontSize, setFontSize] = useState<number>(12);
  const [startPageNum, setStartPageNum] = useState<number>(1);
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
      toast.success(`PDF loaded — ${pages.length} page(s) detected`);
    } catch (error) {
      console.error('PDF load error:', error);
      toast.error('Failed to load PDF. The file may be corrupted or encrypted.');
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const calculatePosition = useCallback(
    (
      pos: PageNumberPosition,
      pageWidth: number,
      pageHeight: number,
      textWidth: number,
      size: number
    ): { x: number; y: number } => {
      const margin = 30;

      switch (pos) {
        case 'bottom-center':
          return { x: pageWidth / 2 - textWidth / 2, y: margin };
        case 'bottom-right':
          return { x: pageWidth - textWidth - margin, y: margin };
        case 'bottom-left':
          return { x: margin, y: margin };
        case 'top-center':
          return { x: pageWidth / 2 - textWidth / 2, y: pageHeight - size - margin / 2 };
        case 'top-right':
          return { x: pageWidth - textWidth - margin, y: pageHeight - size - margin / 2 };
        case 'top-left':
          return { x: margin, y: pageHeight - size - margin / 2 };
        default:
          return { x: pageWidth / 2 - textWidth / 2, y: margin };
      }
    },
    []
  );

  const addPageNumbers = useCallback(async () => {
    if (!pdfFile || !pdfArrayBuffer) {
      toast.error('Please upload a PDF file first');
      return;
    }

    if (fontSize < 6 || fontSize > 72) {
      toast.error('Font size must be between 6 and 72');
      return;
    }

    if (startPageNum < 0 || startPageNum > 99999) {
      toast.error('Starting page number must be between 0 and 99999');
      return;
    }

    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();

      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const pageNum = index + startPageNum;
        const text = `${pageNum}`;
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const { x, y } = calculatePosition(position, width, height, textWidth, fontSize);

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.4, 0.4, 0.4),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfFile.name.replace(/\.pdf$/i, '-numbered.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Page numbers added to ${pages.length} page(s)`);
    } catch (error) {
      console.error('Page numbering error:', error);
      toast.error(
        'Failed to add page numbers. The file may be corrupted or encrypted.'
      );
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFile, pdfArrayBuffer, position, fontSize, startPageNum, calculatePosition]);

  const reset = useCallback(() => {
    setPdfFile(null);
    setPageCount(0);
    setPdfArrayBuffer(null);
    setPosition('bottom-center');
    setFontSize(12);
    setStartPageNum(1);
    toast.info('PDF cleared');
  }, []);

  return (
    <ToolLayout
      title="PDF Page Numbers"
      description="Add page numbers to every page of your PDF document directly in the browser. Customize position, font size, and starting page number. All processing happens locally — your files never leave your device."
      icon={Hash}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {!pdfFile ? (
          /* Upload Area */
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
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
                  <Hash className="h-5 w-5 text-[#8A2BE2]" />
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

            {/* Position & Font Size Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Position */}
              <div>
                <Label className="text-sm font-medium text-white mb-2 block">
                  Position
                </Label>
                <Select
                  value={position}
                  onValueChange={(val) => setPosition(val as PageNumberPosition)}
                >
                  <SelectTrigger className="w-full bg-black/40 border-[#222222] text-white">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-[#333333]">
                    {POSITION_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-white focus:bg-[#8A2BE2]/10 focus:text-white"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div>
                <Label className="text-sm font-medium text-white mb-2 block">
                  Font Size (pt)
                </Label>
                <Input
                  type="number"
                  min={6}
                  max={72}
                  value={fontSize}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 6 && val <= 72) {
                      setFontSize(val);
                    }
                  }}
                  className="bg-black/40 border-[#222222] text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:ring-[#8A2BE2]/20"
                />
              </div>
            </div>

            {/* Starting Page Number */}
            <div>
              <Label className="text-sm font-medium text-white mb-2 block">
                Starting Page Number
              </Label>
              <Input
                type="number"
                min={0}
                max={99999}
                value={startPageNum}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= 0) {
                    setStartPageNum(val);
                  }
                  if (e.target.value === '') {
                    setStartPageNum(0);
                  }
                }}
                className="bg-black/40 border-[#222222] text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:ring-[#8A2BE2]/20"
              />
              <p className="text-xs text-[#666666] mt-1.5">
                The number printed on the first page. Default is 1.
              </p>
            </div>

            {/* Preview */}
            <div className="p-4 rounded-xl bg-black/40 border border-[#1a1a1a]">
              <p className="text-xs text-[#888888] mb-2">Preview</p>
              <div className="relative h-32 rounded-lg bg-white/5 border border-[#222222] overflow-hidden">
                {/* Simulated page */}
                <div className="absolute inset-3 border border-[#333333]/30 rounded-sm">
                  {/* Fake content lines */}
                  <div className="p-3 space-y-1.5">
                    <div className="h-1.5 w-3/4 bg-[#333333]/20 rounded" />
                    <div className="h-1.5 w-1/2 bg-[#333333]/20 rounded" />
                    <div className="h-1.5 w-2/3 bg-[#333333]/20 rounded" />
                    <div className="h-1.5 w-5/6 bg-[#333333]/20 rounded" />
                  </div>
                </div>
                {/* Page number preview */}
                <span
                  className="absolute text-[#666666] select-none font-sans"
                  style={{
                    fontSize: `${Math.min(fontSize, 16)}px`,
                    ...(position.includes('bottom')
                      ? { bottom: '6px' }
                      : { top: '6px' }),
                    ...(position.includes('left')
                      ? { left: '20px' }
                      : position.includes('right')
                        ? { right: '20px' }
                        : { left: '50%', transform: 'translateX(-50%)' }),
                  }}
                >
                  {startPageNum}
                </span>
              </div>
            </div>

            {/* Summary & Process Button */}
            <div className="rounded-xl bg-black/40 border border-[#1a1a1a] p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-sm text-[#AAAAAA]">
                  <span className="text-white font-medium">
                    {pageCount} page{pageCount !== 1 ? 's' : ''}
                  </span>
                  {' '}will be numbered from{' '}
                  <span className="text-[#8A2BE2] font-medium">{startPageNum}</span>
                  {' '}to{' '}
                  <span className="text-[#8A2BE2] font-medium">
                    {startPageNum + pageCount - 1}
                  </span>
                </div>
                <Button
                  onClick={addPageNumbers}
                  disabled={isProcessing}
                  className="cta-primary shrink-0"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Adding Numbers...' : 'Add Numbers & Download'}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Loading Overlay */}
        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="h-8 w-8 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-[#AAAAAA]">Adding page numbers to all pages...</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
