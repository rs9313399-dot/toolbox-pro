'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/i18n';

const toolCategories = [
  {
    group: 'imagePdf',
    items: [
      { name: 'Image Compressor', nameHi: 'इमेज कम्प्रेसर', hash: '#/tools/image-compressor', descKey: 'compressImages' },
      { name: 'Image Resizer', nameHi: 'इमेज रीसाइज़र', hash: '#/tools/image-resizer', descKey: 'resizeImages' },
      { name: 'Background Remover', nameHi: 'बैकग्राउंड हटाने वाला', hash: '#/tools/background-remover', descKey: 'removeBackgrounds' },
      { name: 'Image to PDF', nameHi: 'इमेज से PDF', hash: '#/tools/image-to-pdf', descKey: 'imagesToPdf' },
      { name: 'PDF to Image', nameHi: 'PDF से इमेज', hash: '#/tools/pdf-to-image', descKey: 'pdfToImages' },
      { name: 'Color Picker', nameHi: 'कलर पिकर', hash: '#/tools/color-picker', descKey: 'pickColors' },
      { name: 'Image to Text (OCR)', nameHi: 'इमेज से टेक्स्ट (OCR)', hash: '#/tools/image-to-text', descKey: 'extractText' },
    ],
  },
  {
    group: 'textSpeech',
    items: [
      { name: 'Word Counter', nameHi: 'वर्ड काउंटर', hash: '#/tools/word-counter', descKey: 'countWords' },
      { name: 'Text to Speech', nameHi: 'टेक्स्ट टू स्पीच', hash: '#/tools/text-to-speech', descKey: 'readTextAloud' },
      { name: 'Speech to Text', nameHi: 'स्पीच टू टेक्स्ट', hash: '#/tools/speech-to-text', descKey: 'voiceToText' },
      { name: 'Emoji Keyboard', nameHi: 'इमोजी कीबोर्ड', hash: '#/tools/emoji-keyboard', descKey: 'browseEmojis' },
      { name: 'Hindi Typing Tool', nameHi: 'हिन्दी टाइपिंग टूल', hash: '#/tools/hindi-typing', descKey: 'typeHindi' },
      { name: 'Plagiarism Checker', nameHi: 'प्लेजिरिज्म चेकर', hash: '#/tools/plagiarism-checker', descKey: 'checkSimilarity' },
    ],
  },
  {
    group: 'videoAudio',
    items: [
      { name: 'YouTube Thumbnail', nameHi: 'YouTube थंबनेल', hash: '#/tools/youtube-thumbnail', descKey: 'downloadThumbnails' },
      { name: 'Instagram Reel', nameHi: 'Instagram रील', hash: '#/tools/instagram-reel', descKey: 'downloadReels' },
      { name: 'Video to Audio', nameHi: 'वीडियो से ऑडियो', hash: '#/tools/video-to-audio', descKey: 'extractAudio' },
    ],
  },
  {
    group: 'developer',
    items: [
      { name: 'JSON Formatter', nameHi: 'JSON फॉर्मेटर', hash: '#/tools/json-formatter', descKey: 'formatJson' },
      { name: 'Base64 Encoder', nameHi: 'Base64 एनकोडर', hash: '#/tools/base64-encoder', descKey: 'encodeDecode' },
      { name: 'QR Code Generator', nameHi: 'QR कोड जेनरेटर', hash: '#/tools/qr-code-generator', descKey: 'generateQr' },
      { name: 'URL Shortener', nameHi: 'URL शॉर्टनर', hash: '#/tools/url-shortener', descKey: 'shortenUrls' },
      { name: 'Website Speed Test', nameHi: 'वेबसाइट स्पीड टेस्ट', hash: '#/tools/website-speed-test', descKey: 'testPerformance' },
    ],
  },
  {
    group: 'security',
    items: [
      { name: 'Password Generator', nameHi: 'पासवर्ड जेनरेटर', hash: '#/tools/password-generator', descKey: 'securePasswords' },
    ],
  },
  {
    group: 'calculatorsFun',
    items: [
      { name: 'EMI Calculator', nameHi: 'EMI कैलकुलेटर', hash: '#/tools/emi-calculator', descKey: 'loanEmi' },
      { name: 'Age Calculator', nameHi: 'आयु कैलकुलेटर', hash: '#/tools/age-calculator', descKey: 'calculateAge' },
      { name: 'Love Calculator', nameHi: 'लव कैलकुलेटर', hash: '#/tools/love-calculator', descKey: 'loveCompat' },
    ],
  },
];

interface HeaderProps {
  currentHash: string;
  onNavigate: (hash: string) => void;
}

