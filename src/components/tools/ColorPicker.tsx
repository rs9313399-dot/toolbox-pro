'use client';

import { useState, useEffect, useCallback } from 'react';
import { Palette, Copy, Check } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

/* ─────────────────────────────────────────────
   Color Conversion Utilities
   ───────────────────────────────────────────── */

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

function hexToRgb(hex: string): RGB {
  const cleaned = hex.replace('#', '');
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;

  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case rN:
        h = ((gN - bN) / delta + (gN < bN ? 6 : 0)) / 6;
        break;
      case gN:
        h = ((bN - rN) / delta + 2) / 6;
        break;
      case bN:
        h = ((rN - gN) / delta + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  const hN = h / 360;
  const sN = s / 100;
  const lN = l / 100;

  if (sN === 0) {
    const val = Math.round(lN * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    let tNorm = t;
    if (tNorm < 0) tNorm += 1;
    if (tNorm > 1) tNorm -= 1;
    if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
    if (tNorm < 1 / 2) return q;
    if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
    return p;
  };

  const q = lN < 0.5 ? lN * (1 + sN) : lN + sN - lN * sN;
  const p = 2 * lN - q;

  return {
    r: Math.round(hue2rgb(p, q, hN + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hN) * 255),
    b: Math.round(hue2rgb(p, q, hN - 1 / 3) * 255),
  };
}

/* ─────────────────────────────────────────────
   Preset Color Palette
   ───────────────────────────────────────────── */

const PRESET_COLORS: string[] = [
  '#FF0000', // Red
  '#FF6B00', // Orange
  '#FFD700', // Gold
  '#00FF00', // Green
  '#00FFFF', // Cyan
  '#0088FF', // Blue
  '#8A2BE2', // Purple
  '#FF1493', // Deep Pink
  '#FFFFFF', // White
  '#000000', // Black
  '#808080', // Gray
  '#FF69B4', // Hot Pink
];

/* ─────────────────────────────────────────────
   FAQ & Related Tools
   ───────────────────────────────────────────── */

const faqItems = [
  {
    question: 'How does the color picker work?',
    answer:
      'Our color picker uses the native HTML color input to let you select any color visually. It then instantly converts the selected color into HEX, RGB, and HSL formats, which you can copy to your clipboard with a single click.',
  },
  {
    question: 'What is the difference between HEX, RGB, and HSL?',
    answer:
      'HEX is a hexadecimal representation (e.g., #FF5733) commonly used in web design. RGB represents colors as Red, Green, and Blue values (0-255 each). HSL represents colors by Hue (0-360°), Saturation (0-100%), and Lightness (0-100%), making it more intuitive for adjusting colors.',
  },
  {
    question: 'Can I manually enter a color value?',
    answer:
      'Yes! You can type any valid HEX value (e.g., #FF5733) into the HEX input field, and the color preview along with all other format values will update instantly.',
  },
  {
    question: 'Is my color data sent to any server?',
    answer:
      'No. All color conversions and processing happen entirely in your browser. No data is sent to any server, ensuring complete privacy.',
  },
];

const relatedTools = [
  {
    name: 'Image Compressor',
    hash: '#/tools/image-compressor',
    description: 'Compress images without losing quality.',
  },
  {
    name: 'Image Resizer',
    hash: '#/tools/image-resizer',
    description: 'Resize images to any dimension.',
  },
  {
    name: 'Background Remover',
    hash: '#/tools/background-remover',
    description: 'Remove image backgrounds instantly.',
  },
];

/* ─────────────────────────────────────────────
   Copy Button Component
   ───────────────────────────────────────────── */

interface CopyButtonProps {
  value: string;
  label: string;
}

function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing, clipboard API may not be available
    }
  }, [value]);

  return (
    <button
      onClick={handleCopy}
      aria-label={`Copy ${label}: ${value}`}
      className="cp-copy-btn inline-flex items-center justify-center h-8 w-8 rounded-lg bg-[#1a1a1a] border border-[#222222] text-[#888888] hover:text-[#00FFFF] hover:border-[#00FFFF]/30 transition-all duration-300 shrink-0"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */

interface ColorPickerProps {
  onNavigate: (hash: string) => void;
}

const MAX_HISTORY = 10;

export default function ColorPicker({ onNavigate }: ColorPickerProps) {
  const [hex, setHex] = useState<string>('#8A2BE2');
  const [history, setHistory] = useState<string[]>([]);
  const [hexInput, setHexInput] = useState<string>('#8A2BE2');

  // Derive color values
  const rgb: RGB = hexToRgb(hex);
  const hsl: HSL = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Sync hex input when color changes (from picker or presets)
  useEffect(() => {
    setHexInput(hex.toUpperCase());
  }, [hex]);

  const handleNativePicker = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newHex = e.target.value.toUpperCase();
      setHex(newHex);
      setHexInput(newHex);
      // Add to history
      setHistory((prev) => {
        const filtered = prev.filter((c) => c !== newHex);
        return [newHex, ...filtered].slice(0, MAX_HISTORY);
      });
    },
    []
  );

  const handleHexInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setHexInput(raw);

      // Validate and apply if valid hex
      const cleaned = raw.startsWith('#') ? raw : `#${raw}`;
      if (/^#[0-9A-Fa-f]{6}$/.test(cleaned)) {
        setHex(cleaned.toUpperCase());
        setHistory((prev) => {
          const filtered = prev.filter((c) => c !== cleaned.toUpperCase());
          return [cleaned.toUpperCase(), ...filtered].slice(0, MAX_HISTORY);
        });
      }
    },
    []
  );

  const handlePresetClick = useCallback((color: string) => {
    const upper = color.toUpperCase();
    setHex(upper);
    setHexInput(upper);
    setHistory((prev) => {
      const filtered = prev.filter((c) => c !== upper);
      return [upper, ...filtered].slice(0, MAX_HISTORY);
    });
  }, []);

  const handleHistoryClick = useCallback((color: string) => {
    setHex(color);
    setHexInput(color);
  }, []);

  // Format strings
  const hexStr = hex.toUpperCase();
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  // Determine if the color is light (for text contrast on the preview)
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';

  return (
    <ToolLayout
      title="Color Picker"
      description="Pick colors and get HEX, RGB, HSL values instantly"
      icon={Palette}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-8">
        {/* ── Top Section: Preview + Picker ── */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Color Preview Box */}
          <div className="relative group shrink-0">
            <div
              className="w-[200px] h-[200px] rounded-2xl border border-[#222222] transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_0_40px_rgba(138,43,226,0.15)]"
              style={{ backgroundColor: hex }}
              aria-label={`Color preview: ${hexStr}`}
            >
              <span
                className="absolute bottom-3 left-3 text-xs font-mono font-bold px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm"
                style={{ color: textColor }}
              >
                {hexStr}
              </span>
            </div>
          </div>

          {/* Native Color Input + Controls */}
          <div className="flex-1 w-full space-y-5">
            {/* Native Color Picker */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Pick a Color
              </label>
              <div className="cp-picker-wrap relative inline-flex items-center gap-3">
                <input
                  type="color"
                  value={hex}
                  onChange={handleNativePicker}
                  className="cp-native-picker w-12 h-12 rounded-xl cursor-pointer border-2 border-[#222222] bg-transparent"
                  aria-label="Color picker"
                />
                {/* HEX Input */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={hexInput}
                    onChange={handleHexInputChange}
                    placeholder="#8A2BE2"
                    maxLength={7}
                    spellCheck={false}
                    className="cp-hex-input w-full h-12 px-4 rounded-xl bg-black/40 border border-[#222222] text-white font-mono text-sm focus:outline-none focus:border-[#8A2BE2]/50 focus:ring-1 focus:ring-[#8A2BE2]/20 transition-all duration-300"
                    aria-label="HEX color input"
                  />
                </div>
              </div>
            </div>

            {/* Color Values */}
            <div className="space-y-3">
              {/* HEX */}
              <div className="cp-value-row flex items-center gap-3">
                <span className="text-xs font-bold text-[#555555] w-10 shrink-0 uppercase tracking-wider">
                  HEX
                </span>
                <div className="flex-1 h-9 px-3 rounded-lg bg-black/40 border border-[#1a1a1a] flex items-center">
                  <span className="text-sm font-mono text-white select-all">
                    {hexStr}
                  </span>
                </div>
                <CopyButton value={hexStr} label="HEX" />
              </div>

              {/* RGB */}
              <div className="cp-value-row flex items-center gap-3">
                <span className="text-xs font-bold text-[#555555] w-10 shrink-0 uppercase tracking-wider">
                  RGB
                </span>
                <div className="flex-1 h-9 px-3 rounded-lg bg-black/40 border border-[#1a1a1a] flex items-center">
                  <span className="text-sm font-mono text-white select-all">
                    {rgbStr}
                  </span>
                </div>
                <CopyButton value={rgbStr} label="RGB" />
              </div>

              {/* HSL */}
              <div className="cp-value-row flex items-center gap-3">
                <span className="text-xs font-bold text-[#555555] w-10 shrink-0 uppercase tracking-wider">
                  HSL
                </span>
                <div className="flex-1 h-9 px-3 rounded-lg bg-black/40 border border-[#1a1a1a] flex items-center">
                  <span className="text-sm font-mono text-white select-all">
                    {hslStr}
                  </span>
                </div>
                <CopyButton value={hslStr} label="HSL" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Preset Color Palette ── */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Palette className="h-4 w-4 text-[#8A2BE2]" />
            Popular Colors
          </h3>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
            {PRESET_COLORS.map((color) => {
              const isActive = hex.toUpperCase() === color.toUpperCase();
              const lum =
                (0.299 * hexToRgb(color).r +
                  0.587 * hexToRgb(color).g +
                  0.114 * hexToRgb(color).b) /
                255;
              const checkColor = lum > 0.5 ? '#000000' : '#FFFFFF';

              return (
                <button
                  key={color}
                  onClick={() => handlePresetClick(color)}
                  className={`cp-swatch relative h-10 rounded-xl border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                  style={{
                    backgroundColor: color,
                    borderColor: isActive ? '#00FFFF' : '#222222',
                    boxShadow: isActive
                      ? '0 0 16px rgba(0, 255, 255, 0.3)'
                      : 'none',
                  }}
                  aria-label={`Select color ${color}`}
                >
                  {isActive && (
                    <Check
                      className="h-4 w-4 absolute inset-0 m-auto"
                      style={{ color: checkColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Color History ── */}
        {history.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-white mb-3">
              Recent Colors
            </h3>
            <div className="flex flex-wrap gap-2">
              {history.map((color, idx) => {
                const lum =
                  (0.299 * hexToRgb(color).r +
                    0.587 * hexToRgb(color).g +
                    0.114 * hexToRgb(color).b) /
                  255;
                const checkColor = lum > 0.5 ? '#000000' : '#FFFFFF';
                const isActive = hex.toUpperCase() === color.toUpperCase();

                return (
                  <button
                    key={`${color}-${idx}`}
                    onClick={() => handleHistoryClick(color)}
                    className="cp-history-swatch group relative h-12 w-12 rounded-xl border-2 transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: color,
                      borderColor: isActive ? '#00FFFF' : '#1a1a1a',
                    }}
                    aria-label={`Select recent color ${color}`}
                  >
                    {isActive && (
                      <Check
                        className="h-4 w-4 absolute inset-0 m-auto"
                        style={{ color: checkColor }}
                      />
                    )}
                    {/* Tooltip showing hex on hover */}
                    <span className="cp-tooltip absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white bg-black/90 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      {color}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── CSS + Code Snippet ── */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3">CSS Snippet</h3>
          <div className="cp-code-block relative p-4 rounded-xl bg-black/60 border border-[#1a1a1a] font-mono text-sm text-[#AAAAAA] leading-relaxed">
            <button
              onClick={async () => {
                const snippet = `background-color: ${hexStr};\ncolor: ${textColor};`;
                try {
                  await navigator.clipboard.writeText(snippet);
                } catch {
                  // Clipboard API may not be available
                }
              }}
              className="absolute top-3 right-3 inline-flex items-center justify-center h-7 w-7 rounded-lg bg-[#1a1a1a] border border-[#222222] text-[#888888] hover:text-[#00FFFF] hover:border-[#00FFFF]/30 transition-all duration-300"
              aria-label="Copy CSS snippet"
            >
              <Copy className="h-3 w-3" />
            </button>
            <div>
              <span className="text-[#8A2BE2]">background-color</span>
              <span className="text-[#555555]">:</span>{' '}
              <span className="text-[#00FFFF]">{hexStr}</span>
              <span className="text-[#555555]">;</span>
            </div>
            <div>
              <span className="text-[#8A2BE2]">color</span>
              <span className="text-[#555555]">:</span>{' '}
              <span className="text-[#00FFFF]">{textColor}</span>
              <span className="text-[#555555]">;</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scoped Styles ── */}
      <style jsx>{`
        /* Native color picker reset */
        .cp-native-picker {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          padding: 0;
          cursor: pointer;
          overflow: hidden;
          border-radius: 12px;
        }
        .cp-native-picker::-webkit-color-swatch-wrapper {
          padding: 2px;
        }
        .cp-native-picker::-webkit-color-swatch {
          border: none;
          border-radius: 10px;
        }
        .cp-native-picker::-moz-color-swatch {
          border: none;
          border-radius: 10px;
        }

        /* Copy button pulse animation */
        @keyframes cp-check-pop {
          0% {
            transform: scale(0.6);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .cp-copy-btn svg {
          transition: all 0.2s ease;
        }

        /* Value row slide-in */
        @keyframes cp-slide-in {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .cp-value-row {
          animation: cp-slide-in 0.3s ease-out forwards;
        }
        .cp-value-row:nth-child(1) {
          animation-delay: 0s;
        }
        .cp-value-row:nth-child(2) {
          animation-delay: 0.05s;
        }
        .cp-value-row:nth-child(3) {
          animation-delay: 0.1s;
        }

        /* Swatch hover glow */
        .cp-swatch:hover {
          box-shadow: 0 0 16px rgba(138, 43, 226, 0.3);
        }

        /* History swatch hover glow */
        .cp-history-swatch:hover {
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
        }

        /* HEX input focus glow */
        .cp-hex-input:focus {
          box-shadow: 0 0 16px rgba(138, 43, 226, 0.1);
        }

        /* Code block hover */
        .cp-code-block:hover {
          border-color: #222222;
        }
      `}</style>
    </ToolLayout>
  );
}
