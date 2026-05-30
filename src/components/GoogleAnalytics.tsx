'use client';

import { useEffect } from 'react';

// Replace with your actual Google Analytics Measurement ID
// Get it from: analytics.google.com → Admin → Data Streams → your stream → Measurement ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

export default function GoogleAnalytics() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return; // Skip if not configured

    // Load gtag script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.hash || '/',
    });

    // Track hash changes for SPA routing
    const handleHashChange = () => {
      gtag('config', GA_MEASUREMENT_ID, {
        page_path: window.location.hash || '/',
      });
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return null;
}

// Helper to track custom events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window === 'undefined') return;
  if (GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

  (window as any).gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}
