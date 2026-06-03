'use client';

import { useState, useRef, useCallback } from 'react';
import {
  ArrowUpDown,
  Upload,
  Download,
  ChevronUp,
  ChevronDown,
  X,
  GripVertical,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'How does PDF page rearranging work?',
    answer:
      'This tool uses the pdf-lib library to read your PDF and create a new document with the pages in your desired order. When you reorder pages using drag-and-drop or the up/down buttons, the tool copies each page from the original PDF into a new document following your specified sequence. All processing happens entirely in your browser — your file is never uploaded to any server.',
  },
  {
    question: 'Can I also remove pages while rearranging?',
    answer:
      'Yes! Each page in the list has a remove button (×). Simply click it to exclude that page from the final output. This makes it easy to both reorder and trim your PDF in a single step — no need for a separate split tool.',
  },
  {
    question: 'Will rearranging pages affect the quality of my PDF?',
    answer:
      'No. The pdf-lib library copies pages byte-for-byte from the original document into the new one. No re-encoding, compression, or rendering occurs. Text, images, vectors, form fields, and annotations are all preserved exactly as they were in the original — only the page order changes.',
  },
  {
    question: 'Is there a limit on the number of pages I can rearrange?',
    answer:
      'There is no strict page limit imposed by the tool. However, since all processing happens in your browser using JavaScript, very large PDFs (thousands of pages) may require significant memory and take longer to process. For most typical documents (up to a few hundred pages), rearranging is fast and seamless.',
  },
  {
    question: 'Is my PDF file secure when using this tool?',
    answer:
      'Absolutely. All processing happens client-side in your browser. Your PDF file never leaves your device — it is not uploaded to any server at any point. Once you close or navigate away from the page, all file data is cleared from memory. Your documents remain completely private and secure.',
  },
];

const relatedTools = [
  {
    name: 'PDF Merge',
    hash: '#/tools/pdf-merge',
    description: 'Combine multiple PDFs into a single document.',
  },
  {
    name: 'PDF Split',
    hash: '#/tools/pdf-split',
    description: 'Extract specific pages from a PDF file.',
  },
  {
    name: 'PDF Rotate',
    hash: '#/tools/pdf-rotate',
    description: 'Rotate PDF pages to any orientation.',
  },
];

interface PageItem {
  id: string;
  originalIndex: number;
  pageNumber: number;
}

interface SortablePageItemProps {
  page: PageItem;
  position: number;
  totalItems: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

function SortablePageItem({
  page,
  position,
  totalItems,
  onMoveUp,
  onMoveDown,
  onRemove,
}: SortablePageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 sm:gap-3 p-3 rounded-xl border transition-all duration-200 ${
        isDragging
          ? 'border-[#8A2BE2] bg-[#8A2BE2]/10 shadow-lg shadow-[#8A2BE2]/10 z-10'
          : 'border-[#1a1a1a] bg-black/40 hover:border-[#8A2BE2]/30'
      }`}
    >
      {/* Drag Handle */}
      <button
        className="flex items-center justify-center w-8 h-8 rounded-lg text-[#555555] hover:text-[#8A2BE2] hover:bg-[#8A2BE2]/10 cursor-grab active:cursor-grabbing transition-colors shrink-0"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Page Number Badge */}
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 shrink-0">
        <span className="text-sm font-bold text-[#8A2BE2]">{page.pageNumber}</span>
      </div>

      {/* Page Label */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          Page {page.pageNumber}
        </p>
        <p className="text-xs text-[#666666]">
          Position {position + 1} of {totalItems}
        </p>
      </div>

      {/* Move Up / Down Buttons */}
      <div className="flex flex-col gap-0.5 shrink-0">
        <button
          onClick={onMoveUp}
          disabled={position === 0}
          className="flex items-center justify-center w-7 h-7 rounded-md text-[#888888] hover:text-white hover:bg-[#8A2BE2]/20 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          aria-label="Move page up"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={position === totalItems - 1}
          className="flex items-center justify-center w-7 h-7 rounded-md text-[#888888] hover:text-white hover:bg-[#8A2BE2]/20 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          aria-label="Move page down"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="flex items-center justify-center w-7 h-7 rounded-md text-[#555555] hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
        aria-label={`Remove page ${page.pageNumber}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface PdfRearrangeProps {
  onNavigate: (hash: string) => void;
}

export default function PdfRearrange({ onNavigate }: PdfRearrangeProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState<ArrayBuffer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadPdf = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please upload a valid PDF file');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const count = pdf.getPageCount();

      const pageItems: PageItem[] = Array.from({ length: count }, (_, i) => ({
        id: `page-${i}-${Date.now()}`,
        originalIndex: i,
        pageNumber: i + 1,
      }));

      setPdfFile(file);
      setPages(pageItems);
      setPdfArrayBuffer(arrayBuffer);
      toast.success(`PDF loaded — ${count} page${count !== 1 ? 's' : ''} detected`);
    } catch (error) {
      console.error('PDF load error:', error);
      toast.error('Failed to load PDF. The file may be corrupted or encrypted.');
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);

    if (!over || active.id === over.id) return;

    setPages((prevPages) => {
      const oldIndex = prevPages.findIndex((p) => p.id === active.id);
      const newIndex = prevPages.findIndex((p) => p.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prevPages;
      return arrayMove(prevPages, oldIndex, newIndex);
    });
  }, []);

