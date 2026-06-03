'use client';

import { useState, useRef, useCallback } from 'react';
import { Crop, Upload, Download, Trash2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'How does PDF cropping work?',
    answer:
      'This tool uses the pdf-lib library to modify the crop box of each page in your PDF. The crop box defines the visible region of the page — by adjusting it, you can trim away unwanted margins, whitespace, or content around the edges. The underlying content is not deleted; only the visible area is changed. All processing happens entirely in your browser — no data is sent to any server.',
  },
  {
    question: 'What is the difference between mm and inches for margin input?',
    answer:
      'You can choose your preferred unit of measurement for entering crop margins. Millimeters (mm) are commonly used in most countries and offer finer precision, while inches are standard in the US. The tool automatically converts your values to PDF points (1 inch = 72 points, 1 mm ≈ 2.835 points) internally. Switch between units at any time — your entered values will be converted accordingly.',
  },
  {
    question: 'Can I crop specific pages instead of all pages?',
    answer:
      'Yes. By default the tool applies crop margins to all pages, but you can switch to "Specific Pages" mode and enter individual page numbers or ranges (e.g., 1, 3-5, 8). Only the pages you list will have the crop applied. This is useful when certain pages have different margins or content layouts than others.',
  },
  {
    question: 'Does cropping a PDF reduce file size?',
    answer:
      'Not significantly. Cropping changes the visible area (crop box) of each page but does not remove the underlying content outside the crop region. The file size may decrease slightly due to updated metadata, but the content bytes remain. If you need to permanently remove content and reduce file size, you would need to re-render the PDF, which is a different operation.',
  },
  {
    question: 'Will cropping affect the quality of my PDF content?',
    answer:
      'No. Cropping only adjusts the page boundary metadata — it does not re-encode, recompress, or alter any text, images, or vectors within the visible area. Everything inside the crop region remains pixel-perfect and identical to the original. Since no re-rendering occurs, there is zero quality loss.',
  },
];

const relatedTools = [
  {
    name: 'PDF Rotate',
    hash: '#/tools/pdf-rotate',
    description: 'Rotate PDF pages to any orientation.',
  },
  {
    name: 'PDF Split',
    hash: '#/tools/pdf-split',
    description: 'Split a PDF into separate files or pages.',
  },
  {
    name: 'PDF Resize',
    hash: '#/tools/pdf-resize',
    description: 'Resize PDF pages to standard paper sizes.',
  },
];

type UnitMode = 'mm' | 'in';

const MM_TO_POINTS = 2.834645669;
const IN_TO_POINTS = 72;
const MM_TO_IN = 1 / 25.4;
const IN_TO_MM = 25.4;

interface PageInfo {
  width: number;
  height: number;
  widthMm: number;
  heightMm: number;
  widthIn: number;
  heightIn: number;
}

interface PdfCropProps {
  onNavigate: (hash: string) => void;
}

