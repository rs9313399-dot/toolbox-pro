'use client';

import { useState, useEffect } from 'react';
import { Download, X, Wifi, WifiOff } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/i18n';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const { lang } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a delay
      setTimeout(() => setShowPrompt(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    // Online/Offline detection
    const handleOnline = () => {
      setIsOffline(false);
      setShowOfflineBanner(true);
      setTimeout(() => setShowOfflineBanner(false), 3000);
    };
    const handleOffline = () => {
      setIsOffline(true);
      setShowOfflineBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered:', reg.scope);
          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated') {
                  // New version available — could show update prompt
                  console.log('[PWA] New version activated');
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        console.log('[PWA] User accepted install');
      }
    } catch (err) {
      console.warn('[PWA] Install prompt error:', err);
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't render if installed or dismissed
  if (isInstalled) return null;
  if (typeof window !== 'undefined' && sessionStorage.getItem('pwa-prompt-dismissed') && !showPrompt) return null;

  return (
    <>
      {/* ─── Offline Banner ─── */}
      {showOfflineBanner && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-xl border transition-all duration-500 ${
            isOffline
              ? 'bg-amber-950/90 border-amber-500/30 text-amber-300'
              : 'bg-green-950/90 border-green-500/30 text-green-300'
          } backdrop-blur-xl shadow-2xl`}
        >
          <div className="flex items-center gap-2.5 text-sm font-medium">
            {isOffline ? (
              <>
                <WifiOff className="h-4 w-4" />
                <span>{lang === 'hi' ? 'आप ऑफलाइन हैं — कैश्ड कंटेंट उपलब्ध है' : "You're offline — cached content available"}</span>
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4" />
                <span>{t('pwa', 'offlineReady', lang)}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── Install Prompt Banner ─── */}
      {showPrompt && deferredPrompt && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-md">
          <div className="relative bg-[#111111] border border-[#8A2BE2]/30 rounded-2xl p-5 shadow-2xl shadow-purple-900/20 backdrop-blur-xl">
            {/* Glow */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-20 bg-[#8A2BE2]/15 blur-[60px] pointer-events-none" />

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/5 transition-colors text-[#666666] hover:text-white"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 flex items-center justify-center">
                <Download className="h-6 w-6 text-[#8A2BE2]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white mb-1">
                  {t('pwa', 'installTitle', lang)}
                </h3>
                <p className="text-sm text-[#AAAAAA] leading-relaxed mb-4">
                  {t('pwa', 'installDesc', lang)}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleInstall}
                    className="cta-primary px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
                  >
                    {t('pwa', 'installBtn', lang)}
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-2.5 rounded-xl text-[#888888] text-sm font-medium hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    {t('pwa', 'dismissBtn', lang)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
