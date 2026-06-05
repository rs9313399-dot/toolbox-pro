'use client';

import { X, Crown, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
  onNavigate: (hash: string) => void;
}

export default function PremiumModal({ isOpen, onClose, featureName, onNavigate }: PremiumModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-[#8A2BE2]/30 rounded-2xl overflow-hidden shadow-2xl shadow-[#8A2BE2]/20 animate-fade-in-up">
        <div className="h-1 bg-gradient-to-r from-[#8A2BE2] via-[#00FFFF] to-[#8A2BE2]" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 transition-colors z-10"
        >
          <X className="h-4 w-4 text-[#666666]" />
        </button>
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/30 flex items-center justify-center">
                <Crown className="h-8 w-8 text-[#8A2BE2]" />
              </div>
              <div className="absolute -inset-3 rounded-3xl bg-[#8A2BE2]/5 blur-xl pointer-events-none" />
            </div>
          </div>
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">
              {featureName ? `${featureName} is a Pro Feature` : 'Upgrade to Pro'}
            </h3>
            <p className="text-sm text-[#888888] leading-relaxed">
              Unlock this feature and many more with ToolBox Pro. Start your 7-day free trial today — no credit card required.
            </p>
          </div>
          <div className="space-y-3 mb-8">
            {[
              'All 15 tools + 4 Pro exclusives',
              'Ad-free experience forever',
              '3x faster processing speed',
              'HD export up to 4K quality',
              'Batch processing up to 50 files',
              'Priority email support',
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <Check className="h-4 w-4 text-[#8A2BE2] flex-shrink-0" />
                <span className="text-sm text-[#CCCCCC]">{benefit}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                onNavigate('#/pricing');
              }}
              className="w-full cta-primary py-3.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              View Plans & Pricing
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl text-[#666666] text-sm font-medium hover:text-[#888888] transition-colors"
            >
              Maybe later
            </button>
          </div>
          <p className="text-center text-[10px] text-[#444444] mt-4">
            Cancel anytime &middot; 30-day money-back guarantee &middot; Secure payments via Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