  const movePageUp = useCallback((index: number) => {
    if (index <= 0) return;
    setPages((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const movePageDown = useCallback((index: number) => {
    setPages((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  const removePage = useCallback((id: string) => {
    setPages((prev) => {
      const removed = prev.find((p) => p.id === id);
      const next = prev.filter((p) => p.id !== id);
      if (removed) {
        toast.info(`Page ${removed.pageNumber} removed`);
      }
      return next;
    });
  }, []);

  const rearrangeAndDownload = useCallback(async () => {
    if (!pdfFile || !pdfArrayBuffer) {
      toast.error('No PDF loaded. Please upload a file first.');
      return;
    }

    if (pages.length === 0) {
      toast.error('No pages remaining. Please keep at least one page.');
      return;
    }

    setIsProcessing(true);

    try {
      const sourcePdf = await PDFDocument.load(pdfArrayBuffer, {
        ignoreEncryption: true,
      });
      const newPdf = await PDFDocument.create();

      // Copy pages in the new order
      for (const page of pages) {
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [page.originalIndex]);
        newPdf.addPage(copiedPage);
      }

      const pdfBytes = await newPdf.save();

      // Create download
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const originalName = pdfFile.name.replace(/\.pdf$/i, '');
      link.href = url;
      link.download = `${originalName}_rearranged.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(
        `PDF rearranged — ${pages.length} page${pages.length !== 1 ? 's' : ''} saved!`
      );
    } catch (error) {
      console.error('PDF rearrange error:', error);
      toast.error('Failed to rearrange PDF. The file may be corrupted or encrypted.');
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFile, pdfArrayBuffer, pages]);

  const reset = useCallback(() => {
    setPdfFile(null);
    setPages([]);
    setPdfArrayBuffer(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('PDF removed');
  }, []);

  const resetOrder = useCallback(() => {
    if (!pdfFile) return;
    setPages((prev) =>
      [...prev].sort((a, b) => a.originalIndex - b.originalIndex)
    );
    toast.info('Page order reset to original');
  }, [pdfFile]);

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

  // Build order summary
  const orderSummary = pages.length > 0
    ? pages.length <= 8
      ? pages.map((p) => p.pageNumber).join(' → ')
      : `${pages.slice(0, 5).map((p) => p.pageNumber).join(' → ')} → ... → ${pages[pages.length - 1].pageNumber}`
    : '';

  return (
    <ToolLayout
      title="PDF Rearrange"
      description="Reorder, rearrange, or remove pages from your PDF documents instantly in your browser. Drag and drop pages to reorder them, move them up or down, or remove unwanted pages — then download the new PDF. All processing happens locally on your device for maximum privacy."
      icon={ArrowUpDown}
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
                  <ArrowUpDown className="h-5 w-5 text-[#8A2BE2]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {pdfFile.name}
                  </p>
                  <p className="text-xs text-[#888888]">
                    {pages.length} page{pages.length !== 1 ? 's' : ''} &middot; {(pdfFile.size / 1024).toFixed(1)} KB
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

            {/* Page List Header */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-white">
                Page Order
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetOrder}
                  className="border-[#222222] text-[#AAAAAA] hover:border-[#8A2BE2]/50 hover:text-white text-xs h-8"
                >
                  Reset Order
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-3 rounded-lg bg-[#8A2BE2]/5 border border-[#8A2BE2]/10">
              <p className="text-xs text-[#AAAAAA]">
                <span className="text-[#8A2BE2] font-semibold">Tip:</span>{' '}
                Drag the grip handle to reorder pages, use ↑↓ buttons to move pages, or click × to remove a page.
              </p>
            </div>

            {/* Page List with Drag and Drop */}
            {pages.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={pages.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                    {pages.map((page, index) => (
                      <SortablePageItem
                        key={page.id}
                        page={page}
                        position={index}
                        totalItems={pages.length}
                        onMoveUp={() => movePageUp(index)}
                        onMoveDown={() => movePageDown(index)}
                        onRemove={() => removePage(page.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-[#1a1a1a] bg-black/20">
                <p className="text-sm text-[#888888] mb-2">All pages have been removed</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetOrder}
                  disabled
                  className="border-[#222222] text-[#555555] text-xs"
                >
                  No pages remaining
                </Button>
              </div>
            )}

            {/* Order Summary */}
            {pages.length > 0 && (
              <div className="p-3 rounded-lg bg-black/40 border border-[#1a1a1a]">
                <p className="text-xs text-[#AAAAAA] mb-1">
                  <span className="text-[#8A2BE2] font-semibold">New order:</span>
                </p>
                <p className="text-sm text-white font-mono">{orderSummary}</p>
              </div>
            )}

            {/* Download Button */}
            <Button
              onClick={rearrangeAndDownload}
              disabled={isProcessing || pages.length === 0}
              className="w-full h-12 text-base font-semibold cta-primary"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Rearranging Pages...' : 'Rearrange & Download PDF'}
            </Button>
          </>
        )}

        {/* Loading Indicator */}
        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="h-8 w-8 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-[#AAAAAA]">Rearranging PDF pages...</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
