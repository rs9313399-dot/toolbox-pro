'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ToolLayout from '@/components/ToolLayout';

/* ─── FAQ Items ─── */
const faqItems = [
  {
    question: 'How does the Love Calculator work?',
    answer:
      'The Love Calculator uses a deterministic algorithm that combines both names to produce a consistent compatibility percentage. The same pair of names will always yield the same result. It uses a hash-based approach for fun, consistent calculations.',
  },
  {
    question: 'Is the Love Calculator accurate?',
    answer:
      'No! This is purely for entertainment purposes. Love is complex and cannot be measured by an algorithm. The results are generated for fun and should not influence any real-life decisions or relationships.',
  },
  {
    question: 'Does the order of names matter?',
    answer:
      'No, the calculation is symmetrical — entering "Alice & Bob" or "Bob & Alice" will produce the same compatibility percentage, so the order does not affect your result.',
  },
  {
    question: 'Can I share my results?',
    answer:
      'Absolutely! You can screenshot your results and share them with friends for a good laugh. Just remember to let them know it\'s all in good fun and not to be taken seriously.',
  },
];

/* ─── Related Tools ─── */
const relatedTools = [
  {
    name: 'Password Generator',
    hash: '#/tools/password-generator',
    description: 'Create strong, secure passwords with customizable options.',
  },
  {
    name: 'Word Counter',
    hash: '#/tools/word-counter',
    description: 'Count words, characters, and more in your text.',
  },
  {
    name: 'QR Code Generator',
    hash: '#/tools/qr-code-generator',
    description: 'Generate custom QR codes for any content.',
  },
];

/* ─── Deterministic Love Calculation ─── */
function calculateLove(name1: string, name2: string): number {
  // Normalize: lowercase, trim, remove non-alpha
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z]/g, '');

  const a = normalize(name1);
  const b = normalize(name2);

  if (!a || !b) return 0;

  // Sort to ensure symmetry: "alice & bob" === "bob & alice"
  const [first, second] = a < b ? [a, b] : [b, a];
  const combined = first + '&' + second;

  // Simple deterministic hash (djb2 variant)
  let hash = 5381;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) + hash + combined.charCodeAt(i)) & 0xffffffff;
  }

  // Map to 1-100 (avoid 0 which feels broken)
  const percent = (Math.abs(hash) % 100) + 1;
  return percent;
}

/* ─── Result Message ─── */
function getResultMessage(percent: number): string {
  if (percent <= 20) return 'Better luck next time!';
  if (percent <= 40) return 'Friendship is the foundation!';
  if (percent <= 60) return 'Something special brewing!';
  if (percent <= 80) return 'Great compatibility!';
  return 'Made for each other!';
}

/* ─── Result Emoji/Icon Color ─── */
function getResultColor(percent: number): string {
  if (percent <= 20) return '#555555';
  if (percent <= 40) return '#AAAAAA';
  if (percent <= 60) return '#8A2BE2';
  if (percent <= 80) return '#FF1493';
  return '#FF1493';
}

function getBarGradient(percent: number): string {
  if (percent <= 20) return 'from-[#555555] to-[#888888]';
  if (percent <= 40) return 'from-[#8A2BE2] to-[#00FFFF]';
  if (percent <= 60) return 'from-[#8A2BE2] to-[#FF1493]';
  if (percent <= 80) return 'from-[#FF1493] to-[#8A2BE2]';
  return 'from-[#FF1493] to-[#8A2BE2]';
}

