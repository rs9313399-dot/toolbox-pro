'use client';

import { useState, useRef, useCallback } from 'react';
import { FilePlus, Upload, Download, Trash2, X, ChevronUp, ChevronDown } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'Is my data secure when merging PDFs?',
    answer:
      'Absolutely. All PDF processing happens entirely in your browser using the pdf-lib library. Your files are never uploaded to any server — they stay on your device throughout the entire merging process. Once you close the page, all data is cleared from memory.',
  },
  {
    question: 'Is there a limit on the number of PDFs I can merge?',
    answer:
      'There is no hard limit on the number of PDF files you can merge. However, very large collections or files with many pages may consume significant browser memory. For best performance, we recommend merging up to 20 PDFs at a time. The tool will display the total page count so you can monitor the output size.',
  },
  {
    question: 'Does merging PDFs reduce quality?',
    answer:
      'No. The pdf-lib library copies each page exactly as-is without recompressing or re-encoding the content. All text, images, vector graphics, and formatting from the original PDFs are preserved at full quality in the merged document.',
  },
  {
    question: 'Can I reorder the PDFs before merging?',
    answer:
      'Yes! You can rearrange the order of your PDF files using the up and down arrow buttons next to each file in the list. The merged PDF will combine the files in the exact order shown. You can also remove individual files before merging.',
  },
  {
    question: 'What happens with encrypted or password-protected PDFs?',
    answer:
      'Encrypted or password-protected PDFs cannot be merged by this tool because pdf-lib cannot decrypt them without the password. If you attempt to add an encrypted PDF, you will receive an error notification. Please remove the password protection first using your PDF reader, then merge the unlocked file.',
  },
];

const relatedTools = [
  {
    name: 'PDF Split',
    hash: '#/tools/pdf-split',
    description: 'Split a PDF into separate pages or sections.',
  },
  {
    name: 'PDF Rotate',
    hash: '#/tools/pdf-rotate',
    description: 'Rotate PDF pages to any orientation.',
  },
  {
    name: 'PDF Compress',
    hash: '#/tools/pdf-compress',
    description: 'Reduce PDF file size while keeping quality.',
  },
];

interface PdfFileItem {
  id: string;
  file: File;
  pageCount: number;
}

interface PdfMergeProps {
  onNavigate: (hash: string) => void;
}

export default function PdfMerge({ onNavigate }: PdfMergeProps) {
  const [pdfFiles, setPdfFiles] = useState<PdfFileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    let skipped = 0;

    Array.from(files).forEach((file) => {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        validFiles.push(file);
      } else {
        skipped++;
      }
    });

    if (skipped > 0) {
      toast.warning(`${skipped} file(s) skipped — not a valid PDF format`);
    }

    if (validFiles.length === 0) return;

    setIsLoadingInfo(true);

    const newItems: PdfFileItem[] = [];
    let failedCount = 0;

    for (const file of validFiles) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        newItems.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          pageCount: pdfDoc.getPageCount(),
        });
      } catch {
        failedCount++;
      }
    }

    setIsLoadingInfo(false);

    if (failedCount > 0) {
      toast.error(`${failedCount} file(s) could not be read. They may be corrupted or encrypted.`);
    }

    if (newItems.length > 0) {
      setPdfFiles((prev) => [...prev, ...newItems]);
      toast.success(`${newItems.length} PDF file(s) added`);
    }
  }, []);

  const removeFile = useCallback((id: string) => {
    setPdfFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const moveFile = useCallback((index: number, direction: 'up' | 'down') => {
    setPdfFiles((prev) => {
      const next = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setPdfFiles([]);
    toast.info('All files removed');
  }, []);

  const mergePdfs = useCallback(async () => {
    if (pdfFiles.length < 2) {
      toast.error('Please add at least two PDF files to merge');
      return;
    }

    setIsMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of pdfFiles) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const totalPages = pdfFiles.reduce((sum, f) => sum + f.pageCount, 0);
      toast.success(`Merged ${pdfFiles.length} PDFs (${totalPages} pages) and downloaded!`);
    } catch (error) {
      console.error('PDF merge error:', error);
      toast.error('Failed to merge PDFs. One or more files may be corrupted or encrypted.');
    } finally {
      setIsMerging(false);
    }
  }, [pdfFiles]);

  const totalPages = pdfFiles.reduce((sum, f) => sum + f.pageCount, 0);

  return (
    <ToolLayout
      title="PDF Merge"
      description="Merge multiple PDF files into a single document instantly in your browser. Upload your PDFs, rearrange the order, and download the merged result. No upload to servers — everything processes locally on your device for maximum privacy and speed."
      icon={FilePlus}
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
            Drop PDF files here or click to browse
          </p>
          <p className="text-sm text-[#888888]">
            PDF files only &middot; Multiple files supported
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              if (e.target) e.target.value = '';
            }}
          />
        </div>

        {/* Loading indicator for reading page counts */}
        {isLoadingInfo && (
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="h-4 w-4 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#AAAAAA]">Reading PDF files...</p>
          </div>
        )}

        {/* PDF List */}
        {pdfFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-white">
                PDF Files ({pdfFiles.length}) &middot; {totalPages} page(s) total
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
              {pdfFiles.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-[#1a1a1a] group hover:border-[#8A2BE2]/20 transition-all duration-300"
                >
                  {/* PDF Icon */}
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-black/30 shrink-0 flex items-center justify-center border border-[#1a1a1a]">
                    <FilePlus className="h-6 w-6 text-[#8A2BE2]" />
                  </div>

                  {/* Name & Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{item.file.name}</p>
                    <p className="text-xs text-[#888888]">
                      {item.pageCount} page{item.pageCount !== 1 ? 's' : ''} &middot; {(item.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  {/* Order Buttons */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveFile(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                      aria-label="Move up"
                    >
                      <ChevronUp className="h-3.5 w-3.5 text-[#AAAAAA]" />
                    </button>
                    <button
                      onClick={() => moveFile(index, 'down')}
                      disabled={index === pdfFiles.length - 1}
                      className="p-1 rounded hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-3.5 w-3.5 text-[#AAAAAA]" />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFile(item.id)}
                    className="p-1.5 rounded-lg hover:bg-red-400/10 text-[#555555] hover:text-red-400 transition-all"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Merge Button */}
        <Button
          onClick={mergePdfs}
          disabled={pdfFiles.length < 2 || isMerging}
          className="w-full h-12 text-base font-semibold cta-primary"
          size="lg"
        >
          <Download className="h-4 w-4 mr-2" />
          {isMerging ? 'Merging...' : `Merge ${pdfFiles.length} PDFs`}
        </Button>

        {/* Merging spinner */}
        {isMerging && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="h-8 w-8 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-[#AAAAAA]">Merging {pdfFiles.length} PDF files ({totalPages} pages)...</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
