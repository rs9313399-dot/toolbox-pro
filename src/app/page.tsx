'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/components/HomePage';
import BlogPage from '@/components/BlogPage';
import BlogDetailPage from '@/components/BlogDetailPage';
import ContactPage from '@/components/ContactPage';
import PasswordGenerator from '@/components/tools/PasswordGenerator';
import WordCounter from '@/components/tools/WordCounter';
import ImageCompressor from '@/components/tools/ImageCompressor';
import YouTubeThumbnail from '@/components/tools/YouTubeThumbnail';
import InstagramReel from '@/components/tools/InstagramReel';
import ImageToPdf from '@/components/tools/ImageToPdf';
import PdfToImage from '@/components/tools/PdfToImage';
import QrCodeGenerator from '@/components/tools/QrCodeGenerator';
import UrlShortener from '@/components/tools/UrlShortener';
import TextToSpeech from '@/components/tools/TextToSpeech';
import SpeechToText from '@/components/tools/SpeechToText';
import ImageResizer from '@/components/tools/ImageResizer';
import BackgroundRemover from '@/components/tools/BackgroundRemover';
import JsonFormatter from '@/components/tools/JsonFormatter';
import Base64Encoder from '@/components/tools/Base64Encoder';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import AboutPage from '@/components/AboutPage';
import TermsOfService from '@/components/TermsOfService';
import DisclaimerPage from '@/components/DisclaimerPage';
import PricingPage from '@/components/PricingPage';

/* ────────────────────────────────────────────
   Blog data — shared across listing + detail
   ──────────────────────────────────────────── */

