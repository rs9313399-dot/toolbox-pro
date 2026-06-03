'use client';

import { useState, useRef, useCallback } from 'react';
import { Droplets, Upload, Download, Trash2 } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
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
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'How does the PDF watermark tool work?',
    answer:
      'This tool uses the pdf-lib library to add text watermarks directly to your PDF documents. It loads your PDF into memory, embeds a standard font, and draws the watermark text on every page with your chosen settings (font size, opacity, color, position, and rotation). All processing happens entirely in your browser — your files are never uploaded to any server.',
  },
  {
    question: 'Can I customize the watermark appearance?',
    answer:
      'Yes! You can customize the watermark text, font size (12–120pt), opacity (5%–100%), color (gray, red, blue, green, or custom hex), and position (diagonal, center, top, or bottom). The diagonal position rotates the text 45 degrees across the page for a classic watermark look.',
  },
  {
    question: 'Is there a file size or page limit?',
    answer:
      'There is no strict limit on the number of pages. However, very large PDFs (100+ pages) may take longer to process and consume more browser memory. The tool processes all pages sequentially and applies the same watermark settings to each page. For extremely large documents, we recommend processing in smaller batches.',
  },
  {
    question: 'Will the watermark affect the existing PDF content?',
    answer:
      'The watermark is drawn as a new layer on top of the existing page content. Since watermarks are typically semi-transparent (low opacity), the original content remains readable underneath. The tool does not modify or remove any existing text, images, or annotations in your PDF — it only adds the watermark overlay.',
  },
  {
    question: 'Can I remove a watermark after adding it?',
    answer:
      'Once a watermark is added and the PDF is saved, the watermark becomes part of the page content and cannot be easily removed with this tool. We recommend keeping a backup of your original PDF before adding watermarks. If you need to change the watermark, start over with the original file and apply new settings.',
  },
];

const relatedTools = [
  {
    name: 'PDF Rotate',
    hash: '#/tools/pdf-rotate',
    description: 'Rotate PDF pages to any orientation.',
  },
  {
    name: 'PDF Merge',
    hash: '#/tools/pdf-merge',
    description: 'Merge multiple PDF files into one.',
  },
  {
    name: 'PDF Protect',
    hash: '#/tools/pdf-protect',
    description: 'Add password protection to PDF files.',
  },
];

type WatermarkPosition = 'diagonal' | 'center' | 'top' | 'bottom';

interface WatermarkColor {
  label: string;
  value: string;
  rgb: [number, number, number];
}

const PRESET_COLORS: WatermarkColor[] = [
  { label: 'Gray', value: 'gray', rgb: [0.5, 0.5, 0.5] },
  { label: 'Red', value: 'red', rgb: [0.8, 0.2, 0.2] },
  { label: 'Blue', value: 'blue', rgb: [0.2, 0.3, 0.7] },
  { label: 'Green', value: 'green', rgb: [0.2, 0.6, 0.3] },
  { label: 'Custom', value: 'custom', rgb: [0.5, 0.5, 0.5] },
];

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return [r, g, b];
}

interface PdfWatermarkProps {
  onNavigate: (hash: string) => void;
}