/* ─── Floating Heart Types ─── */
interface FloatingHeart {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

/* ─── Component Props ─── */
interface LoveCalculatorProps {
  onNavigate: (hash: string) => void;
}

/* ─── Love Calculator Component ─── */
export default function LoveCalculator({ onNavigate }: LoveCalculatorProps) {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const heartIdRef = useRef(0);
  const animationRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  /* ─── Animate the progress bar count-up ─── */
  const animateResult = useCallback((target: number) => {
    setAnimatedPercent(0);
    const startTime = performance.now();
    const duration = 1500; // 1.5s

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPercent(Math.round(eased * target));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      }
    };

    animationRef.current = requestAnimationFrame(step);
  }, []);

  /* ─── Spawn floating hearts ─── */
  const spawnHearts = useCallback(() => {
    const newHearts: FloatingHeart[] = [];
    for (let i = 0; i < 12; i++) {
      newHearts.push({
        id: heartIdRef.current++,
        x: Math.random() * 100,
        size: 12 + Math.random() * 20,
        delay: Math.random() * 1.5,
        duration: 2 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.5,
      });
    }
    setHearts(newHearts);

    // Clean up hearts after animation
    setTimeout(() => {
      setHearts([]);
    }, 5000);
  }, []);

  /* ─── Calculate Handler ─── */
  const handleCalculate = useCallback(() => {
    if (!name1.trim() || !name2.trim()) return;

    setIsCalculating(true);
    setResult(null);
    setAnimatedPercent(0);

    // Simulate brief "calculating" delay for drama
    setTimeout(() => {
      const percent = calculateLove(name1, name2);
      setResult(percent);
      setIsCalculating(false);
      animateResult(percent);
      spawnHearts();
    }, 800);
  }, [name1, name2, animateResult, spawnHearts]);

  /* ─── Reset Handler ─── */
  const handleReset = useCallback(() => {
    setName1('');
    setName2('');
    setResult(null);
    setAnimatedPercent(0);
    setHearts([]);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  /* ─── Cleanup on unmount ─── */
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const canCalculate = name1.trim().length > 0 && name2.trim().length > 0;
  const showResult = result !== null;

  return (
    <ToolLayout
      title="Love Calculator"
      description="Calculate your love compatibility percentage - just for fun!"
      icon={Heart}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-8 relative">
        {/* ─── Floating Hearts ─── */}
        {hearts.length > 0 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10" aria-hidden="true">
            {hearts.map((heart) => (
              <div
                key={heart.id}
                className="absolute bottom-0 animate-float-up"
                style={{
                  left: `${heart.x}%`,
                  animationDelay: `${heart.delay}s`,
                  animationDuration: `${heart.duration}s`,
                }}
              >
                <Heart
                  className="fill-[#FF1493]"
                  style={{
                    width: heart.size,
                    height: heart.size,
                    opacity: heart.opacity,
                    color: '#FF1493',
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* ─── Input Section ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name 1 */}
          <div className="space-y-3">
            <Label htmlFor="name1" className="text-sm font-medium text-white">
              Your Name
            </Label>
            <div className="relative">
              <Input
                id="name1"
                type="text"
                placeholder="Enter your name"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                className="h-12 bg-black/40 border-[#222222] text-white placeholder:text-[#555555] focus:border-[#FF1493]/50 focus:ring-[#FF1493]/20 rounded-xl pr-10"
                maxLength={50}
                disabled={isCalculating}
                aria-label="Your name"
              />
              <Heart
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FF1493]/40"
              />
            </div>
          </div>

          {/* Name 2 */}
          <div className="space-y-3">
            <Label htmlFor="name2" className="text-sm font-medium text-white">
              Partner&apos;s Name
            </Label>
            <div className="relative">
              <Input
                id="name2"
                type="text"
                placeholder="Enter partner's name"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                className="h-12 bg-black/40 border-[#222222] text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:ring-[#8A2BE2]/20 rounded-xl pr-10"
                maxLength={50}
                disabled={isCalculating}
                aria-label="Partner's name"
              />
              <Heart
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A2BE2]/40"
              />
            </div>
          </div>
        </div>

        {/* ─── Heart Connector Visual ─── */}
        <div className="flex items-center justify-center gap-3 py-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#FF1493]/20 to-transparent" />
          <div className={`transition-all duration-500 ${showResult ? 'scale-110' : 'scale-100'}`}>
            <Heart
              className={`h-8 w-8 transition-all duration-500 ${
                showResult
                  ? 'text-[#FF1493] fill-[#FF1493] animate-pulse'
                  : isCalculating
                  ? 'text-[#FF1493]/60 fill-[#FF1493]/40 animate-bounce'
                  : 'text-[#555555]'
              }`}
            />
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#8A2BE2]/20 to-transparent" />
        </div>

        {/* ─── Calculate Button ─── */}
        <Button
          onClick={handleCalculate}
          className="w-full h-12 text-base font-semibold cta-primary"
          size="lg"
          disabled={!canCalculate || isCalculating}
          aria-label="Calculate love compatibility"
        >
          {isCalculating ? (
            <>
              <Heart className="h-4 w-4 mr-2 animate-bounce fill-current" />
              <span>Calculating...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              <span>Calculate Love</span>
            </>
          )}
        </Button>

        {/* ─── Results Section ─── */}
        {showResult && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Names Display */}
            <div className="flex items-center justify-center gap-3 text-base">
              <span className="font-semibold text-white truncate max-w-[120px] sm:max-w-[200px]">
                {name1.trim()}
              </span>
              <Heart className="h-5 w-5 text-[#FF1493] fill-[#FF1493] shrink-0" />
              <span className="font-semibold text-white truncate max-w-[120px] sm:max-w-[200px]">
                {name2.trim()}
              </span>
            </div>

            {/* Percentage Display */}
            <div className="text-center">
              <div
                className="text-7xl sm:text-8xl font-black tracking-tighter transition-all duration-300"
                style={{
                  color: getResultColor(result),
                  textShadow:
                    result > 60
                      ? `0 0 30px ${getResultColor(result)}40, 0 0 60px ${getResultColor(result)}20`
                      : 'none',
                }}
              >
                {animatedPercent}%
              </div>
              <p
                className="text-lg font-semibold mt-3 transition-all duration-300"
                style={{ color: getResultColor(result) }}
              >
                {getResultMessage(result)}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-3 w-full rounded-full bg-[#1a1a1a] overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getBarGradient(result)} transition-all duration-1000 ease-out relative`}
                  style={{ width: `${animatedPercent}%` }}
                >
                  {/* Shimmer effect on the bar */}
                  <div className="absolute inset-0 animate-shimmer rounded-full" />
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-[#555555]">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Compatibility Breakdown - Fun Visual */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { label: 'Trust', value: Math.max(10, (result + 7) % 100) },
                { label: 'Passion', value: Math.max(10, (result + 23) % 100) },
                { label: 'Friendship', value: Math.max(10, (result + 41) % 100) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-black/30 border border-[#1a1a1a] rounded-xl p-3 text-center"
                >
                  <p className="text-[10px] text-[#555555] uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="text-lg font-bold text-white">{item.value}%</p>
                  <div className="h-1 w-full rounded-full bg-[#1a1a1a] mt-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#8A2BE2] to-[#FF1493] transition-all duration-1000 ease-out"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Try Again Button */}
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full h-11 text-sm font-medium border-[#222222] text-[#AAAAAA] hover:text-white hover:border-[#FF1493]/30 hover:bg-[#FF1493]/5 transition-all duration-300"
            >
              Try Different Names
            </Button>
          </div>
        )}

        {/* ─── Disclaimer ─── */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FF1493]/5 border border-[#FF1493]/10">
          <Heart className="h-4 w-4 text-[#FF1493]/50 mt-0.5 shrink-0" />
          <p className="text-xs text-[#555555] leading-relaxed">
            This is just for fun, not to be taken seriously! Love cannot be measured by an algorithm.
            Results are generated using a simple name-based calculation and have no scientific basis.
          </p>
        </div>
      </div>

      {/* ─── CSS for floating hearts animation ─── */}
      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-400px) scale(0.3) rotate(30deg);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up 3s ease-out forwards;
        }
      `}</style>
    </ToolLayout>
  );
}