const blogPosts = [
  {
    id: 1,
    slug: 'best-free-online-tools-2026',
    title: 'Best Free Online Tools in 2026',
    excerpt: 'Discover the top free online tools that can boost your productivity and make your life easier in 2026.',
    date: '2026-05-15',
    readTime: '6 min',
    category: 'Guides',
    image: '/blog/best-free-online-tools-2026.png',
    content: `The landscape of free online tools continues to evolve rapidly. In 2026, we have access to incredibly powerful browser-based tools that rival desktop applications.\n\n## Top Picks for 2026\n\n**1. Password Generators** - With cyber threats on the rise, using a strong password generator is more important than ever. Modern generators use crypto.getRandomValues() for maximum security.\n\n**2. Image Compression Tools** - Browser-based image compressors have gotten remarkably good, often achieving 60-70% file size reduction with minimal quality loss.\n\n**3. Text Analysis Tools** - Word counters and text analyzers now offer real-time statistics including reading time and SEO recommendations.\n\n**4. QR Code Generators** - Modern QR code tools support URLs, WiFi credentials, email, and phone numbers with customization options.\n\n**5. JSON Formatters** - Essential for developers working with APIs, these tools provide instant validation and formatting.\n\nThe best part? All of these tools run entirely in your browser. No servers, no signups, no downloads required.`,
    author: 'ToolBox Pro Team',
  },
  {
    id: 2,
    slug: 'compress-images-without-losing-quality',
    title: 'How to Compress Images Without Losing Quality',
    excerpt: 'Learn the best techniques for image compression that maintain visual quality while dramatically reducing file sizes.',
    date: '2026-04-28',
    readTime: '8 min',
    category: 'Tutorials',
    image: '/blog/compress-images-without-losing-quality.png',
    content: `Image compression is essential for web performance, but doing it right means balancing file size with visual quality.\n\n## Understanding Compression Types\n\n**Lossy Compression** reduces file size by permanently eliminating certain data. JPEG is the most common lossy format.\n\n**Lossless Compression** reduces file size without losing any data. PNG uses lossless compression, but file sizes are typically larger.\n\n## Best Practices\n\n1. **Choose the right format**: Use JPEG for photos and WebP for web graphics.\n\n2. **Adjust quality wisely**: A quality setting of 75-85% for JPEG typically produces excellent results.\n\n3. **Resize before compressing**: Don't upload a 4000px image when 1200px will do.\n\n4. **Use progressive JPEG**: Progressive JPEGs load in layers, giving users a low-quality preview quickly.\n\n## Browser-Based Compression\n\nModern browser tools use the HTML5 Canvas API to compress images client-side:\n- Your images never leave your device\n- Processing is instant\n- No server upload required\n- Complete privacy\n\nTry our Image Compressor tool to see these techniques in action!`,
    author: 'Sarah Mitchell',
  },
  {
    id: 3,
    slug: 'ultimate-guide-to-strong-passwords',
    title: 'The Ultimate Guide to Strong Passwords',
    excerpt: 'Protect your accounts with these password security tips and learn why password strength matters more than ever.',
    date: '2026-04-10',
    readTime: '7 min',
    category: 'Security',
    image: '/blog/ultimate-guide-to-strong-passwords.png',
    content: `In an era of increasing cyber threats, password security is your first line of defense.\n\n## Why Password Strength Matters\n\nA 6-character password with only lowercase letters can be cracked in under 10 minutes. A 16-character password with mixed character types would take billions of years to crack.\n\n## Characteristics of a Strong Password\n\n- **Length**: At least 12 characters, preferably 16+\n- **Complexity**: Mix of uppercase, lowercase, numbers, and symbols\n- **Uniqueness**: Different for every account\n- **Randomness**: Not based on personal information or dictionary words\n\n## Common Mistakes\n\n1. **Reusing passwords** - If one account is breached, all accounts with the same password are compromised\n\n2. **Using personal information** - Birthdays, pet names, and addresses are easy to guess\n\n3. **Short passwords** - Even complex short passwords can be cracked quickly\n\n## The Solution: Password Managers + Generators\n\nUse a password generator to create unique, random passwords for each account. Store them in a reputable password manager.\n\nStart generating secure passwords today with our Password Generator tool!`,
    author: 'David Chen',
  },
  {
    id: 4,
    slug: 'youtube-thumbnail-best-practices',
    title: 'YouTube Thumbnail Best Practices for Content Creators',
    excerpt: 'Create eye-catching thumbnails that drive clicks and grow your channel with these proven design strategies.',
    date: '2026-03-22',
    readTime: '9 min',
    category: 'Content Creation',
    image: '/blog/youtube-thumbnail-best-practices.png',
    content: `Your YouTube thumbnail is often the first impression potential viewers have of your content.\n\n## Why Thumbnails Matter\n\nStudies show that 90% of the best-performing YouTube videos use custom thumbnails. A compelling thumbnail can increase click-through rates by 30-50%.\n\n## Design Best Practices\n\n1. **Use high-contrast colors**: Bright, contrasting colors stand out in YouTube's interface.\n\n2. **Include expressive faces**: Close-up faces with strong emotions attract more clicks.\n\n3. **Keep text minimal**: 3-5 words maximum, large enough to read on mobile.\n\n4. **Maintain consistency**: Use a consistent style across thumbnails to build brand recognition.\n\n5. **Use the right dimensions**: 1280x720 pixels, 16:9 aspect ratio.\n\n## Technical Requirements\n\n- Minimum resolution: 640x360 pixels\n- Recommended resolution: 1280x720 pixels\n- File size: Under 2MB\n- Formats: JPG, GIF, BMP, or PNG\n\nUse our YouTube Thumbnail Downloader to study what works for successful channels!`,
    author: 'Alex Rivera',
  },
  {
    id: 5,
    slug: 'word-count-matters-writing-for-web',
    title: 'Word Count Matters: How to Write for the Web',
    excerpt: 'Understanding the ideal word count for different content types and why it matters for SEO and engagement.',
    date: '2026-03-05',
    readTime: '5 min',
    category: 'Writing',
    image: '/blog/word-count-matters-writing-for-web.png',
    content: `Word count isn't just a number—it's a strategic consideration that affects SEO, reader engagement, and content effectiveness.\n\n## Ideal Word Counts by Content Type\n\n- **Blog posts**: 1,500-2,500 words for comprehensive guides\n- **Product pages**: 300-500 words for descriptions\n- **Social media posts**: 40-80 characters for maximum engagement\n- **Email newsletters**: 200-500 words\n- **Landing pages**: 500-1,000 words\n\n## The SEO Connection\n\nLong-form content (1,500+ words) tends to rank higher in search results. However, quality always trumps quantity.\n\n## Reading Time Matters\n\nAverage reading speed is about 200-250 words per minute. Always consider how long your content will take to read.\n\nUse our Word Counter tool to track your word count and estimate reading time in real-time!`,
    author: 'Emily Brooks',
  },
  {
    id: 6,
    slug: 'essential-browser-tools-everyone-should-know',
    title: '10 Essential Browser Tools Everyone Should Know',
    excerpt: 'These free browser-based tools can save you hours of work and boost your productivity without installing anything.',
    date: '2026-02-18',
    readTime: '6 min',
    category: 'Productivity',
    image: '/blog/essential-browser-tools-everyone-should-know.png',
    content: `You don't need to install expensive software to be productive. These free browser-based tools can handle most everyday tasks.\n\n## The Top 10\n\n**1. Password Generators** - Create unbreakable passwords in seconds.\n\n**2. Word Counters** - Track word counts and reading time.\n\n**3. Image Compressors** - Reduce image file sizes for faster loading.\n\n**4. QR Code Generators** - Create QR codes for URLs, text, WiFi, and more.\n\n**5. JSON Formatters** - Clean up and validate JSON data instantly.\n\n**6. Base64 Encoders/Decoders** - Convert data between formats.\n\n**7. Image Resizers** - Resize images to exact dimensions.\n\n**8. Background Removers** - Remove image backgrounds instantly.\n\n**9. PDF Converters** - Convert between images and PDF documents.\n\n**10. Text to Speech** - Convert written text to natural-sounding speech.\n\n## Why Browser-Based Tools Win\n\n- No installation required\n- Always up to date\n- Privacy focused\n- Cross-platform\n\nAll of these tools are available for free on ToolBox Pro!`,
    author: 'ToolBox Pro Team',
  },
  {
    id: 7,
    slug: 'qr-codes-business-marketing-guide',
    title: 'QR Codes for Business: A Complete Marketing Guide',
    excerpt: 'Learn how businesses are using QR codes to drive engagement, streamline payments, and connect with customers.',
    date: '2026-02-02',
    readTime: '8 min',
    category: 'Guides',
    image: '/blog/qr-codes-business-marketing-guide.png',
    content: `QR codes have evolved from a novelty to an essential business tool. Here's how to leverage them effectively.\n\n## The QR Code Renaissance\n\nSince 2020, QR code usage has skyrocketed by over 300%. The pandemic normalized scanning codes for menus, payments, and information.\n\n## Business Use Cases\n\n**Restaurant Menus** - Replace physical menus with QR codes on tables.\n\n**Product Packaging** - Add QR codes that link to instructions or promotional content.\n\n**Business Cards** - QR codes can store full contact information (vCard).\n\n**Event Tickets** - Digital tickets with QR codes enable contactless entry.\n\n## Best Practices\n\n1. **Always test before printing** - Scan with multiple devices and apps.\n\n2. **Provide context** - Tell people what they'll get when they scan.\n\n3. **Use a short URL** - Shorter URLs create simpler QR codes.\n\n4. **Choose the right size** - At least 2cm x 2cm for close-range scanning.\n\n5. **Ensure contrast** - Dark foreground on light background works best.\n\nCreate professional QR codes instantly with our QR Code Generator tool!`,
    author: 'Michael Torres',
  },
  {
    id: 8,
    slug: 'image-formats-explained-jpeg-png-webp',
    title: 'Image Formats Explained: JPEG vs PNG vs WebP',
    excerpt: 'Understanding the differences between image formats and when to use each one for optimal quality and performance.',
    date: '2026-01-20',
    readTime: '7 min',
    category: 'Tutorials',
    image: '/blog/image-formats-explained-jpeg-png-webp.png',
    content: `Choosing the right image format can make a huge difference in quality and performance.\n\n## JPEG\n\nJPEG uses lossy compression, meaning some image data is permanently discarded.\n\n**Best for:** Photographs, complex images with many colors.\n**Pros:** Small file sizes, universal browser support.\n**Cons:** Lossy, no transparency, artifacts at high compression.\n\n## PNG\n\nPNG uses lossless compression with transparency support through an alpha channel.\n\n**Best for:** Graphics with text, logos, images requiring transparency.\n**Pros:** Lossless quality, transparency, sharp edges.\n**Cons:** Larger file sizes than JPEG.\n\n## WebP\n\nDeveloped by Google, WebP supports both lossy and lossless compression plus transparency.\n\n**Best for:** Web images where performance matters.\n**Pros:** Smaller than JPEG/PNG, supports transparency and animation.\n**Cons:** Not supported in older browsers.\n\n## Quick Decision Guide\n\n- **Photograph?** Use JPEG or WebP\n- **Need transparency?** Use PNG or WebP\n- **Maximum performance?** Use WebP\n- **Maximum compatibility?** Use JPEG\n\nConvert and optimize images using our Image Compressor and Image Resizer tools!`,
    author: 'Sarah Mitchell',
  },
  {
    id: 9,
    slug: 'text-to-speech-accessibility-guide',
    title: 'Text to Speech: Making Content Accessible for Everyone',
    excerpt: 'How TTS technology is transforming content accessibility and why every website should consider audio alternatives.',
    date: '2026-01-08',
    readTime: '6 min',
    category: 'Accessibility',
    image: '/blog/text-to-speech-accessibility-guide.png',
    content: `Text-to-Speech (TTS) technology has come a long way from robotic-sounding voices.\n\n## Who Benefits from TTS?\n\n**Visually Impaired Users** - People with low vision or blindness rely on TTS to consume written content.\n\n**People with Dyslexia** - TTS allows them to listen to content, improving comprehension and reducing fatigue.\n\n**Language Learners** - Hearing text pronounced correctly helps improve pronunciation.\n\n**Multitaskers** - Listen to articles while commuting, exercising, or doing household tasks.\n\n## Browser-Based TTS\n\nThe Web Speech API enables TTS directly in the browser:\n- No server processing required\n- Instant playback with no latency\n- Multiple voices and languages\n- Adjustable speed, pitch, and volume\n- Complete privacy — text never leaves your device\n\n## Best Practices for TTS-Friendly Content\n\n1. **Use clear, simple language** - Short sentences and common words are easier for TTS engines.\n\n2. **Avoid excessive jargon** - Technical terms may be mispronounced.\n\n3. **Structure with headings** - Proper heading hierarchy helps TTS users navigate.\n\n4. **Provide text alternatives** - Always include text transcripts for audio content.\n\nTry our Text to Speech tool to convert any text to natural-sounding speech!`,
    author: 'Priya Sharma',
  },
  {
    id: 10,
    slug: 'json-formatter-developer-essentials',
    title: "JSON Formatter: A Developer's Essential Tool",
    excerpt: 'Why every developer needs a reliable JSON formatter and how it can save hours of debugging time.',
    date: '2025-12-15',
    readTime: '5 min',
    category: 'Developer',
    image: '/blog/json-formatter-developer-essentials.png',
    content: `JSON is the backbone of modern web development. A good formatter is essential.\n\n## Why Formatting Matters\n\nRaw JSON from APIs often arrives minified — a single line of compressed text with no spacing. A formatter transforms this into properly indented, readable structure.\n\n## Common JSON Issues\n\n**Trailing Commas** - JSON doesn't allow trailing commas, but JavaScript does.\n\n**Single Quotes** - JSON requires double quotes for strings and keys.\n\n**Unquoted Keys** - Object keys must be quoted in JSON.\n\n**Comments** - JSON doesn't support comments.\n\n**Character Encoding** - Special characters must be properly escaped.\n\n## Features Every JSON Formatter Should Have\n\n1. **Syntax Validation** - Instantly detect and highlight errors with line numbers\n2. **Pretty Print** - Format with consistent 2-space indentation\n3. **Minification** - Compress JSON for production use\n4. **Tree View** - Navigate complex structures visually\n5. **Error Recovery** - Attempt to fix common mistakes automatically\n6. **Copy to Clipboard** - One-click copy of formatted output\n\nOur JSON Formatter tool provides all of these features, running entirely in your browser!`,
    author: 'Raj Patel',
  },
  {
    id: 11,
    slug: 'base64-encoding-complete-guide',
    title: 'Base64 Encoding: The Complete Guide for Developers',
    excerpt: 'Everything you need to know about Base64 encoding, from basic concepts to advanced use cases in web development.',
    date: '2025-11-28',
    readTime: '7 min',
    category: 'Developer',
    image: '/blog/base64-encoding-complete-guide.png',
    content: `Base64 encoding is a fundamental concept every web developer encounters.\n\n## What is Base64?\n\nBase64 converts binary data into ASCII characters using a set of 64 characters (A-Z, a-z, 0-9, +, /) plus = for padding. Every 3 bytes of binary data become 4 ASCII characters.\n\n## Common Use Cases\n\n**Data URIs** - Embed small images directly in HTML or CSS using Base64-encoded data URIs.\n\n**API Authentication** - HTTP Basic Auth sends credentials as Base64-encoded strings.\n\n**Email Attachments** - MIME encoding uses Base64 for binary file attachments.\n\n**JWT Tokens** - JSON Web Tokens use Base64URL encoding for header and payload sections.\n\n## Security Considerations\n\nBase64 is **NOT encryption**. It provides zero security — anyone can decode Base64 data. Never use it to protect sensitive information.\n\n## Performance Impact\n\nThe 33% size overhead means larger network payloads and increased memory usage. Use Base64 selectively.\n\nTry our Base64 Encoder/Decoder tool for instant encoding and decoding!`,
    author: 'Raj Patel',
  },
  {
    id: 12,
    slug: 'remove-background-product-photos',
    title: 'How to Remove Backgrounds from Product Photos',
    excerpt: 'Step-by-step guide to creating clean, professional product images with transparent backgrounds for e-commerce.',
    date: '2025-11-10',
    readTime: '6 min',
    category: 'Tutorials',
    image: '/blog/remove-background-product-photos.png',
    content: `Professional product photos with clean backgrounds are essential for e-commerce success.\n\n## Why Clean Backgrounds Matter\n\nProducts on clean, white or transparent backgrounds have higher conversion rates across major e-commerce platforms.\n\n## Shooting Tips for Easy Background Removal\n\n1. **Use a solid background** - White, black, or green screen backgrounds are easiest to remove.\n\n2. **Ensure good lighting** - Even, diffused lighting eliminates harsh shadows.\n\n3. **Maintain contrast** - Dark products on light backgrounds (or vice versa) work best.\n\n4. **Keep the background uniform** - Stretch fabric backgrounds tight and iron out wrinkles.\n\n## Browser-Based Background Removal\n\n- Color-based thresholding works great for solid backgrounds\n- Adjustable tolerance controls how aggressively the background is removed\n- Instant preview with before/after comparison\n- Transparent PNG output ready for use\n\n## After Removal: Next Steps\n\n- Place the product on a white background for Amazon/eBay\n- Add a custom gradient for social media\n- Create composite images with multiple products\n\nTry our Background Remover tool to create professional product images instantly!`,
    author: 'Alex Rivera',
  },
];

