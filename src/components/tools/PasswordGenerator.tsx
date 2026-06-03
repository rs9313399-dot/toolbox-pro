'use client';

import { useState, useCallback, useMemo } from 'react';
import { KeyRound, Copy, RefreshCw, Check } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'Is this password generator secure?',
    answer:
      'Yes! This password generator uses crypto.getRandomValues(), which is a cryptographically secure random number generator built into your browser. The passwords are generated entirely on your device and are never sent to any server.',
  },
  {
    question: 'How long should my password be?',
    answer:
      'We recommend a minimum of 12 characters for strong security. For highly sensitive accounts (banking, email), use 16+ characters. The longer the password, the harder it is to crack through brute force attacks.',
  },
  {
    question: 'What makes a strong password?',
    answer:
      'A strong password combines uppercase letters, lowercase letters, numbers, and special symbols. It should be at least 12 characters long and avoid common patterns like dictionary words, birthdays, or sequences (1234, abcd).',
  },
];

const relatedTools = [
  {
    name: 'Word Counter',
    hash: '#/tools/word-counter',
    description: 'Count words, characters, and more in your text.',
  },
  {
    name: 'Image Compressor',
    hash: '#/tools/image-compressor',
    description: 'Compress images without losing quality.',
  },
  {
    name: 'YouTube Thumbnail',
    hash: '#/tools/youtube-thumbnail',
    description: 'Download YouTube video thumbnails easily.',
  },
];

const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function generatePassword(
  len: number,
  upper: boolean,
  lower: boolean,
  nums: boolean,
  syms: boolean
): string {
  let charset = '';
  if (upper) charset += CHARSETS.uppercase;
  if (lower) charset += CHARSETS.lowercase;
  if (nums) charset += CHARSETS.numbers;
  if (syms) charset += CHARSETS.symbols;

  if (charset.length === 0) return '';

  const array = new Uint32Array(len);
  crypto.getRandomValues(array);

  let result = '';
  for (let i = 0; i < len; i++) {
    result += charset[array[i] % charset.length];
  }
  return result;
}

function getPasswordStrength(
  length: number,
  charsetSize: number
): { label: string; color: string; percent: number } {
  if (charsetSize === 0) return { label: 'None', color: 'bg-gray-500', percent: 0 };
  const entropy = length * Math.log2(charsetSize);

  if (entropy < 35) return { label: 'Weak', color: 'bg-red-500', percent: 25 };
  if (entropy < 60) return { label: 'Fair', color: 'bg-yellow-500', percent: 50 };
  if (entropy < 100) return { label: 'Strong', color: 'bg-green-500', percent: 75 };
  return { label: 'Very Strong', color: 'bg-emerald-400', percent: 100 };
}

interface PasswordGeneratorProps {
  onNavigate: (hash: string) => void;
}

export default function PasswordGenerator({ onNavigate }: PasswordGeneratorProps) {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [genCounter, setGenCounter] = useState(0);

  const password = useMemo(() => {
    return generatePassword(length, uppercase, lowercase, numbers, symbols);
  }, [length, uppercase, lowercase, numbers, symbols, genCounter]);

  const handleRegenerate = useCallback(() => {
    if (!uppercase && !lowercase && !numbers && !symbols) {
      toast.error('Please select at least one character type');
      return;
    }
    setGenCounter((c) => c + 1);
    setCopied(false);
  }, [uppercase, lowercase, numbers, symbols]);

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success('Password copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy password');
    }
  };

  const charsetSize =
    (uppercase ? 26 : 0) +
    (lowercase ? 26 : 0) +
    (numbers ? 10 : 0) +
    (symbols ? 26 : 0);

  const strength = getPasswordStrength(length, charsetSize);

  const options = [
    { id: 'uppercase', label: 'Uppercase (A-Z)', checked: uppercase, onChange: setUppercase },
    { id: 'lowercase', label: 'Lowercase (a-z)', checked: lowercase, onChange: setLowercase },
    { id: 'numbers', label: 'Numbers (0-9)', checked: numbers, onChange: setNumbers },
    { id: 'symbols', label: 'Symbols (!@#$)', checked: symbols, onChange: setSymbols },
  ];

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate strong, secure passwords with customizable length and character options. Uses crypto.getRandomValues() for maximum security."
      icon={KeyRound}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-8">
        {/* Password Display */}
        <div className="relative">
          <div className="flex items-center gap-2 p-4 rounded-xl bg-black/40 border border-[#222222] font-mono text-sm sm:text-base break-all min-h-[56px]">
            <span className="flex-1 text-white select-all">
              {password || 'Select at least one character type'}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="shrink-0 h-8 w-8 hover:bg-white/5"
              disabled={!password}
              aria-label="Copy password"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 text-[#888888]" />
              )}
            </Button>
          </div>
        </div>

        {/* Strength Indicator */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#888888]">Password Strength</span>
            <span
              className={`text-xs font-semibold ${
                strength.label === 'Weak'
                  ? 'text-red-400'
                  : strength.label === 'Fair'
                  ? 'text-yellow-400'
                  : strength.label === 'Strong'
                  ? 'text-green-400'
                  : strength.label === 'Very Strong'
                  ? 'text-emerald-400'
                  : 'text-gray-400'
              }`}
            >
              {strength.label}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#1a1a1a] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
              style={{ width: `${strength.percent}%` }}
            />
          </div>
        </div>

        {/* Length Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-white">
              Password Length
            </Label>
            <span className="text-sm font-mono text-[#8A2BE2] font-bold">
              {length}
            </span>
          </div>
          <Slider
            value={[length]}
            min={8}
            max={128}
            step={1}
            onValueChange={(value) => setLength(value[0])}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[#555555]">8</span>
            <span className="text-[10px] text-[#555555]">128</span>
          </div>
        </div>

        {/* Character Options */}
        <div>
          <Label className="text-sm font-medium text-white mb-3 block">
            Character Types
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt) => (
              <div
                key={opt.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                  opt.checked
                    ? 'bg-[#8A2BE2]/5 border-[#8A2BE2]/20'
                    : 'bg-black/20 border-[#1a1a1a] hover:border-[#8A2BE2]/20'
                }`}
              >
                <Checkbox
                  id={opt.id}
                  checked={opt.checked}
                  onCheckedChange={(checked) => opt.onChange(checked === true)}
                />
                <Label
                  htmlFor={opt.id}
                  className="text-sm text-white cursor-pointer select-none"
                >
                  {opt.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleRegenerate}
          className="w-full h-12 text-base font-semibold cta-primary"
          size="lg"
          disabled={!uppercase && !lowercase && !numbers && !symbols}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          <span>Regenerate Password</span>
        </Button>
      </div>
    </ToolLayout>
  );
}
