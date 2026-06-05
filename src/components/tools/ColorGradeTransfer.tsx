'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Palette,
  Upload,
  X,
  Download,
  RotateCcw,
  Sparkles,
  Image as ImageIcon,
  ArrowRight,
  SlidersHorizontal,
  Info,
  Crown,
} from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

interface ColorGradeTransferProps {
  onNavigate: (hash: string) => void;
}

export default function ColorGradeTransfer({ onNavigate }: ColorGradeTransferProps) {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [intensity, setIntensity] = useState(75);
  const [preserveDetails, setPreserveDetails] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const referenceRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: 'input' | 'reference') => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (type === 'input') setInputImage(result);
        else setReferenceImage(result);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const extractColorPalette = (img: HTMLImageElement): number[][] => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const size = 50;
    canvas.width = size;
    canvas.height = size;
    ctx.drawImage(img, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;

    // K-means-like clustering for dominant colors
    const colors: number[][] = [];
    const step = Math.floor(data.length / 4 / 64);
    for (let i = 0; i < data.length; i += step * 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r + g + b > 15 && r + g + b < 740) {
        colors.push([r, g, b]);
      }
    }

    // Simple dominant color extraction by bucketing
    const buckets: Record<string, { sum: number[]; count: number }> = {};
    for (const [r, g, b] of colors) {
      const key = `${Math.floor(r / 32)}-${Math.floor(g / 32)}-${Math.floor(b / 32)}`;
      if (!buckets[key]) buckets[key] = { sum: [0, 0, 0], count: 0 };
      buckets[key].sum[0] += r;
      buckets[key].sum[1] += g;
      buckets[key].sum[2] += b;
      buckets[key].count++;
    }

    return Object.values(buckets)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
      .map((b) => [Math.round(b.sum[0] / b.count), Math.round(b.sum[1] / b.count), Math.round(b.sum[2] / b.count)]);
  };

  const computeColorMapping = (srcColors: number[][], refColors: number[][]): Float32Array => {
    // Create a 256-entry LUT for each channel
    const lutR = new Float32Array(256);
    const lutG = new Float32Array(256);
    const lutB = new Float32Array(256);

    // Build average shift from source palette to reference palette
    let srcAvgR = 0, srcAvgG = 0, srcAvgB = 0;
    let refAvgR = 0, refAvgG = 0, refAvgB = 0;
    const n = Math.min(srcColors.length, refColors.length);
    for (let i = 0; i < n; i++) {
      srcAvgR += srcColors[i][0]; srcAvgG += srcColors[i][1]; srcAvgB += srcColors[i][2];
      refAvgR += refColors[i][0]; refAvgG += refColors[i][1]; refAvgB += refColors[i][2];
    }
    if (n > 0) {
      srcAvgR /= n; srcAvgG /= n; srcAvgB /= n;
      refAvgR /= n; refAvgG /= n; refAvgB /= n;
    }

    // Compute std dev
    let srcStdR = 0, srcStdG = 0, srcStdB = 0;
    let refStdR = 0, refStdG = 0, refStdB = 0;
    for (let i = 0; i < n; i++) {
      srcStdR += (srcColors[i][0] - srcAvgR) ** 2;
      srcStdG += (srcColors[i][1] - srcAvgG) ** 2;
      srcStdB += (srcColors[i][2] - srcAvgB) ** 2;
      refStdR += (refColors[i][0] - refAvgR) ** 2;
      refStdG += (refColors[i][1] - refAvgG) ** 2;
      refStdB += (refColors[i][2] - refAvgB) ** 2;
    }
    srcStdR = Math.sqrt(srcStdR / n) || 1;
    srcStdG = Math.sqrt(srcStdG / n) || 1;
    srcStdB = Math.sqrt(srcStdB / n) || 1;
    refStdR = Math.sqrt(refStdR / n) || 1;
    refStdG = Math.sqrt(refStdG / n) || 1;
    refStdB = Math.sqrt(refStdB / n) || 1;

    for (let i = 0; i < 256; i++) {
      lutR[i] = ((i - srcAvgR) * (refStdR / srcStdR) + refAvgR);
      lutG[i] = ((i - srcAvgG) * (refStdG / srcStdG) + refAvgG);
      lutB[i] = ((i - srcAvgB) * (refStdB / srcStdB) + refAvgB);
    }

    // Combine into single array
    const lut = new Float32Array(256 * 3);
    for (let i = 0; i < 256; i++) {
      lut[i] = lutR[i];
      lut[256 + i] = lutG[i];
      lut[512 + i] = lutB[i];
    }
    return lut;
  };

  const applyColorTransfer = useCallback(() => {
    if (!inputImage || !referenceImage) return;
    setIsProcessing(true);

    const srcImg = new Image();
    const refImg = new Image();
    srcImg.crossOrigin = 'anonymous';
    refImg.crossOrigin = 'anonymous';

    let loaded = 0;
    const onLoad = () => {
      loaded++;
      if (loaded < 2) return;

      // Extract palettes
      const srcColors = extractColorPalette(srcImg);
      const refColors = extractColorPalette(refImg);

      // Compute mapping
      const lut = computeColorMapping(srcColors, refColors);

      // Apply to input image
      const canvas = document.createElement('canvas');
      canvas.width = srcImg.naturalWidth;
      canvas.height = srcImg.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(srcImg, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const factor = intensity / 100;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const newR = lut[r];
        const newG = lut[256 + g];
        const newB = lut[512 + b];

        // Blend based on intensity
        data[i] = Math.max(0, Math.min(255, Math.round(r + (newR - r) * factor)));
        data[i + 1] = Math.max(0, Math.min(255, Math.round(g + (newG - g) * factor)));
        data[i + 2] = Math.max(0, Math.min(255, Math.round(b + (newB - b) * factor)));

        // Preserve luminance details
        if (preserveDetails) {
          const origLum = 0.299 * r + 0.587 * g + 0.114 * b;
          const newLum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          if (newLum > 0) {
            const lumRatio = origLum / newLum;
            const blend = 0.3; // preserve 30% of original luminance structure
            const adjustedRatio = 1 + (lumRatio - 1) * blend;
            data[i] = Math.max(0, Math.min(255, Math.round(data[i] * adjustedRatio)));
            data[i + 1] = Math.max(0, Math.min(255, Math.round(data[i + 1] * adjustedRatio)));
            data[i + 2] = Math.max(0, Math.min(255, Math.round(data[i + 2] * adjustedRatio)));
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setOutputImage(canvas.toDataURL('image/png'));
      setIsProcessing(false);
    };

    srcImg.onload = onLoad;
    refImg.onload = onLoad;
    srcImg.src = inputImage;
    refImg.src = referenceImage;
  }, [inputImage, referenceImage, intensity, preserveDetails]);

  const handleDownload = () => {
    if (!outputImage) return;
    const a = document.createElement('a');
    a.href = outputImage;
    a.download = 'color-graded-image.png';
    a.click();
  };

  const handleReset = () => {
    setInputImage(null);
    setReferenceImage(null);
    setOutputImage(null);
    setIntensity(75);
    setPreserveDetails(true);
  };

  const faqItems = [
    {
      question: 'How does Color Grade Transfer work?',
      answer:
        'Color Grade Transfer analyzes the color palette and distribution of a reference image, then applies those same color characteristics to your input image. It works by extracting dominant colors and computing statistical color mappings (mean and standard deviation shifts for each RGB channel), then blending the transformation at your chosen intensity level. This technique is similar to what professional photo editors do manually with color grading tools like LUTs (Look-Up Tables).',
    },
    {
      question: 'What types of images work best?',
      answer:
        'Both your input and reference images should be well-exposed photographs for the best results. Portraits, landscapes, and street photography work particularly well. Images with extreme highlights or shadows may produce less accurate color transfers. The tool processes everything locally in your browser, so there are no file size limits beyond what your device can handle.',
    },
    {
      question: 'What does the Intensity slider do?',
      answer:
        'The Intensity slider controls how strongly the reference color palette is applied to your image. At 0%, no changes are made. At 100%, the full color transformation is applied. Values between 50-80% typically produce the most natural-looking results, giving your image the mood and tone of the reference while preserving its original character.',
    },
    {
      question: 'What does "Preserve Details" mean?',
      answer:
        'When enabled, the Preserve Details option maintains the original luminance (brightness) structure of your image while only changing the color hues and saturation. This prevents the color transfer from flattening or blowing out highlights and shadows, keeping your photo looking natural with its original contrast and depth.',
    },
    {
      question: 'Is my data private?',
      answer:
        'Absolutely. All image processing happens entirely in your browser using the HTML5 Canvas API. Your images are never uploaded to any server, never leave your device, and are never stored anywhere. Once you close the page, the processed images exist only in your downloads if you chose to save them.',
    },
  ];

  const relatedTools = [
    { name: 'Image Compressor', hash: '#/tools/image-compressor', description: 'Compress images without losing quality' },
    { name: 'Image Resizer', hash: '#/tools/image-resizer', description: 'Resize images to any dimension' },
    { name: 'Background Remover', hash: '#/tools/background-remover', description: 'Remove image backgrounds instantly' },
  ];

  return (
    <ToolLayout
      title="Color Grade Transfer"
      description="Transfer the color palette and mood from any reference photo to your image. Powered by client-side color analysis and statistical mapping."
      icon={Palette}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {/* PRO Badge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20">
          <Crown className="h-4 w-4 text-[#8A2BE2]" />
          <span className="text-xs font-bold text-[#8A2BE2]">PRO FEATURE</span>
          <span className="text-xs text-[#888888] ml-1">— Available on Pro & Enterprise plans</span>
        </div>

        {/* Image Upload Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Input Image */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <ImageIcon className="h-4 w-4 text-[#8A2BE2]" />
              Input Image
            </label>
            <p className="text-xs text-[#666666] mb-3">Your photo to be color graded</p>
            <div
              className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-[#222222] hover:border-[#8A2BE2]/50 transition-colors duration-300 overflow-hidden cursor-pointer group"
              onClick={() => inputRef.current?.click()}
            >
              {inputImage ? (
                <>
                  <img src={inputImage} alt="Input" className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); setInputImage(null); }}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-red-500/80 transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-white" />
                  </button>
                  <div className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-black/70 text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Replace
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-[#8A2BE2]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#AAAAAA]">Click to upload</p>
                    <p className="text-[10px] text-[#555555] mt-1">PNG, JPG, WebP up to 50MB</p>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, 'input')}
            />
          </div>

          {/* Reference Image */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <Palette className="h-4 w-4 text-[#00FFFF]" />
              Reference Image
            </label>
            <p className="text-xs text-[#666666] mb-3">The photo whose colors you want to transfer</p>
            <div
              className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-[#222222] hover:border-[#00FFFF]/50 transition-colors duration-300 overflow-hidden cursor-pointer group"
              onClick={() => referenceRef.current?.click()}
            >
              {referenceImage ? (
                <>
                  <img src={referenceImage} alt="Reference" className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); setReferenceImage(null); }}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-red-500/80 transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-white" />
                  </button>
                  <div className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-black/70 text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Replace
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-[#00FFFF]/10 border border-[#00FFFF]/20 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-[#00FFFF]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#AAAAAA]">Click to upload</p>
                    <p className="text-[10px] text-[#555555] mt-1">PNG, JPG, WebP up to 50MB</p>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={referenceRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, 'reference')}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 space-y-5">
          {/* Intensity Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-white">
                <SlidersHorizontal className="h-4 w-4 text-[#8A2BE2]" />
                Intensity
              </label>
              <span className="text-sm font-bold text-[#8A2BE2]">{intensity}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-1.5 rounded-full bg-[#222222] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8A2BE2] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-[#8A2BE2]/30 [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#444444] mt-1">
              <span>Subtle</span>
              <span>Natural</span>
              <span>Strong</span>
            </div>
          </div>

          {/* Preserve Details Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-[#555555]" />
              <span className="text-sm text-[#CCCCCC]">Preserve luminance details</span>
            </div>
            <button
              onClick={() => setPreserveDetails(!preserveDetails)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                preserveDetails ? 'bg-[#8A2BE2]' : 'bg-[#333333]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  preserveDetails ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={applyColorTransfer}
            disabled={!inputImage || !referenceImage || isProcessing}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              inputImage && referenceImage && !isProcessing
                ? 'cta-primary text-white animate-btn-glow'
                : 'bg-white/5 text-[#555555] cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Apply Color Transfer
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-[#222222] text-sm font-medium text-[#AAAAAA] hover:text-white hover:border-[#333333] transition-all duration-300"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        {/* Output Preview */}
        {outputImage && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Generated Result</h3>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 text-[#8A2BE2] text-sm font-semibold hover:bg-[#8A2BE2]/20 transition-all duration-300"
              >
                <Download className="h-4 w-4" />
                Download PNG
              </button>
            </div>
            <div className="relative rounded-xl overflow-hidden border border-[#1a1a1a]">
              <img
                src={outputImage}
                alt="Color graded result"
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        {/* Info Section */}
        {!inputImage && !referenceImage && (
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#00FFFF]/10 border border-[#00FFFF]/20 flex items-center justify-center flex-shrink-0">
                <Palette className="h-5 w-5 text-[#00FFFF]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-2">How to use Color Grade Transfer</h3>
                <ol className="space-y-2 text-sm text-[#888888]">
                  <li className="flex items-start gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#8A2BE2]/10 text-[10px] font-bold text-[#8A2BE2] flex-shrink-0 mt-0.5">1</span>
                    Upload your input image — the photo you want to apply color grading to
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#8A2BE2]/10 text-[10px] font-bold text-[#8A2BE2] flex-shrink-0 mt-0.5">2</span>
                    Upload a reference image — the photo with the color mood you want to copy
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#8A2BE2]/10 text-[10px] font-bold text-[#8A2BE2] flex-shrink-0 mt-0.5">3</span>
                    Adjust the intensity slider and toggle luminance preservation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#8A2BE2]/10 text-[10px] font-bold text-[#8A2BE2] flex-shrink-0 mt-0.5">4</span>
                    Click &quot;Apply Color Transfer&quot; and download your color-graded result
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
