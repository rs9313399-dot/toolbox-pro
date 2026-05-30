'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';

interface AdPlaceholderProps {
  size?: 'banner' | 'sidebar' | 'in-content';
  className?: string;
  slot?: string;
}

const sizes = {
  banner: 'h-[90px] max-w-[728px] w-full',
  sidebar: 'h-[250px] w-[300px] max-w-full',
  'in-content': 'h-[100px] w-full',
};

const adSlots = {
  banner: '1234567890',
  sidebar: '0987654321',
  'in-content': '1122334455',
};

const sizeLabels = {
  banner: '728 × 90',
  sidebar: '300 × 250',
  'in-content': 'Responsive',
};

export default function AdPlaceholder({
  size = 'banner',
  className,
  slot,
}: AdPlaceholderProps) {
  const adSlot = slot || adSlots[size];
  const insRef = useRef<HTMLElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Try to push AdSense ad when component mounts
    try {
      if (typeof window !== 'undefined') {
        const win = window as Record<string, unknown>;
        if (win.adsbygoogle) {
          (win.adsbygoogle as unknown[]).push({});
          // Check if ad actually loaded after a delay
          const timer = setTimeout(() => {
            if (insRef.current) {
              const ins = insRef.current;
              // If the ins element has data-ad-status="filled", an ad loaded
              if (ins.getAttribute('data-ad-status') === 'filled') {
                setAdLoaded(true);
              }
            }
          }, 2000);
          return () => clearTimeout(timer);
        }
      }
    } catch {
      // AdSense not loaded yet
    }
  }, []);

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl overflow-hidden mx-auto',
        sizes[size],
        className
      )}
    >
      {/* Google AdSense Ad Code */}
      <ins
        ref={insRef as React.RefObject<HTMLModElement>}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client="ca-pub-5839704910468933"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

      {/* Visible fallback when AdSense is not active */}
      {!adLoaded && (
        <div className="ad-slot flex items-center justify-center w-full h-full">
          <div className="text-center">
            <p className="text-xs text-[#333333] font-medium">Ad Space</p>
            <p className="text-[10px] text-[#222222] mt-0.5">
              {sizeLabels[size]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
