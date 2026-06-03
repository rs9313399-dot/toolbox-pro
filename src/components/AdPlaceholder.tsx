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
  banner: '4688735371',     // ToolBox-Header
  sidebar: '7157466133',   // ToolBox-Sidebar
  'in-content': '3216175524', // ToolBox-Footer
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
              if (ins.getAttribute('data-ad-status') === 'filled') {
                setAdLoaded(true);
              }
            }
          }, 3000);
          return () => clearTimeout(timer);
        } else {
          // If adsbygoogle not loaded yet, retry after delay
          const retryTimer = setTimeout(() => {
            try {
              const win2 = window as Record<string, unknown>;
              if (win2.adsbygoogle) {
                (win2.adsbygoogle as unknown[]).push({});
              }
            } catch {
              // Still not loaded
            }
          }, 2000);
          return () => clearTimeout(retryTimer);
        }
      }
    } catch {
      // AdSense not loaded yet
    }
  }, []);

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl overflow-hidden mx-auto my-4',
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
        <div className="ad-slot flex items-center justify-center w-full h-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
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
