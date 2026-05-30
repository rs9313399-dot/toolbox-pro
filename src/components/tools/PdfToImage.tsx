'use client';

import { useState, useRef, useCallback } from 'react';
import { FileImage, Upload, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'How does PDF to Image conversion work?',
    answer:
      'This tool uses the PDF.js library to render each page of your PDF onto an HTML Canvas element at your chosen resolution. The canvas is then exported as a PNG image file. All rendering happens locally in your browser — no data is sent to any server.',
  },
  {
    question: 'What image quality and resolution can I expect?',
    answer:
      'The output quality depends on the scale factor you choose. A scale of 1x renders at the PDF\'s native resolution (72 DPI), while 2x gives 144 DPI and 3x gives 216 DPI. Higher scales produce sharper, more detailed images but result in larger file sizes. We recommend 2x for most use cases.',
  },
  {
    question: 'What about file size for the exported images?',
    answer:
      'Exported PNG images are lossless, so file sizes depend on the page complexity and the scale factor you choose. A typical text-based PDF page at 2x scale produces a PNG around 200-500 KB. Pages with photos or complex graphics will be larger. You can use our Image Compressor tool to reduce file sizes after exporting.',
  },
  {
    question: 'Which browsers support this tool?',
    answer:
      'This tool works in all modern browsers that support the Canvas API and Web Workers, including Chrome, Firefox, Safari, and Edge. For the best performance with large PDFs, we recommend using a Chromium-based browser (Chrome, Edge, Brave).',
  },
  {
    question: 'Is there a page limit for PDF conversion?',
    answer:
      'There is no strict page limit, but very large PDFs (100+ pages) may take longer to process and consume significant browser memory. Each page is rendered individually, so you can track progress as pages are converted. For extremely large documents, we recommend converting in smaller batches.',
  },
];

const relatedTools = [
  {
    name: 'Image to PDF',
    hash: '#/tools/image-to-pdf',
    description: 'Convert multiple images into a single PDF.',
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

interface PageImage {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
}

interface PdfToImageProps {
  onNavigate: (hash: string) => void;
}

export default function PdfToImage({ onNavigate }: PdfToImageProps) {
  const [pages, setPages] = useState<PageImage[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfName, setPdfName] = useState('');
  const [scale, setScale] = useState(2);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertPdf = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please upload a valid PDF file');
      return;
    }

    setIsConverting(true);
    setPdfName(file.name.replace(/\.pdf$/i, ''));

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const pageImages: PageImage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          toast.error(`Failed to render page ${i}`);
          continue;
        }

        await page.render({ canvasContext: ctx, viewport }).promise;
        const dataUrl = canvas.toDataURL('image/png');

        pageImages.push({
          pageNumber: i,
          dataUrl,
          width: viewport.width,
          height: viewport.height,
        });
      }

      setPages(pageImages);
      toast.success(`Rendered ${totalPages} page(s) successfully`);
    } catch (error) {
      console.error('PDF render error:', error);
      toast.error('Failed to render PDF. The file may be corrupted or encrypted.');
    } finally {
      setIsConverting(false);
    }
  }, [scale]);

  const downloadPage = useCallback(
    (page: PageImage) => {
      const link = document.createElement('a');
      link.href = page.dataUrl;
      link.download = `${pdfName || 'page'}_${page.pageNumber}.png`;
      link.click();
    },
    [pdfName]
  );

  const downloadAll = useCallback(() => {
    if (pages.length === 0) return;
    pages.forEach((page, idx) => {
      setTimeout(() => downloadPage(page), idx * 300);
    });
    toast.info(`Downloading ${pages.length} image(s)...`);
  }, [pages, downloadPage]);

  const reset = useCallback(() => {
    setPages([]);
    setPdfName('');
  }, []);

  return (
    <ToolLayout
      title="PDF to Image Converter"
      description="Convert PDF pages to high-quality images directly in your browser. Upload any PDF file and export each page as a PNG image. Perfect for sharing PDF content as images or extracting visual content from documents."
      icon={FileImage}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {pages.length === 0 ? (
          <>
            {/* Scale/Quality Option */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-white">
                  Quality / Scale
                </Label>
                <span className="text-sm font-mono text-[#8A2BE2] font-bold">
                  {scale}x
                </span>
              </div>
              <Slider
                value={[scale]}
                min={1}
                max={4}
                step={1}
                onValueChange={(value) => setScale(value[0])}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-[#555555]">1x (72 DPI)</span>
                <span className="text-[10px] text-[#555555]">2x (144 DPI)</span>
                <span className="text-[10px] text-[#555555]">3x (216 DPI)</span>
                <span className="text-[10px] text-[#555555]">4x (288 DPI)</span>
              </div>
              <p className="text-xs text-[#666666] mt-2">
                Higher scale produces sharper images but larger file sizes. 2x is recommended for most uses.
              </p>
            </div>

            {/* Upload Area */}
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
                  if (file) convertPdf(file);
                }}
              />
            </div>
          </>
        ) : (
          <>
            {/* Header with actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <Label className="text-sm font-medium text-white">
                  {pdfName}.pdf &middot; {pages.length} page(s) &middot; {scale}x scale
                </Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={downloadAll} className="cta-primary" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download All
                </Button>
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
            </div>

            {/* Page Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-1">
              {pages.map((page) => (
                <div
                  key={page.pageNumber}
                  className="rounded-xl bg-black/40 border border-[#1a1a1a] overflow-hidden group hover:border-[#8A2BE2]/20 transition-all duration-300"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-black/30">
                    <img
                      src={page.dataUrl}
                      alt={`Page ${page.pageNumber}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-xs text-[#AAAAAA]">
                      Page {page.pageNumber}
                    </span>
                    <button
                      onClick={() => downloadPage(page)}
                      className="p-1.5 rounded-lg hover:bg-[#8A2BE2]/10 text-[#8A2BE2] transition-all"
                      aria-label={`Download page ${page.pageNumber}`}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Loading Overlay */}
        {isConverting && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="h-8 w-8 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-[#AAAAAA]">Rendering PDF pages at {scale}x scale...</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