export default function Header({ currentHash, onNavigate }: HeaderProps) {
  const { lang, toggleLang } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setToolsOpen(false);
    setMobileOpen(false);
  }, [currentHash]);

  const handleNav = (hash: string) => {
    onNavigate(hash);
    setMobileOpen(false);
    setToolsOpen(false);
  };

  const isToolsActive = currentHash.startsWith('#/tools');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/50'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNav('#/')}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative">
              <Image
                src="/logo.png"
                alt="ToolBox Pro Logo"
                width={34}
                height={34}
                className="rounded-lg transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-lg bg-[#8A2BE2]/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold tracking-tight gradient-text">
              ToolBox Pro
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNav('#/')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                currentHash === '#/' || currentHash === '#'
                  ? 'text-white bg-white/5'
                  : 'text-[#AAAAAA] hover:text-white hover:bg-white/5'
              }`}
            >
              {t('header', 'home', lang)}
            </button>

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                onMouseEnter={() => setToolsOpen(true)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isToolsActive
                    ? 'text-white bg-white/5'
                    : 'text-[#AAAAAA] hover:text-white hover:bg-white/5'
                }`}
              >
                {t('header', 'tools', lang)}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${
                    toolsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown - CSS transition */}
              <div
                onMouseLeave={() => setToolsOpen(false)}
                className={`absolute top-full right-0 mt-3 w-72 max-h-[70vh] overflow-y-auto rounded-2xl bg-[#111111] border border-[#222222] p-2 shadow-2xl shadow-black/60 transition-all duration-200 origin-top-right ${
                  toolsOpen
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
                }`}
              >
                {toolCategories.map((cat) => (
                  <div key={cat.group} className="mb-1 last:mb-0">
                    <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#555555]">
                      {t('toolCategories', cat.group, lang)}
                    </p>
                    {cat.items.map((tool) => (
                      <button
                        key={tool.hash}
                        onClick={() => handleNav(tool.hash)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 group ${
                          currentHash === tool.hash
                            ? 'text-white bg-[#8A2BE2]/10 border border-[#8A2BE2]/20'
                            : 'text-[#AAAAAA] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="block text-sm font-medium group-hover:text-white transition-colors">
                          {lang === 'hi' ? tool.nameHi : tool.name}
                        </span>
                        <span className="block text-[11px] text-[#555555] mt-0.5 group-hover:text-[#888888]">
                          {t('toolDescs', tool.descKey, lang)}
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleNav('#/blog')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                currentHash === '#/blog' || currentHash.startsWith('#/blog')
                  ? 'text-white bg-white/5'
                  : 'text-[#AAAAAA] hover:text-white hover:bg-white/5'
              }`}
            >
              {t('header', 'blog', lang)}
            </button>

            <button
              onClick={() => handleNav('#/contact')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                currentHash === '#/contact'
                  ? 'text-white bg-white/5'
                  : 'text-[#AAAAAA] hover:text-white hover:bg-white/5'
              }`}
            >
              {t('header', 'contact', lang)}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-[#AAAAAA] hover:text-white hover:bg-white/5 transition-all duration-300"
              title={lang === 'en' ? 'हिन्दी में देखें' : 'View in English'}
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-bold">{lang === 'en' ? 'HI' : 'EN'}</span>
            </button>

            {/* CTA */}
            <button
              onClick={() => handleNav('#/tools/password-generator')}
              className="ml-3 cta-primary px-5 py-2 rounded-xl text-white text-sm font-semibold"
            >
              <span>{t('header', 'tryFree', lang)}</span>
            </button>
          </div>

          {/* Mobile: Language + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[#AAAAAA] hover:text-white hover:bg-white/5 transition-all duration-300"
              title={lang === 'en' ? 'हिन्दी में देखें' : 'View in English'}
            >
              <Globe className="h-4 w-4" />
              <span className="text-[10px] font-bold">{lang === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                <Menu className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - CSS transition */}
      <div
        className={`md:hidden bg-black/98 backdrop-blur-2xl border-t border-white/5 transition-all duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-[800px] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-5 space-y-1">
          <button
            onClick={() => handleNav('#/')}
            className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all ${
              currentHash === '#/' || currentHash === '#'
                ? 'text-white bg-white/5'
                : 'text-[#AAAAAA] hover:text-white hover:bg-white/5'
            }`}
          >
            {t('header', 'home', lang)}
          </button>

          <div className="py-1">
            <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#444444]">
              {t('header', 'tools', lang)}
            </p>
            {toolCategories.map((cat) => (
              <div key={cat.group}>
                <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#444444]">
                  {t('toolCategories', cat.group, lang)}
                </p>
                {cat.items.map((tool) => (
                  <button
                    key={tool.hash}
                    onClick={() => handleNav(tool.hash)}
                    className={`block w-full text-left px-4 py-2.5 text-sm rounded-lg transition-all ${
                      currentHash === tool.hash
                        ? 'text-white bg-white/5'
                        : 'text-[#AAAAAA] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {lang === 'hi' ? tool.nameHi : tool.name}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-2">
            <button
              onClick={() => handleNav('#/blog')}
              className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                currentHash === '#/blog' || currentHash.startsWith('#/blog')
                  ? 'text-white bg-white/5'
                  : 'text-[#AAAAAA] hover:text-white hover:bg-white/5'
              }`}
            >
              {t('header', 'blog', lang)}
            </button>
            <button
              onClick={() => handleNav('#/contact')}
              className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                currentHash === '#/contact'
                  ? 'text-white bg-white/5'
                  : 'text-[#AAAAAA] hover:text-white hover:bg-white/5'
              }`}
            >
              {t('header', 'contact', lang)}
            </button>
          </div>

          <div className="pt-2 px-4">
            <button
              onClick={() => handleNav('#/tools/password-generator')}
              className="w-full cta-primary py-3 rounded-xl text-white text-sm font-semibold"
            >
              <span>{t('header', 'tryFreeTools', lang)}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
