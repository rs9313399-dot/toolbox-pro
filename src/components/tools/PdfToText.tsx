'use client';

import { useState, useRef, useCallback } from 'react';
import { FileText, Upload, Download, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'How does PDF to Text extraction work?',
    answer:
      'This tool uses the PDF.js library to parse your PDF file and extract text content from every page. It reads the text layer embedded in the PDF and concatenates it into plain text. All processing happens entirely in your browser — your file is never uploaded to any server.',
  },
  {
    question: 'Will the extracted text preserve the original formatting?',
    answer:
      'The extracted text captures the raw text content from the PDF but does not preserve complex formatting like columns, tables, or precise positioning. Text is extracted in reading order on a per-page basis. For documents with multi-column layouts or complex structures, the text may appear in a different order than visually presented.',
  },
  {
    question: 'Why is some text missing or garbled in the output?',
    answer:
      'Some PDFs use custom font encoding or embed text as images rather than selectable text. In these cases, the text layer may be incomplete or unreadable. Scanned documents (image-based PDFs) contain no text layer at all — for those, you would need OCR (Optical Character Recognition) software, which this tool does not provide.',
  },
  {
    question: 'Is there a file size or page limit?',
    answer:
      'There is no strict limit, but very large PDFs (hundreds of pages or megabytes) may take longer to process and consume significant browser memory. For most documents under 100 MB, extraction completes in seconds. If you encounter issues with large files, try closing other browser tabs to free up memory.',
  },
  {
    question: 'Is my PDF data secure and private?',
    answer:
      'Absolutely. All processing happens client-side in your browser using JavaScript. Your PDF is never uploaded to any server, and no data leaves your device. Once you close the page, all file data is cleared from memory. We take your privacy seriously — that\'s why every tool on this site runs locally.',
  },
];

const relatedTools = [
  {
    name: 'Image to PDF',
    hash: '#/tools/image-to-pdf',
    description: 'Convert multiple images into a single PDF.',
  },
  {
    name: 'PDF to Image',
    hash: '#/tools/pdf-to-image',
    description: 'Convert PDF pages to high-quality PNG images.',
  },
  {
    name: 'PDF Compress',
    hash: '#/tools/pdf-compress',
    description: 'Compress PDF files to reduce file size.',
  },
];

interface PdfToTextProps {
  onNavigate: (hash: string) => void;
}

export default function PdfToText({ onNavigate }: PdfToTextProps) {
  const [extractedText, setExtractedText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [pdfName, setPdfName] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charCount = extractedText.length;
  const wordCount = extractedText.trim() === '' ? 0 : extractedText.trim().split(/\s+/).length;

  const extractText = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please upload a valid PDF file');
      return;
    }

    setIsExtracting(true);
    setPdfName(file.name.replace(/\.pdf$/i, ''));
    setExtractedText('');
    setPageCount(0);
    setProgress(0);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;
      setPageCount(totalPages);

      let fullText = '';
      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
        setProgress(Math.round((i / totalPages) * 100));
      }

      setExtractedText(fullText.trim());
      toast.success(`Extracted text from ${totalPages} page(s) successfully`);
    } catch (error) {
      console.error('PDF text extraction error:', error);
      toast.error(
        'Failed to extract text. The file may be corrupted, encrypted, or unsupported.'
      );
    } finally {
      setIsExtracting(false);
      setProgress(0);
    }
  }, []);

  const handleCopy = useCallback(async () => {
    if (!extractedText) return;

    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  }, [extractedText]);

  const handleDownload = useCallback(() => {
    if (!extractedText) return;

    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pdfName || 'extracted'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Download started');
  }, [extractedText, pdfName]);

  const handleReset = useCallback(() => {
    setExtractedText('');
    setPdfName('');
    setPageCount(0);
    setIsDragging(false);
    setCopied(false);
    setProgress(0);
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      extractText(file);
    },
    [extractText]
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

  return (
    <ToolLayout
      title="PDF to Text Converter"
      description="Extract text from any PDF file directly in your browser. Upload a PDF, get plain text from all pages instantly. Copy to clipboard or download as a .txt file. Your files stay private — everything runs locally on your device."
      icon={FileText}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {extractedText === '' && !isExtracting ? (
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
            {/* Header with file info & actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20">
                  <FileText className="h-5 w-5 text-[#8A2BE2]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white truncate max-w-[280px]">
                    {pdfName}.pdf
                  </p>
                  <p className="text-xs text-[#888888]">
                    {pageCount} page{pageCount !== 1 ? 's' : ''} &middot;{' '}
                    {charCount.toLocaleString()} characters &middot;{' '}
                    {wordCount.toLocaleString()} words
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="border-[#222222] text-white hover:border-[#8A2BE2]/50 hover:bg-[#8A2BE2]/10"
                  disabled={!extractedText}
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-1 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button
                  onClick={handleDownload}
                  className="cta-primary"
                  size="sm"
                  disabled={!extractedText}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download .txt
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="border-[#222222] text-white hover:border-[#8A2BE2]/50"
                >
                  New File
                </Button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-black/30 border border-[#1a1a1a] p-4 text-center">
                <p className="text-xs text-[#888888] mb-1">Pages</p>
                <p className="text-xl font-bold text-white">{pageCount}</p>
              </div>
              <div className="rounded-xl bg-black/30 border border-[#1a1a1a] p-4 text-center">
                <p className="text-xs text-[#888888] mb-1">Characters</p>
                <p className="text-xl font-bold text-white">
                  {charCount.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-black/30 border border-[#1a1a1a] p-4 text-center">
                <p className="text-xs text-[#888888] mb-1">Words</p>
                <p className="text-xl font-bold text-white">
                  {wordCount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Extracted Text Area */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white">
                Extracted Text
              </Label>
              <Textarea
                value={extractedText}
                readOnly
                className="w-full min-h-[400px] bg-black/30 border-[#1a1a1a] text-[#CCCCCC] text-sm font-mono resize-y rounded-xl focus-visible:ring-[#8A2BE2]/30 focus-visible:border-[#8A2BE2]/50 placeholder:text-[#555555]"
                placeholder="Extracted text will appear here..."
              />
            </div>

            {/* Progress indicator during extraction */}
            {isExtracting && (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="h-8 w-8 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-[#AAAAAA]">
                  Extracting text... {progress}%
                </p>
              </div>
            )}
          </>
        )}

        {/* Loading state when extracting (shown before text is available) */}
        {isExtracting && extractedText === '' && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="h-8 w-8 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-[#AAAAAA]">
              Reading PDF file... {progress}%
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