export default function PdfWatermark({ onNavigate }: PdfWatermarkProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(30);
  const [colorPreset, setColorPreset] = useState('gray');
  const [customColor, setCustomColor] = useState('#888888');
  const [position, setPosition] = useState<WatermarkPosition>('diagonal');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getColorRgb = useCallback((): [number, number, number] => {
    if (colorPreset === 'custom') {
      return hexToRgb(customColor);
    }
    const preset = PRESET_COLORS.find((c) => c.value === colorPreset);
    return preset ? preset.rgb : [0.5, 0.5, 0.5];
  }, [colorPreset, customColor]);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please upload a valid PDF file');
      return;
    }
    setPdfFile(file);
    toast.success(`Loaded: ${file.name}`);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processWatermark = useCallback(async () => {
    if (!pdfFile) {
      toast.error('Please upload a PDF file first');
      return;
    }

    if (!watermarkText.trim()) {
      toast.error('Please enter watermark text');
      return;
    }

    setIsProcessing(true);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const [r, g, b] = getColorRgb();
      const text = watermarkText.trim();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const opacityValue = opacity / 100;

        let x: number;
        let y: number;
        let rotate: ReturnType<typeof degrees>;

        switch (position) {
          case 'diagonal':
            x = width / 2 - textWidth / 2;
            y = height / 2;
            rotate = degrees(45);
            break;
          case 'center':
            x = width / 2 - textWidth / 2;
            y = height / 2;
            rotate = degrees(0);
            break;
          case 'top':
            x = width / 2 - textWidth / 2;
            y = height - fontSize - 20;
            rotate = degrees(0);
            break;
          case 'bottom':
            x = width / 2 - textWidth / 2;
            y = 20;
            rotate = degrees(0);
            break;
          default:
            x = width / 2 - textWidth / 2;
            y = height / 2;
            rotate = degrees(45);
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(r, g, b),
          opacity: opacityValue,
          rotate,
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfFile.name.replace(/\.pdf$/i, '') + '-watermarked.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Watermark added to ${pages.length} page(s)`);
    } catch (error) {
      console.error('Watermark error:', error);
      toast.error(
        'Failed to add watermark. The file may be corrupted or encrypted.'
      );
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFile, watermarkText, fontSize, opacity, getColorRgb, position]);

  const reset = useCallback(() => {
    setPdfFile(null);
    setWatermarkText('CONFIDENTIAL');
    setFontSize(48);
    setOpacity(30);
    setColorPreset('gray');
    setCustomColor('#888888');
    setPosition('diagonal');
    toast.info('Reset complete');
  }, []);

  return (
    <ToolLayout
      title="PDF Watermark"
      description="Add text watermarks to your PDF documents directly in the browser. Customize font size, opacity, color, and position to create professional watermarks. All processing happens locally — your files never leave your device."
      icon={Droplets}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {/* Upload Area */}
        {!pdfFile ? (
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
                if (file) handleFileSelect(file);
              }}
            />
          </div>
        ) : (
          <>
            {/* File Info Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20">
                  <Droplets className="h-5 w-5 text-[#8A2BE2]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {pdfFile.name}
                  </p>
                  <p className="text-xs text-[#888888]">
                    {(pdfFile.size / 1024).toFixed(1)} KB
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
                Remove
              </Button>
            </div>

            {/* Watermark Text */}
            <div>
              <Label className="text-sm font-medium text-white mb-2 block">
                Watermark Text
              </Label>
              <Input
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Enter watermark text..."
                className="bg-black/40 border-[#222222] text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:ring-[#8A2BE2]/20"
              />
            </div>

            {/* Font Size */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-white">
                  Font Size
                </Label>
                <span className="text-sm font-mono text-[#8A2BE2] font-bold">
                  {fontSize}pt
                </span>
              </div>
              <Slider
                value={[fontSize]}
                min={12}
                max={120}
                step={1}
                onValueChange={(value) => setFontSize(value[0])}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-[#555555]">12pt</span>
                <span className="text-[10px] text-[#555555]">120pt</span>
              </div>
            </div>

            {/* Opacity */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-white">
                  Opacity
                </Label>
                <span className="text-sm font-mono text-[#8A2BE2] font-bold">
                  {opacity}%
                </span>
              </div>
              <Slider
                value={[opacity]}
                min={5}
                max={100}
                step={1}
                onValueChange={(value) => setOpacity(value[0])}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-[#555555]">5%</span>
                <span className="text-[10px] text-[#555555]">100%</span>
              </div>
            </div>

            {/* Color & Position Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Color */}
              <div>
                <Label className="text-sm font-medium text-white mb-2 block">
                  Color
                </Label>
                <Select value={colorPreset} onValueChange={setColorPreset}>
                  <SelectTrigger className="w-full bg-black/40 border-[#222222] text-white">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-[#333333]">
                    {PRESET_COLORS.map((color) => (
                      <SelectItem
                        key={color.value}
                        value={color.value}
                        className="text-white focus:bg-[#8A2BE2]/10 focus:text-white"
                      >
                        {color.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {colorPreset === 'custom' && (
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="h-8 w-8 rounded-lg border border-[#222222] cursor-pointer bg-transparent"
                    />
                    <Input
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      placeholder="#888888"
                      className="bg-black/40 border-[#222222] text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:ring-[#8A2BE2]/20 h-8 text-xs font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Position */}
              <div>
                <Label className="text-sm font-medium text-white mb-2 block">
                  Position
                </Label>
                <Select
                  value={position}
                  onValueChange={(val) => setPosition(val as WatermarkPosition)}
                >
                  <SelectTrigger className="w-full bg-black/40 border-[#222222] text-white">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-[#333333]">
                    <SelectItem
                      value="diagonal"
                      className="text-white focus:bg-[#8A2BE2]/10 focus:text-white"
                    >
                      Diagonal (45°)
                    </SelectItem>
                    <SelectItem
                      value="center"
                      className="text-white focus:bg-[#8A2BE2]/10 focus:text-white"
                    >
                      Center
                    </SelectItem>
                    <SelectItem
                      value="top"
                      className="text-white focus:bg-[#8A2BE2]/10 focus:text-white"
                    >
                      Top
                    </SelectItem>
                    <SelectItem
                      value="bottom"
                      className="text-white focus:bg-[#8A2BE2]/10 focus:text-white"
                    >
                      Bottom
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview hint */}
            <div className="p-4 rounded-xl bg-black/40 border border-[#1a1a1a]">
              <p className="text-xs text-[#888888] mb-1">Preview</p>
              <div className="relative h-24 rounded-lg bg-white/5 border border-[#222222] overflow-hidden flex items-center justify-center">
                <span
                  className="text-white select-none whitespace-nowrap"
                  style={{
                    fontSize: `${Math.min(fontSize / 3, 24)}px`,
                    opacity: opacity / 100,
                    color:
                      colorPreset === 'custom'
                        ? customColor
                        : `rgb(${(getColorRgb()[0] * 255).toFixed(0)}, ${(getColorRgb()[1] * 255).toFixed(0)}, ${(getColorRgb()[2] * 255).toFixed(0)})`,
                    transform:
                      position === 'diagonal' ? 'rotate(-45deg)' : 'none',
                    fontWeight: 'bold',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                  }}
                >
                  {watermarkText || 'WATERMARK'}
                </span>
              </div>
            </div>

            {/* Process Button */}
            <Button
              onClick={processWatermark}
              disabled={!pdfFile || !watermarkText.trim() || isProcessing}
              className="w-full h-12 text-base font-semibold cta-primary"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Adding Watermark...' : 'Add Watermark & Download'}
            </Button>
          </>
        )}

        {/* Loading Overlay */}
        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="h-8 w-8 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-[#AAAAAA]">
              Adding watermark to all pages...
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