function useHashRouter() {
  const [hash, setHash] = useState(
    typeof window !== 'undefined' ? window.location.hash || '#/' : '#/'
  );

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((newHash: string) => {
    window.location.hash = newHash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { hash, navigate };
}

function Router({ hash, navigate }: { hash: string; navigate: (h: string) => void }) {
  const route = hash || '#/';

  // Home
  if (route === '#/' || route === '#' || route === '') {
    return <HomePage onNavigate={navigate} />;
  }

  // Tool pages
  if (route === '#/tools/password-generator') return <PasswordGenerator onNavigate={navigate} />;
  if (route === '#/tools/word-counter') return <WordCounter onNavigate={navigate} />;
  if (route === '#/tools/image-compressor') return <ImageCompressor onNavigate={navigate} />;
  if (route === '#/tools/youtube-thumbnail') return <YouTubeThumbnail onNavigate={navigate} />;
  if (route === '#/tools/instagram-reel') return <InstagramReel onNavigate={navigate} />;
  if (route === '#/tools/image-to-pdf') return <ImageToPdf onNavigate={navigate} />;
  if (route === '#/tools/pdf-to-image') return <PdfToImage onNavigate={navigate} />;
  if (route === '#/tools/qr-code-generator') return <QrCodeGenerator onNavigate={navigate} />;
  if (route === '#/tools/url-shortener') return <UrlShortener onNavigate={navigate} />;
  if (route === '#/tools/text-to-speech') return <TextToSpeech onNavigate={navigate} />;
  if (route === '#/tools/speech-to-text') return <SpeechToText onNavigate={navigate} />;
  if (route === '#/tools/image-resizer') return <ImageResizer onNavigate={navigate} />;
  if (route === '#/tools/background-remover') return <BackgroundRemover onNavigate={navigate} />;
  if (route === '#/tools/json-formatter') return <JsonFormatter onNavigate={navigate} />;
  if (route === '#/tools/base64-encoder') return <Base64Encoder onNavigate={navigate} />;

  // Blog listing
  if (route === '#/blog') {
    return <BlogPage onNavigate={navigate} />;
  }

  // Blog detail — match #/blog/any-slug
  if (route.startsWith('#/blog/')) {
    const slug = route.replace('#/blog/', '');
    return <BlogDetailPage slug={slug} onNavigate={navigate} allPosts={blogPosts} />;
  }

  // About
  if (route === '#/about') {
    return <AboutPage onNavigate={navigate} />;
  }

  // Privacy Policy
  if (route === '#/privacy-policy') {
    return <PrivacyPolicy />;
  }

  // Terms of Service
  if (route === '#/terms-of-service') {
    return <TermsOfService />;
  }

  // Disclaimer
  if (route === '#/disclaimer') {
    return <DisclaimerPage />;
  }

  // Contact
  if (route === '#/contact') {
    return <ContactPage />;
  }

  // Pricing
  if (route === '#/pricing') {
    return <PricingPage onNavigate={navigate} />;
  }

  // 404
  return (
    <main className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-8xl font-black gradient-text mb-4">404</h1>
        <p className="text-xl text-[#AAAAAA] mb-2 font-light">Page not found</p>
        <p className="text-sm text-[#555555] mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <button
          onClick={() => navigate('#/')}
          className="cta-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-sm"
        >
          Go Home
        </button>
      </div>
    </main>
  );
}

export default function Home() {
  const { hash, navigate } = useHashRouter();

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header currentHash={hash} onNavigate={navigate} />
      <div className="flex-1">
        <Router hash={hash} navigate={navigate} />
      </div>
      <Footer onNavigate={navigate} />
    </div>
  );
}
