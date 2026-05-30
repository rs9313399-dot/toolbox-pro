'use client';

import {
  KeyRound,
  Type,
  Image,
  Youtube,
  Instagram,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Users,
  ImagePlus,
  Video,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  FileImage,
  QrCode,
  Link,
  Volume2,
  Mic,
  Scale,
  Scissors,
  Braces,
  Binary,
  Palette,
  Smile,
  Calendar,
  Heart,
  ScanText,
  Film,
  Languages,
  Gauge,
  IndianRupee,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AdPlaceholder from './AdPlaceholder';
import AffiliateSection from './AffiliateSection';
import FAQSection from './FAQSection';
import { useLanguage } from '@/context/LanguageContext';
import { t, getTranslations } from '@/lib/i18n';

interface HomePageProps {
  onNavigate: (hash: string) => void;
}

const tools = [
  {
    name: 'Password Generator',
    nameHi: 'पासवर्ड जेनरेटर',
    hash: '#/tools/password-generator',
    icon: KeyRound,
    description: 'Create strong, secure passwords with customizable length and character options. Uses crypto.getRandomValues() for maximum security.',
    descriptionHi: 'अनुकूलन योग्य लंबाई और वर्ण विकल्पों के साथ मजबूत, सुरक्षित पासवर्ड बनाएं। अधिकतम सुरक्षा के लिए crypto.getRandomValues() का उपयोग।',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    name: 'Word Counter',
    nameHi: 'वर्ड काउंटर',
    hash: '#/tools/word-counter',
    icon: Type,
    description: 'Count words, characters, sentences, and paragraphs instantly with reading time estimation. Real-time text analysis.',
    descriptionHi: 'पढ़ने के समय के अनुमान के साथ शब्द, अक्षर, वाक्य और पैराग्राफ तुरंत गिनें। रीयल-टाइम टेक्स्ट विश्लेषण।',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    name: 'Image Compressor',
    nameHi: 'इमेज कम्प्रेसर',
    hash: '#/tools/image-compressor',
    icon: Image,
    description: 'Compress images in your browser without uploading. Adjust quality, preview side-by-side, and download instantly.',
    descriptionHi: 'अपलोड किए बिना अपने ब्राउज़र में इमेज कम्प्रेस करें। गुणवत्ता समायोजित करें, साइड-बाय-साइड पूर्वावलोकन करें।',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    name: 'YouTube Thumbnail',
    nameHi: 'YouTube थंबनेल',
    hash: '#/tools/youtube-thumbnail',
    icon: Youtube,
    description: 'Download YouTube video thumbnails in multiple resolutions. Just paste the URL and get all sizes instantly.',
    descriptionHi: 'कई रिज़ॉल्यूशन में YouTube वीडियो थंबनेल डाउनलोड करें। बस URL पेस्ट करें और सभी साइज़ तुरंत पाएं।',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  {
    name: 'Instagram Reel',
    nameHi: 'Instagram रील',
    hash: '#/tools/instagram-reel',
    icon: Instagram,
    description: 'Download Instagram reels for free. Paste the reel URL and get your download link or use alternative services.',
    descriptionHi: 'मुफ्त में Instagram रील्स डाउनलोड करें। रील URL पेस्ट करें और अपना डाउनलोड लिंक प्राप्त करें।',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
  {
    name: 'Image to PDF',
    nameHi: 'इमेज से PDF',
    hash: '#/tools/image-to-pdf',
    icon: FileImage,
    description: 'Convert images to PDF documents instantly. Upload multiple images, rearrange, and download as a single PDF.',
    descriptionHi: 'इमेज को PDF दस्तावेज़ों में तुरंत बदलें। कई इमेज अपलोड करें, पुनर्व्यवस्थित करें, और एक PDF के रूप में डाउनलोड करें।',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
  {
    name: 'PDF to Image',
    nameHi: 'PDF से इमेज',
    hash: '#/tools/pdf-to-image',
    icon: FileImage,
    description: 'Convert PDF pages to high-quality PNG images. Export each page individually or download all at once.',
    descriptionHi: 'PDF पेज को उच्च-गुणवत्ता PNG इमेज में बदलें। प्रत्येक पेज अलग से या सभी एक साथ डाउनलोड करें।',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    name: 'QR Code Generator',
    nameHi: 'QR कोड जेनरेटर',
    hash: '#/tools/qr-code-generator',
    icon: QrCode,
    description: 'Generate custom QR codes for URLs, text, WiFi, and more. Download high-quality PNG images instantly.',
    descriptionHi: 'URL, टेक्स्ट, WiFi और अन्य के लिए कस्टम QR कोड जेनरेट करें। उच्च-गुणवत्ता PNG इमेज तुरंत डाउनलोड करें।',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
  },
  {
    name: 'URL Shortener',
    nameHi: 'URL शॉर्टनर',
    hash: '#/tools/url-shortener',
    icon: Link,
    description: 'Shorten long URLs into compact, shareable links. Perfect for social media, messages, and marketing.',
    descriptionHi: 'लंबे URL को छोटे, साझा करने योग्य लिंक में बदलें। सोशल मीडिया, संदेश और मार्केटिंग के लिए उत्तम।',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    name: 'Text to Speech',
    nameHi: 'टेक्स्ट टू स्पीच',
    hash: '#/tools/text-to-speech',
    icon: Volume2,
    description: 'Convert text to natural speech using browser speech synthesis. Adjust speed, pitch, and volume.',
    descriptionHi: 'ब्राउज़र स्पीच सिंथेसिस का उपयोग करके टेक्स्ट को प्राकृतिक भाषण में बदलें। स्पीड, पिच और वॉल्यूम समायोजित करें।',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
  },
  {
    name: 'Speech to Text',
    nameHi: 'स्पीच टू टेक्स्ट',
    hash: '#/tools/speech-to-text',
    icon: Mic,
    description: 'Convert voice to text in real-time using speech recognition. Perfect for dictation and note-taking.',
    descriptionHi: 'स्पीच रिकग्निशन का उपयोग करके आवाज़ को रीयल-टाइम में टेक्स्ट में बदलें। डिक्टेशन और नोट लेने के लिए उत्तम।',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
  },
  {
    name: 'Image Resizer',
    nameHi: 'इमेज रीसाइज़र',
    hash: '#/tools/image-resizer',
    icon: Scale,
    description: 'Resize images to any dimension. Maintain aspect ratio, use presets, and download in multiple formats.',
    descriptionHi: 'किसी भी आयाम में इमेज रीसाइज़ करें। आस्पेक्ट रेश्यो बनाए रखें, प्रीसेट का उपयोग करें।',
    color: 'text-lime-400',
    bg: 'bg-lime-500/10',
    border: 'border-lime-500/20',
  },
  {
    name: 'Background Remover',
    nameHi: 'बैकग्राउंड रिमूवर',
    hash: '#/tools/background-remover',
    icon: Scissors,
    description: 'Remove image backgrounds instantly with color-based processing. Get transparent PNG output.',
    descriptionHi: 'कलर-आधारित प्रोसेसिंग से इमेज बैकग्राउंड तुरंत हटाएं। पारदर्शी PNG आउटपुट प्राप्त करें।',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
  },
  {
    name: 'JSON Formatter',
    nameHi: 'JSON फॉर्मेटर',
    hash: '#/tools/json-formatter',
    icon: Braces,
    description: 'Format, validate, and beautify JSON data. Detect errors, minify output, and convert between formats.',
    descriptionHi: 'JSON डेटा को फॉर्मेट, वैलिडेट और ब्यूटीफाई करें। त्रुटियों का पता लगाएं, आउटपुट मिनीफाई करें।',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
  },
  {
    name: 'Base64 Encoder',
    nameHi: 'Base64 एनकोडर',
    hash: '#/tools/base64-encoder',
    icon: Binary,
    description: 'Encode text or files to Base64 and decode back. Essential for developers working with APIs and data URIs.',
    descriptionHi: 'टेक्स्ट या फ़ाइलों को Base64 में एनकोड करें और डिकोड करें। API और Data URI के साथ काम करने वाले डेवलपर्स के लिए।',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    name: 'Color Picker',
    nameHi: 'कलर पिकर',
    hash: '#/tools/color-picker',
    icon: Palette,
    description: 'Pick colors and get HEX, RGB, HSL values instantly. Explore presets and keep a history of your selections.',
    descriptionHi: 'रंग चुनें और HEX, RGB, HSL मान तुरंत प्राप्त करें। प्रीसेट एक्सप्लोर करें और अपने चयन का इतिहास रखें।',
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/20',
  },
  {
    name: 'Age Calculator',
    nameHi: 'आयु कैलकुलेटर',
    hash: '#/tools/age-calculator',
    icon: Calendar,
    description: 'Calculate your exact age in years, months, days, hours, and more. Discover fun facts about your life.',
    descriptionHi: 'वर्षों, महीनों, दिनों, घंटों और अन्य में अपनी सटीक उम्र की गणना करें।',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    name: 'Emoji Keyboard',
    nameHi: 'इमोजी कीबोर्ड',
    hash: '#/tools/emoji-keyboard',
    icon: Smile,
    description: 'Browse and copy emojis easily with categories, search, and recent history. Click to copy instantly!',
    descriptionHi: 'श्रेणियों, खोज और हालिया इतिहास के साथ इमोजी आसानी से ब्राउज़ और कॉपी करें!',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    name: 'Love Calculator',
    nameHi: 'लव कैलकुलेटर',
    hash: '#/tools/love-calculator',
    icon: Heart,
    description: 'Calculate your love compatibility percentage with your partner. Just enter names and have fun!',
    descriptionHi: 'अपने पार्टनर के साथ प्यार की संगतता प्रतिशत की गणना करें। बस नाम दर्ज करें और मज़े करें!',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
  {
    name: 'EMI Calculator',
    nameHi: 'EMI कैलकुलेटर',
    hash: '#/tools/emi-calculator',
    icon: IndianRupee,
    description: 'Calculate loan EMI, total interest, and payment schedule with detailed amortization table.',
    descriptionHi: 'विस्तृत परिशोधन तालिका के साथ लोन EMI, कुल ब्याज और भुगतान अनुसूची की गणना करें।',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    name: 'Image to Text (OCR)',
    nameHi: 'इमेज से टेक्स्ट (OCR)',
    hash: '#/tools/image-to-text',
    icon: ScanText,
    description: 'Extract text from images using OCR technology. Upload a photo and get editable text instantly.',
    descriptionHi: 'OCR तकनीक का उपयोग करके इमेज से टेक्स्ट निकालें। फोटो अपलोड करें और संपादन योग्य टेक्स्ट तुरंत पाएं।',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
  {
    name: 'Video to Audio',
    nameHi: 'वीडियो से ऑडियो',
    hash: '#/tools/video-to-audio',
    icon: Film,
    description: 'Extract audio from video files. Upload a video and download the audio track as WAV instantly.',
    descriptionHi: 'वीडियो फ़ाइलों से ऑडियो निकालें। वीडियो अपलोड करें और ऑडियो ट्रैक WAV के रूप में डाउनलोड करें।',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  {
    name: 'Hindi Typing Tool',
    nameHi: 'हिन्दी टाइपिंग टूल',
    hash: '#/tools/hindi-typing',
    icon: Languages,
    description: 'Type in Hindi using English letters. Automatic Hinglish to Devanagari conversion with copy & download.',
    descriptionHi: 'अंग्रेज़ी अक्षरों से हिन्दी में टाइप करें। हिंगलिश से देवनागरी स्वचालित रूपांतरण।',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    name: 'Plagiarism Checker',
    nameHi: 'प्लेजिरिज्म चेकर',
    hash: '#/tools/plagiarism-checker',
    icon: ShieldCheck,
    description: 'Compare two texts and find similarities. Detect matching phrases and sentences with detailed analysis.',
    descriptionHi: 'दो टेक्स्ट की तुलना करें और समानताएं खोजें। विस्तृत विश्लेषण के साथ मिलती-जुलती वाक्यांशों का पता लगाएं।',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    name: 'Website Speed Test',
    nameHi: 'वेबसाइट स्पीड टेस्ट',
    hash: '#/tools/website-speed-test',
    icon: Gauge,
    description: 'Test any website speed and performance. Get detailed metrics including TTFB, load time, and recommendations.',
    descriptionHi: 'किसी भी वेबसाइट की गति और प्रदर्शन का परीक्षण करें। TTFB, लोड समय और सिफारिशों सहित विस्तृत मेट्रिक्स।',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
  },
];

const categoryData = [
  { key: 'imagePdf', icon: ImagePlus, count: 7, toolHash: '#/tools/image-compressor', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  { key: 'videoAudio', icon: Video, count: 3, toolHash: '#/tools/youtube-thumbnail', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { key: 'textTools', icon: Type, count: 6, toolHash: '#/tools/word-counter', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { key: 'security', icon: ShieldCheck, count: 1, toolHash: '#/tools/password-generator', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { key: 'developer', icon: Braces, count: 5, toolHash: '#/tools/json-formatter', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { key: 'calculators', icon: Calendar, count: 3, toolHash: '#/tools/emi-calculator', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
];

// Scroll reveal hook
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setIsVisible(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { lang } = useLanguage();
  const categoriesReveal = useReveal();
  const statsReveal = useReveal();
  const faqReveal = useReveal();
  const toolsReveal = useReveal();
  const blogReveal = useReveal();

  const benefits = [
    t('benefits', 'noAccount', lang),
    t('benefits', 'dataSafe', lang),
    t('benefits', 'fast', lang),
    t('benefits', 'anyDevice', lang),
  ];

  const stats = [
    { label: t('stats', 'trusted', lang), icon: Users },
    { label: t('stats', 'freeTools', lang), icon: Zap },
    { label: t('stats', 'noSignup', lang), icon: ShieldCheck },
    { label: t('stats', 'browserBased', lang), icon: Globe },
  ];

  // Get FAQ with proper answers
  const getFAQItems = () => {
    const tr = getTranslations();
    return [
      { question: tr.homeFAQ.q1.question[lang], answer: tr.homeFAQ.q1.answer[lang] },
      { question: tr.homeFAQ.q2.question[lang], answer: tr.homeFAQ.q2.answer[lang] },
      { question: tr.homeFAQ.q3.question[lang], answer: tr.homeFAQ.q3.answer[lang] },
      { question: tr.homeFAQ.q4.question[lang], answer: tr.homeFAQ.q4.answer[lang] },
      { question: tr.homeFAQ.q5.question[lang], answer: tr.homeFAQ.q5.answer[lang] },
    ];
  };

  return (
    <main className="min-h-screen pt-18">
      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-44">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#8A2BE2]/12 blur-[180px] animate-orb" />
          <div className="absolute top-20 -right-40 w-[400px] h-[400px] rounded-full bg-[#00FFFF]/8 blur-[150px] animate-orb-reverse" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#8A2BE2]/5 blur-[200px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 mb-8 animate-fade-in-up">
            <Zap className="h-3.5 w-3.5 text-[#8A2BE2]" />
            <span className="text-xs font-medium text-[#8A2BE2]">{t('hero', 'badge', lang)}</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-6 leading-[1.05] animate-fade-in-up">
            <span className="gradient-text">{t('hero', 'titleLine1', lang)}</span>
            <br />
            <span className="text-white">{t('hero', 'titleLine2', lang)}</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#AAAAAA] max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            {t('hero', 'subtitle', lang)}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => onNavigate('#/tools/password-generator')}
              className="cta-primary inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white font-semibold text-sm animate-btn-glow"
            >
              <span>{t('hero', 'exploreTools', lang)}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('#/blog')}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl border border-[#222222] text-white font-semibold text-sm hover:border-[#8A2BE2]/50 hover:bg-white/5 transition-all duration-300"
            >
              <BookOpen className="h-4 w-4" />
              {t('hero', 'readBlog', lang)}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            {benefits.map((benefit) => (
              <span key={benefit} className="flex items-center gap-1.5 text-sm text-[#666666]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#8A2BE2]" />
                {benefit}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ AD BANNER ═══════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <AdPlaceholder size="banner" />
      </div>

      {/* ═══════════════════ FEATURED TOOLS ═══════════════════ */}
      <div ref={toolsReveal.ref} className={`reveal-section ${toolsReveal.isVisible ? 'js-reveal' : ''} mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24`}>
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">
              <span className="gradient-text">{t('featuredTools', 'title', lang)}</span>
            </h2>
            <p className="text-[#AAAAAA] text-base sm:text-lg max-w-xl mx-auto">
              {t('featuredTools', 'subtitle', lang)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {tools.map((tool) => (
              <button
                key={tool.hash}
                onClick={() => onNavigate(tool.hash)}
                className="tool-card p-7 text-left group"
              >
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${tool.bg} border ${tool.border} mb-6 transition-all duration-300 group-hover:scale-110`}
                >
                  <tool.icon className={`h-7 w-7 ${tool.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#8A2BE2] transition-colors duration-300">
                  {lang === 'hi' ? tool.nameHi : tool.name}
                </h3>
                <p className="text-sm text-[#888888] leading-relaxed mb-5">
                  {lang === 'hi' ? tool.descriptionHi : tool.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#8A2BE2] group-hover:gap-3 transition-all duration-300">
                  {t('featuredTools', 'useTool', lang)}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* ═══════════════════ CATEGORIES ═══════════════════ */}
      <div ref={categoriesReveal.ref} className={`reveal-section ${categoriesReveal.isVisible ? 'js-reveal' : ''} mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24`}>
        <section>
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
              <span className="gradient-text-reverse">{t('categories', 'title', lang)}</span>
            </h2>
            <p className="text-[#AAAAAA] text-base max-w-lg mx-auto">
              {t('categories', 'subtitle', lang)}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryData.map((cat) => (
              <button
                key={cat.key}
                onClick={() => onNavigate(cat.toolHash)}
                className="tool-card p-6 sm:p-8 text-center cursor-pointer"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${cat.bg} border ${cat.border} mb-4`}>
                  <cat.icon className={`h-6 w-6 ${cat.color}`} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">
                  {t('categories', cat.key, lang)}
                </h3>
                <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-2.5 rounded-full bg-white/5 text-[10px] font-medium text-[#888888]">
                  {cat.count} {cat.count !== 1 ? t('categories', 'toolsCount', lang) : t('categories', 'toolSingular', lang)}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* ═══════════════════ STATS/TRUST ═══════════════════ */}
      <div ref={statsReveal.ref} className={`reveal-section ${statsReveal.isVisible ? 'js-reveal' : ''} mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24`}>
        <section>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-3xl p-10 sm:p-16 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#8A2BE2]/5 blur-[200px] pointer-events-none" />
            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 mb-4">
                    <stat.icon className="h-6 w-6 text-[#8A2BE2]" />
                  </div>
                  <p className="text-sm font-medium text-[#AAAAAA] leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════════ IN-CONTENT AD ═══════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24">
        <AdPlaceholder size="in-content" />
      </div>

      {/* ═══════════════════ BLOG PREVIEW ═══════════════════ */}
      <div ref={blogReveal.ref} className={`reveal-section ${blogReveal.isVisible ? 'js-reveal' : ''} mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24`}>
        <section>
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
                {t('blogPreview', 'title', lang)}
              </h2>
              <p className="text-[#AAAAAA] text-base">
                {t('blogPreview', 'subtitle', lang)}
              </p>
            </div>
            <button
              onClick={() => onNavigate('#/blog')}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#8A2BE2] hover:gap-3 transition-all duration-300"
            >
              {t('blogPreview', 'viewAll', lang)}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: lang === 'hi' ? '2026 में सबसे अच्छे मुफ्त ऑनलाइन टूल्स' : 'Best Free Online Tools in 2026',
                excerpt: lang === 'hi' ? 'प्रोडक्टिविटी बढ़ाने वाले शीर्ष मुफ्त टूल्स की खोज करें।' : 'Discover top free tools that boost productivity and make life easier.',
                category: lang === 'hi' ? 'गाइड' : 'Guides',
                color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
              },
              {
                title: lang === 'hi' ? 'गुणवत्ता खोए बिना इमेज कैसे कम्प्रेस करें' : 'How to Compress Images Without Losing Quality',
                excerpt: lang === 'hi' ? 'इमेज कम्प्रेशन की तकनीकें सीखें जो दृश्य गुणवत्ता बनाए रखती हैं।' : 'Learn techniques for image compression that maintain visual quality.',
                category: lang === 'hi' ? 'ट्यूटोरियल' : 'Tutorials',
                color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
              },
              {
                title: lang === 'hi' ? 'मजबूत पासवर्ड के लिए अंतिम गाइड' : 'The Ultimate Guide to Strong Passwords',
                excerpt: lang === 'hi' ? 'पासवर्ड सुरक्षा टिप्स से अपने अकाउंट सुरक्षित करें।' : 'Protect your accounts with these password security tips.',
                category: lang === 'hi' ? 'सुरक्षा' : 'Security',
                color: 'bg-green-500/10 text-green-400 border-green-500/20',
              },
            ].map((post) => (
              <button
                key={post.title}
                onClick={() => onNavigate('#/blog')}
                className="tool-card p-6 text-left group"
              >
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium border ${post.color} mb-4`}>
                  {post.category}
                </span>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#8A2BE2] transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-sm text-[#888888] leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#8A2BE2] group-hover:gap-2.5 transition-all duration-300">
                  {t('blogPreview', 'readMore', lang)}
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
            ))}
          </div>

          <div className="sm:hidden mt-6 text-center">
            <button
              onClick={() => onNavigate('#/blog')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#8A2BE2]"
            >
              {t('blogPreview', 'viewAllPosts', lang)}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>

      {/* ═══════════════════ FAQ SECTION ═══════════════════ */}
      <div ref={faqReveal.ref} className={`reveal-section ${faqReveal.isVisible ? 'js-reveal' : ''} mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-24`}>
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00FFFF]/10 border border-[#00FFFF]/20 mb-5">
              <HelpCircle className="h-7 w-7 text-[#00FFFF]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
              {t('faq', 'title', lang)}
            </h2>
            <p className="text-[#AAAAAA] text-base max-w-lg mx-auto">
              {t('faq', 'subtitle', lang)}
            </p>
          </div>
          <FAQSection items={getFAQItems()} pageTitle="ToolBox Pro" />
        </section>
      </div>

      {/* ═══════════════════ AFFILIATE SECTION ═══════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <AffiliateSection />
      </div>

      {/* ═══════════════════ BOTTOM AD ═══════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <AdPlaceholder size="banner" />
      </div>
    </main>
  );
}