export default function PdfCrop({ onNavigate }: PdfCropProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [unitMode, setUnitMode] = useState<UnitMode>('mm');
  const [cropTop, setCropTop] = useState<number>(0);
  const [cropBottom, setCropBottom] = useState<number>(0);
  const [cropLeft, setCropLeft] = useState<number>(0);
  const [cropRight, setCropRight] = useState<number>(0);
  const [pageMode, setPageMode] = useState<'all' | 'specific'>('all');
  const [specificPages, setSpecificPages] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState<ArrayBuffer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getMaxMargin = useCallback(
    (side: 'top' | 'bottom' | 'left' | 'right'): number => {
      if (!pageInfo) return 100;
      if (unitMode === 'mm') {
        if (side === 'top' || side === 'bottom') {
          return Math.floor(pageInfo.heightMm / 2);
        }
        return Math.floor(pageInfo.widthMm / 2);
      } else {
        if (side === 'top' || side === 'bottom') {
          return Math.floor(pageInfo.heightIn / 2 * 100) / 100;
        }
        return Math.floor(pageInfo.widthIn / 2 * 100) / 100;
      }
    },
    [pageInfo, unitMode]
  );

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please upload a valid PDF file');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      const info: PageInfo = {
        width,
        height,
        widthMm: parseFloat((width / MM_TO_POINTS).toFixed(1)),
        heightMm: parseFloat((height / MM_TO_POINTS).toFixed(1)),
        widthIn: parseFloat((width / IN_TO_POINTS).toFixed(2)),
        heightIn: parseFloat((height / IN_TO_POINTS).toFixed(2)),
      };

      setPdfFile(file);
      setPageCount(pages.length);
      setPageInfo(info);
      setPdfArrayBuffer(arrayBuffer);
      setSpecificPages('');
      setPageMode('all');
      setCropTop(0);
      setCropBottom(0);
      setCropLeft(0);
      setCropRight(0);
      toast.success(`PDF loaded — ${pages.length} page${pages.length !== 1 ? 's' : ''} detected`);
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

  const convertToPoints = useCallback(
    (value: number): number => {
      if (unitMode === 'mm') {
        return value * MM_TO_POINTS;
      }
      return value * IN_TO_POINTS;
    },
    [unitMode]
  );

  const cropAndDownload = useCallback(async () => {
    if (!pdfFile || !pdfArrayBuffer || !pageInfo) {
      toast.error('No PDF loaded. Please upload a file first.');
      return;
    }

    const topPt = convertToPoints(cropTop);
    const bottomPt = convertToPoints(cropBottom);
    const leftPt = convertToPoints(cropLeft);
    const rightPt = convertToPoints(cropRight);

    if (topPt + bottomPt >= pageInfo.height) {
      toast.error('Top and bottom margins exceed page height. Please reduce your crop values.');
      return;
    }
    if (leftPt + rightPt >= pageInfo.width) {
      toast.error('Left and right margins exceed page width. Please reduce your crop values.');
      return;
    }

    let targetPages: number[];

    if (pageMode === 'specific') {
      if (!specificPages.trim()) {
        toast.error('Please specify which pages to crop.');
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
      const pdfDoc = await PDFDocument.load(pdfArrayBuffer, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();
      const targetSet = new Set(targetPages);

      pages.forEach((page, index) => {
        const pageNum = index + 1;
        if (targetSet.has(pageNum)) {
          const { width, height } = page.getSize();
          page.setCropBox(
            leftPt,
            bottomPt,
            width - leftPt - rightPt,
            height - topPt - bottomPt
          );
        }
      });

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfFile.name.replace(/\.pdf$/i, '_cropped.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(
        `Cropped ${targetPages.length} page${targetPages.length !== 1 ? 's' : ''} successfully!`
      );
    } catch (error) {
      console.error('PDF crop error:', error);
      toast.error('Failed to crop PDF. The file may be corrupted or encrypted.');
    } finally {
      setIsProcessing(false);
    }
  }, [
    pdfFile,
    pdfArrayBuffer,
    pageInfo,
    cropTop,
    cropBottom,
    cropLeft,
    cropRight,
    pageMode,
    specificPages,
    pageCount,
    parsePageNumbers,
    convertToPoints,
  ]);

  const reset = useCallback(() => {
    setPdfFile(null);
    setPageCount(0);
    setPageInfo(null);
    setPdfArrayBuffer(null);
    setSpecificPages('');
    setPageMode('all');
    setCropTop(0);
    setCropBottom(0);
    setCropLeft(0);
    setCropRight(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('PDF cleared');
  }, []);

  const handleUnitSwitch = useCallback(
    (newUnit: UnitMode) => {
      if (newUnit === unitMode) return;

      const convertValue = (val: number): number => {
        if (unitMode === 'mm' && newUnit === 'in') {
          return parseFloat((val * MM_TO_IN).toFixed(2));
        }
        if (unitMode === 'in' && newUnit === 'mm') {
          return parseFloat((val * IN_TO_MM).toFixed(1));
        }
        return val;
      };

      setCropTop(convertValue(cropTop));
      setCropBottom(convertValue(cropBottom));
      setCropLeft(convertValue(cropLeft));
      setCropRight(convertValue(cropRight));
      setUnitMode(newUnit);
    },
    [unitMode, cropTop, cropBottom, cropLeft, cropRight]
  );

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
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const unitLabel = unitMode === 'mm' ? 'mm' : 'in';
  const sliderMax = pageInfo
    ? Math.max(
        getMaxMargin('top'),
        getMaxMargin('bottom'),
        getMaxMargin('left'),
        getMaxMargin('right'),
        100
      )
    : 100;

  const computeResultSize = useCallback((): { w: number; h: number } | null => {
    if (!pageInfo) return null;
    const topPt = convertToPoints(cropTop);
    const bottomPt = convertToPoints(cropBottom);
    const leftPt = convertToPoints(cropLeft);
    const rightPt = convertToPoints(cropRight);
    const resultWidthPt = pageInfo.width - leftPt - rightPt;
    const resultHeightPt = pageInfo.height - topPt - bottomPt;
    if (resultWidthPt <= 0 || resultHeightPt <= 0) return null;
    if (unitMode === 'mm') {
      return {
        w: parseFloat((resultWidthPt / MM_TO_POINTS).toFixed(1)),
        h: parseFloat((resultHeightPt / MM_TO_POINTS).toFixed(1)),
      };
    }
    return {
      w: parseFloat((resultWidthPt / IN_TO_POINTS).toFixed(2)),
      h: parseFloat((resultHeightPt / IN_TO_POINTS).toFixed(2)),
    };
  }, [pageInfo, cropTop, cropBottom, cropLeft, cropRight, convertToPoints, unitMode]);

  const resultSize = computeResultSize();

  return (
    <ToolLayout
      title="PDF Crop"
      description="Crop PDF page margins instantly in your browser. Upload any PDF, set custom crop margins for top, bottom, left, and right edges in mm or inches, choose which pages to crop, and download the result. All processing happens locally — your files never leave your device."
      icon={Crop}
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
                if (file) handleFileUpload(file);
              }}
            />
          </div>
        ) : (
          <>
            {/* File Info Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-black/40 border border-[#1a1a1a]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 shrink-0">
                  <Crop className="h-5 w-5 text-[#8A2BE2]" />
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

            {/* Page Dimensions Info */}
            {pageInfo && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#8A2BE2]/5 border border-[#8A2BE2]/10">
                <Info className="h-4 w-4 text-[#8A2BE2] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">Page Dimensions (first page)</p>
                  <p className="text-xs text-[#AAAAAA]">
                    {pageInfo.widthMm} × {pageInfo.heightMm} mm &nbsp;|&nbsp;{' '}
                    {pageInfo.widthIn} × {pageInfo.heightIn} in &nbsp;|&nbsp;{' '}
                    {pageInfo.width.toFixed(1)} × {pageInfo.height.toFixed(1)} pt
                  </p>
                </div>
              </div>
            )}

            {/* Unit Selection */}
            <div>
              <Label className="text-sm font-medium text-white mb-3 block">
                Unit of Measurement
              </Label>
              <div className="flex gap-3">
                <button
                  onClick={() => handleUnitSwitch('mm')}
                  className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all duration-300 ${
                    unitMode === 'mm'
                      ? 'border-[#8A2BE2] bg-[#8A2BE2]/10 text-white'
                      : 'border-[#1a1a1a] bg-black/40 text-[#AAAAAA] hover:border-[#8A2BE2]/30'
                  }`}
                >
                  Millimeters (mm)
                </button>
                <button
                  onClick={() => handleUnitSwitch('in')}
                  className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all duration-300 ${
                    unitMode === 'in'
                      ? 'border-[#8A2BE2] bg-[#8A2BE2]/10 text-white'
                      : 'border-[#1a1a1a] bg-black/40 text-[#AAAAAA] hover:border-[#8A2BE2]/30'
                  }`}
                >
                  Inches (in)
                </button>
              </div>
            </div>

            {/* Crop Margins */}
            <div>
              <Label className="text-sm font-medium text-white mb-4 block">
                Crop Margins
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Top Margin */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-[#AAAAAA]">Top Margin</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min={0}
                        max={getMaxMargin('top')}
                        step={unitMode === 'mm' ? 0.5 : 0.01}
                        value={cropTop}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setCropTop(isNaN(val) ? 0 : Math.max(0, Math.min(val, getMaxMargin('top'))));
                        }}
                        className="w-20 h-8 text-xs text-center bg-black/40 border-[#222222] text-white focus:border-[#8A2BE2]/50 focus:ring-[#8A2BE2]/20"
                      />
                      <span className="text-xs text-[#666666]">{unitLabel}</span>
                    </div>
                  </div>
                  <Slider
                    value={[cropTop]}
                    min={0}
                    max={sliderMax}
                    step={unitMode === 'mm' ? 0.5 : 0.01}
                    onValueChange={([val]) => setCropTop(val)}
                    className="[&_[data-slot=slider-track]]:bg-[#222222] [&_[data-slot=slider-range]]:bg-[#8A2BE2] [&_[data-slot=slider-thumb]]:border-[#8A2BE2] [&_[data-slot=slider-thumb]]:bg-black"
                  />
                </div>

                {/* Bottom Margin */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-[#AAAAAA]">Bottom Margin</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min={0}
                        max={getMaxMargin('bottom')}
                        step={unitMode === 'mm' ? 0.5 : 0.01}
                        value={cropBottom}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setCropBottom(isNaN(val) ? 0 : Math.max(0, Math.min(val, getMaxMargin('bottom'))));
                        }}
                        className="w-20 h-8 text-xs text-center bg-black/40 border-[#222222] text-white focus:border-[#8A2BE2]/50 focus:ring-[#8A2BE2]/20"
                      />
                      <span className="text-xs text-[#666666]">{unitLabel}</span>
                    </div>
                  </div>
                  <Slider
                    value={[cropBottom]}
                    min={0}
                    max={sliderMax}
                    step={unitMode === 'mm' ? 0.5 : 0.01}
                    onValueChange={([val]) => setCropBottom(val)}
                    className="[&_[data-slot=slider-track]]:bg-[#222222] [&_[data-slot=slider-range]]:bg-[#8A2BE2] [&_[data-slot=slider-thumb]]:border-[#8A2BE2] [&_[data-slot=slider-thumb]]:bg-black"
                  />
                </div>

                {/* Left Margin */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-[#AAAAAA]">Left Margin</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min={0}
                        max={getMaxMargin('left')}
                        step={unitMode === 'mm' ? 0.5 : 0.01}
                        value={cropLeft}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setCropLeft(isNaN(val) ? 0 : Math.max(0, Math.min(val, getMaxMargin('left'))));
                        }}
                        className="w-20 h-8 text-xs text-center bg-black/40 border-[#222222] text-white focus:border-[#8A2BE2]/50 focus:ring-[#8A2BE2]/20"
                      />
                      <span className="text-xs text-[#666666]">{unitLabel}</span>
                    </div>
                  </div>
                  <Slider
                    value={[cropLeft]}
                    min={0}
                    max={sliderMax}
                    step={unitMode === 'mm' ? 0.5 : 0.01}
                    onValueChange={([val]) => setCropLeft(val)}
                    className="[&_[data-slot=slider-track]]:bg-[#222222] [&_[data-slot=slider-range]]:bg-[#8A2BE2] [&_[data-slot=slider-thumb]]:border-[#8A2BE2] [&_[data-slot=slider-thumb]]:bg-black"
                  />
                </div>

                {/* Right Margin */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-[#AAAAAA]">Right Margin</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min={0}
                        max={getMaxMargin('right')}
                        step={unitMode === 'mm' ? 0.5 : 0.01}
                        value={cropRight}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setCropRight(isNaN(val) ? 0 : Math.max(0, Math.min(val, getMaxMargin('right'))));
                        }}
                        className="w-20 h-8 text-xs text-center bg-black/40 border-[#222222] text-white focus:border-[#8A2BE2]/50 focus:ring-[#8A2BE2]/20"
                      />
                      <span className="text-xs text-[#666666]">{unitLabel}</span>
                    </div>
                  </div>
                  <Slider
                    value={[cropRight]}
                    min={0}
                    max={sliderMax}
                    step={unitMode === 'mm' ? 0.5 : 0.01}
                    onValueChange={([val]) => setCropRight(val)}
                    className="[&_[data-slot=slider-track]]:bg-[#222222] [&_[data-slot=slider-range]]:bg-[#8A2BE2] [&_[data-slot=slider-thumb]]:border-[#8A2BE2] [&_[data-slot=slider-thumb]]:bg-black"
                  />
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="mt-4 space-y-2">
                <Label className="text-xs text-[#888888]">Quick Presets</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCropTop(0);
                      setCropBottom(0);
                      setCropLeft(0);
                      setCropRight(0);
                    }}
                    className="border-[#222222] text-[#AAAAAA] hover:border-[#8A2BE2]/50 hover:text-white text-xs"
                  >
                    No Crop
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const val = unitMode === 'mm' ? 5 : 0.2;
                      setCropTop(val);
                      setCropBottom(val);
                      setCropLeft(val);
                      setCropRight(val);
                    }}
                    className="border-[#222222] text-[#AAAAAA] hover:border-[#8A2BE2]/50 hover:text-white text-xs"
                  >
                    {unitMode === 'mm' ? '5 mm all sides' : '0.2 in all sides'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const val = unitMode === 'mm' ? 10 : 0.4;
                      setCropTop(val);
                      setCropBottom(val);
                      setCropLeft(val);
                      setCropRight(val);
                    }}
                    className="border-[#222222] text-[#AAAAAA] hover:border-[#8A2BE2]/50 hover:text-white text-xs"
                  >
                    {unitMode === 'mm' ? '10 mm all sides' : '0.4 in all sides'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const val = unitMode === 'mm' ? 15 : 0.6;
                      setCropTop(val);
                      setCropBottom(val);
                      setCropLeft(val);
                      setCropRight(val);
                    }}
                    className="border-[#222222] text-[#AAAAAA] hover:border-[#8A2BE2]/50 hover:text-white text-xs"
                  >
                    {unitMode === 'mm' ? '15 mm all sides' : '0.6 in all sides'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const val = unitMode === 'mm' ? 20 : 0.8;
                      setCropTop(val);
                      setCropBottom(val);
                      setCropLeft(val);
                      setCropRight(val);
                    }}
                    className="border-[#222222] text-[#AAAAAA] hover:border-[#8A2BE2]/50 hover:text-white text-xs"
                  >
                    {unitMode === 'mm' ? '20 mm all sides' : '0.8 in all sides'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Page Selection Mode */}
            <div>
              <Label className="text-sm font-medium text-white mb-3 block">
                Pages to Crop
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
                  <Input
                    type="text"
                    value={specificPages}
                    onChange={(e) => setSpecificPages(e.target.value)}
                    placeholder="e.g., 1, 3-5, 8"
                    className="bg-black/40 border-[#222222] text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:ring-[#8A2BE2]/20 h-11"
                  />
                  <p className="text-xs text-[#666666] mt-2">
                    Enter page numbers separated by commas. Use dashes for ranges. Example: 1, 3-5, 8-10
                  </p>
                </div>
              )}
            </div>

            {/* Crop Preview Summary */}
            <div className="rounded-xl bg-black/40 border border-[#1a1a1a] p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-sm text-[#AAAAAA] space-y-1">
                  <div>
                    <span className="text-white font-medium">
                      {pageMode === 'all'
                        ? `${pageCount} page${pageCount !== 1 ? 's' : ''}`
                        : specificPages.trim()
                          ? 'Selected pages'
                          : '0 pages'}
                    </span>
                    {' '}will be cropped
                  </div>
                  {resultSize && (
                    <div className="text-xs">
                      Result size: <span className="text-[#8A2BE2] font-medium">{resultSize.w} × {resultSize.h} {unitLabel}</span>
                      {' '}(from{' '}
                        {unitMode === 'mm'
                          ? `${pageInfo?.widthMm} × ${pageInfo?.heightMm} mm`
                          : `${pageInfo?.widthIn} × ${pageInfo?.heightIn} in`
                        })
                    </div>
                  )}
                  {resultSize === null && (cropTop + cropBottom + cropLeft + cropRight > 0) && (
                    <div className="text-xs text-red-400">
                      Margins exceed page dimensions — please reduce values
                    </div>
                  )}
                </div>
                <Button
                  onClick={cropAndDownload}
                  disabled={isProcessing || resultSize === null}
                  className="cta-primary shrink-0"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Cropping...' : 'Crop & Download'}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Loading Overlay */}
        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="h-8 w-8 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-[#AAAAAA]">Cropping PDF pages...</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
