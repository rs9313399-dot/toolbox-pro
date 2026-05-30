'use client';

import Script from 'next/script';
import { useEffect } from 'react';

const GA_MEASUREMENT_ID = 'G-YRFBYXX3QR';

export default function GoogleAnalytics() {
  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', GA_MEASUREMENT_ID, {
          page_path: window.location.hash || '/',
        });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.hash || '/',
          });
        `}
      </Script>
    </>
  );
}

export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window === 'undefined') return;
  if (!(window as any).gtag) return;

  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}