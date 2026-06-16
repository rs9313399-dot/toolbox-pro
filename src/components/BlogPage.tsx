'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  BookOpen,
  Calendar,
  ArrowRight,
  Tag,
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AdPlaceholder from './AdPlaceholder';

/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  content: string;
  author: string;
}

/* ────────────────────────────────────────────
   Blog Data — 12 high-quality articles
   ──────────────────────────────────────────── */

const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'best-free-online-tools-2026',
    title: 'Best Free Online Tools in 2026',
    excerpt:
      'Discover the top free online tools that can boost your productivity and make your life easier in 2026.',
    date: '2026-05-15',
    readTime: '6 min',
    category: 'Guides',
    image: '/blog/best-free-online-tools-2026.png',
    author: 'ToolBox Pro Team',
    content: `The landscape of free online tools continues to evolve rapidly. In 2026, we have access to incredibly powerful browser-based tools that rival desktop applications.

## Top Picks for 2026

**1. Password Generators** - With cyber threats on the rise, using a strong password generator is more important than ever. Modern generators use crypto.getRandomValues() for maximum security, creating truly random combinations that are virtually impossible to crack through brute force methods.

**2. Image Compression Tools** - Browser-based image compressors have gotten remarkably good, often achieving 60-70% file size reduction with minimal quality loss using the Canvas API. These tools process everything locally, meaning your images never leave your device.

**3. Text Analysis Tools** - Word counters and text analyzers now offer real-time statistics including reading time, complexity scores, and SEO recommendations. Writers and content creators rely on these tools daily to optimize their content.

**4. YouTube Thumbnail Downloaders** - These tools make it easy to grab high-resolution thumbnails for design reference or content creation. Simply paste a URL and download in multiple resolutions.

**5. QR Code Generators** - Modern QR code tools support URLs, WiFi credentials, email addresses, phone numbers, and plain text. They offer customization options like color changes and different output sizes.

The best part? All of these tools run entirely in your browser, meaning your data stays private and secure. No servers, no signups, no downloads required.

As we move forward, expect to see more AI-powered features integrated into these tools, making them even more powerful and intuitive.`,
  },
  {
    id: 2,
    slug: 'compress-images-without-losing-quality',
    title: 'How to Compress Images Without Losing Quality',
    excerpt:
      'Learn the best techniques for image compression that maintain visual quality while dramatically reducing file sizes.',
    date: '2026-04-28',
    readTime: '8 min',
    category: 'Tutorials',
    image: '/blog/compress-images-without-losing-quality.png',
    author: 'Sarah Mitchell',
    content: `Image compression is essential for web performance, but doing it right means balancing file size with visual quality. Here's how to do it effectively.

## Understanding Compression Types

**Lossy Compression** reduces file size by permanently eliminating certain data, especially redundant information. JPEG is the most common lossy format, and when configured properly, the quality loss is barely noticeable to the human eye.

**Lossless Compression** reduces file size without losing any data. PNG uses lossless compression, but file sizes are typically larger. WebP supports both lossy and lossless modes, making it the most versatile modern format.

## Best Practices

1. **Choose the right format**: Use JPEG for photographs and WebP for web graphics. WebP offers both lossy and lossless compression with smaller file sizes than JPEG and PNG.

2. **Adjust quality wisely**: A quality setting of 75-85% for JPEG typically produces excellent results with significantly reduced file sizes. Going below 60% usually results in visible artifacts.

3. **Resize before compressing**: Don't upload a 4000px image when 1200px will do. Resize first, then compress for maximum savings.

4. **Use progressive JPEG**: Progressive JPEGs load in layers, giving users a low-quality preview quickly. This improves perceived performance significantly.

## Browser-Based Compression

Modern browser tools use the HTML5 Canvas API to compress images client-side. This means:
- Your images never leave your device
- Processing is instant
- No server upload required
- Complete privacy guaranteed

Try our Image Compressor tool to see these techniques in action!`,
  },
  {
    id: 3,
    slug: 'ultimate-guide-to-strong-passwords',
    title: 'The Ultimate Guide to Strong Passwords',
    excerpt:
      'Protect your accounts with these password security tips and learn why password strength matters more than ever.',
    date: '2026-04-10',
    readTime: '7 min',
    category: 'Security',
    image: '/blog/ultimate-guide-to-strong-passwords.png',
    author: 'David Chen',
    content: `In an era of increasing cyber threats, password security is your first line of defense. Here's everything you need to know about creating and maintaining strong passwords.

## Why Password Strength Matters

A 6-character password with only lowercase letters can be cracked in under 10 minutes. A 16-character password with mixed character types would take billions of years to crack through brute force. The math is simple: longer and more complex passwords are exponentially harder to crack.

## Characteristics of a Strong Password

- **Length**: At least 12 characters, preferably 16 or more
- **Complexity**: Mix of uppercase, lowercase, numbers, and symbols
- **Uniqueness**: Different for every single account you own
- **Randomness**: Not based on personal information or dictionary words

## Common Mistakes

1. **Reusing passwords** - If one account is breached, all accounts with the same password are compromised. This is the single biggest security mistake people make.

2. **Using personal information** - Birthdays, pet names, and addresses are easy to guess or find on social media.

3. **Short passwords** - Even complex short passwords can be cracked quickly with modern hardware.

4. **Sequential patterns** - "123456", "qwerty", "abcdef" are in every cracking dictionary and will be tried first.

## The Solution: Password Managers + Generators

Use a password generator (like our free tool) to create unique, random passwords for each account. Store them in a reputable password manager so you only need to remember one master password.

Start generating secure passwords today with our Password Generator tool!`,
  },
  {
    id: 4,
    slug: 'youtube-thumbnail-best-practices',
    title: 'YouTube Thumbnail Best Practices for Content Creators',
    excerpt:
      'Create eye-catching thumbnails that drive clicks and grow your channel with these proven design strategies.',
    date: '2026-03-22',
    readTime: '9 min',
    category: 'Content Creation',
    image: '/blog/youtube-thumbnail-best-practices.png',
    author: 'Alex Rivera',
    content: `Your YouTube thumbnail is often the first impression potential viewers have of your content. Here's how to make it count.

## Why Thumbnails Matter

Studies show that 90% of the best-performing YouTube videos use custom thumbnails. A compelling thumbnail can increase click-through rates by 30-50%, making it one of the most important factors in video success.

## Design Best Practices

1. **Use high-contrast colors**: Bright, contrasting colors stand out in YouTube's interface. Complementary color pairs work well.

2. **Include expressive faces**: Close-up faces with strong emotions (surprise, excitement) attract more clicks than neutral expressions.

3. **Keep text minimal**: 3-5 words maximum. Text should be large enough to read on mobile screens where most viewers browse.

4. **Maintain consistency**: Use a consistent style across your thumbnails to build brand recognition and trust.

5. **Use the right dimensions**: 1280x720 pixels is the recommended resolution. Always use a 16:9 aspect ratio.

## Technical Requirements

- Minimum resolution: 640x360 pixels
- Recommended resolution: 1280x720 pixels
- File size: Under 2MB
- Formats: JPG, GIF, BMP, or PNG

## Tools for Creating Thumbnails

Use our YouTube Thumbnail Downloader to study what works for successful channels in your niche. Download their thumbnails for design inspiration and reverse-engineer their strategies.

Remember: the best thumbnail is one that accurately represents your content while being impossible to scroll past.`,
  },
  {
    id: 5,
    slug: 'word-count-matters-writing-for-web',
    title: 'Word Count Matters: How to Write for the Web',
    excerpt:
      'Understanding the ideal word count for different content types and why it matters for SEO and engagement.',
    date: '2026-03-05',
    readTime: '5 min',
    category: 'Writing',
    image: '/blog/word-count-matters-writing-for-web.png',
    author: 'Emily Brooks',
    content: `Word count isn't just a number—it's a strategic consideration that affects SEO, reader engagement, and content effectiveness.

## Ideal Word Counts by Content Type

- **Blog posts**: 1,500-2,500 words for comprehensive guides
- **Product pages**: 300-500 words for descriptions
- **Social media posts**: 40-80 characters for maximum engagement
- **Email newsletters**: 200-500 words
- **Landing pages**: 500-1,000 words
- **White papers**: 3,000-5,000 words

## The SEO Connection

Long-form content (1,500+ words) tends to rank higher in search results. However, quality always trumps quantity. Google's algorithms reward content that:
- Thoroughly answers the user's question
- Provides unique value not found elsewhere
- Is well-structured and easy to read
- Includes relevant keywords naturally

## Reading Time Matters

Average reading speed is about 200-250 words per minute. Always consider how long your content will take to read. Online readers have shorter attention spans, so:
- Use headers to break up text
- Include bullet points and lists
- Keep paragraphs short (3-4 sentences)
- Add images and visual elements

Use our Word Counter tool to track your word count and estimate reading time in real-time!`,
  },
  {
    id: 6,
    slug: 'essential-browser-tools-everyone-should-know',
    title: '10 Essential Browser Tools Everyone Should Know',
    excerpt:
      'These free browser-based tools can save you hours of work and boost your productivity without installing anything.',
    date: '2026-02-18',
    readTime: '6 min',
    category: 'Productivity',
    image: '/blog/essential-browser-tools-everyone-should-know.png',
    author: 'ToolBox Pro Team',
    content: `You don't need to install expensive software to be productive. These free browser-based tools can handle most everyday tasks.

## The Top 10

**1. Password Generators** - Create unbreakable passwords in seconds without installing anything. Modern generators use cryptographic randomness for maximum security.

**2. Word Counters** - Essential for writers, students, and content creators who need to track word counts and reading time.

**3. Image Compressors** - Reduce image file sizes for faster website loading and easier sharing across platforms.

**4. QR Code Generators** - Create QR codes for URLs, text, WiFi, email, and phone numbers instantly.

**5. JSON Formatters** - Clean up and validate JSON data instantly. Essential for developers and API testers.

**6. Base64 Encoders/Decoders** - Convert data between formats for web development, API testing, and embedded content.

**7. Image Resizers** - Resize images to exact dimensions for social media, web, and print without losing quality.

**8. Background Removers** - Remove image backgrounds instantly for profile pictures and design projects.

**9. PDF Converters** - Convert between images and PDF documents seamlessly in your browser.

**10. Text to Speech** - Convert written text to natural-sounding speech for accessibility and content consumption.

## Why Browser-Based Tools Win

- **No installation required** - Works on any device with a browser
- **Always up to date** - No software updates to manage
- **Privacy focused** - Many process data locally, never sending it to servers
- **Cross-platform** - Works on Windows, Mac, Linux, and mobile

All of these tools and more are available for free right here on ToolBox Pro!`,
  },
  {
    id: 7,
    slug: 'qr-codes-business-marketing-guide',
    title: 'QR Codes for Business: A Complete Marketing Guide',
    excerpt:
      'Learn how businesses are using QR codes to drive engagement, streamline payments, and connect with customers.',
    date: '2026-02-02',
    readTime: '8 min',
    category: 'Guides',
    image: '/blog/qr-codes-business-marketing-guide.png',
    author: 'Michael Torres',
    content: `QR codes have evolved from a novelty to an essential business tool. Here's how to leverage them effectively in your marketing strategy.

## The QR Code Renaissance

Since 2020, QR code usage has skyrocketed by over 300%. The pandemic normalized scanning codes for menus, payments, and information, and consumers now expect to see them everywhere.

## Business Use Cases

**Restaurant Menus** - Replace physical menus with QR codes on tables. Customers scan to view the full menu on their phones, reducing printing costs and enabling instant updates.

**Product Packaging** - Add QR codes to packaging that link to product instructions, warranty registration, or promotional content. This creates an interactive experience beyond the physical product.

**Business Cards** - QR codes on business cards can store your full contact information (vCard), website, or portfolio link. One scan saves all your details to their phone.

**Event Tickets** - Digital tickets with QR codes enable contactless entry, reduce fraud, and provide real-time attendance tracking.

## Best Practices for QR Code Marketing

1. **Always test before printing** - Scan your QR code with multiple devices and apps to ensure it works reliably.

2. **Provide context** - Tell people what they'll get when they scan. "Scan for 20% off" is more compelling than just a code.

3. **Use a short URL** - Shorter URLs create simpler QR codes that scan faster and more reliably.

4. **Choose the right size** - QR codes should be at least 2cm x 2cm for close-range scanning and proportionally larger for distance scanning.

5. **Ensure contrast** - Dark foreground on light background works best. Avoid low-contrast color combinations.

Create professional QR codes for your business instantly with our QR Code Generator tool!`,
  },
  {
    id: 8,
    slug: 'image-formats-explained-jpeg-png-webp',
    title: 'Image Formats Explained: JPEG vs PNG vs WebP',
    excerpt:
      'Understanding the differences between image formats and when to use each one for optimal quality and performance.',
    date: '2026-01-20',
    readTime: '7 min',
    category: 'Tutorials',
    image: '/blog/image-formats-explained-jpeg-png-webp.png',
    author: 'Sarah Mitchell',
    content: `Choosing the right image format can make a huge difference in quality and performance. Here's a comprehensive guide to the three most popular formats.

## JPEG (Joint Photographic Experts Group)

JPEG is the most widely used image format on the web. It uses lossy compression, which means some image data is permanently discarded to achieve smaller file sizes.

**Best for:** Photographs, complex images with many colors, images where small quality loss is acceptable.

**Pros:** Small file sizes, universal browser support, ideal for photos.
**Cons:** Lossy compression, no transparency support, artifacts at high compression.

## PNG (Portable Network Graphics)

PNG uses lossless compression, preserving all image data. It supports transparency through an alpha channel.

**Best for:** Graphics with text, logos, images requiring transparency, screenshots.

**Pros:** Lossless quality, transparency support, sharp edges.
**Cons:** Larger file sizes than JPEG, not ideal for photographs.

## WebP (Web Picture format)

Developed by Google, WebP supports both lossy and lossless compression plus transparency. It typically produces smaller files than both JPEG and PNG.

**Best for:** Web images where performance matters, modern websites.

**Pros:** Smaller than JPEG/PNG, supports transparency, supports animation.
**Cons:** Not supported in older browsers (IE, older Safari), less editing software support.

## Quick Decision Guide

- **Photograph?** Use JPEG or WebP
- **Need transparency?** Use PNG or WebP
- **Maximum performance?** Use WebP
- **Maximum compatibility?** Use JPEG
- **Graphics with text?** Use PNG

Convert between formats and optimize your images using our Image Compressor and Image Resizer tools!`,
  },
  {
    id: 9,
    slug: 'text-to-speech-accessibility-guide',
    title: 'Text to Speech: Making Content Accessible for Everyone',
    excerpt:
      'How TTS technology is transforming content accessibility and why every website should consider audio alternatives.',
    date: '2026-01-08',
    readTime: '6 min',
    category: 'Accessibility',
    image: '/blog/text-to-speech-accessibility-guide.png',
    author: 'Priya Sharma',
    content: `Text-to-Speech (TTS) technology has come a long way from robotic-sounding voices. Modern TTS engines produce natural-sounding speech that makes content accessible to millions of people worldwide.

## Who Benefits from TTS?

**Visually Impaired Users** - People with low vision or blindness rely on TTS to consume written content. Screen readers use TTS to narrate everything on screen.

**People with Dyslexia** - Reading can be challenging and exhausting for people with dyslexia. TTS allows them to listen to content instead, improving comprehension and reducing fatigue.

**Language Learners** - Hearing text pronounced correctly helps language learners improve their pronunciation and listening skills simultaneously.

**Multitaskers** - Listen to articles, emails, or documents while commuting, exercising, or doing household tasks.

**Older Adults** - Age-related vision decline makes reading small text difficult. TTS provides an alternative that doesn't require straining.

## Browser-Based TTS

The Web Speech API enables TTS directly in the browser without any plugins or downloads. Key advantages include:
- No server processing required
- Instant playback with no latency
- Multiple voices and languages
- Adjustable speed, pitch, and volume
- Complete privacy — text never leaves your device

## Best Practices for TTS-Friendly Content

1. **Use clear, simple language** - Short sentences and common words are easier for TTS engines to pronounce correctly.

2. **Avoid excessive jargon** - Technical terms may be mispronounced by TTS engines.

3. **Structure with headings** - Proper heading hierarchy helps TTS users navigate content.

4. **Provide text alternatives** - Always include text transcripts for audio content.

Try our Text to Speech tool to convert any text to natural-sounding speech right in your browser!`,
  },
  {
    id: 10,
    slug: 'json-formatter-developer-essentials',
    title: 'JSON Formatter: A Developer\'s Essential Tool',
    excerpt:
      'Why every developer needs a reliable JSON formatter and how it can save hours of debugging time.',
    date: '2025-12-15',
    readTime: '5 min',
    category: 'Developer',
    image: '/blog/json-formatter-developer-essentials.png',
    author: 'Raj Patel',
    content: `JSON (JavaScript Object Notation) is the backbone of modern web development. Whether you're working with APIs, configuration files, or data storage, you deal with JSON daily. A good formatter is essential.

## Why Formatting Matters

Raw JSON from APIs often arrives minified — a single line of compressed text with no spacing. This is efficient for transmission but impossible for humans to read or debug. A formatter transforms this into properly indented, readable structure.

## Common JSON Issues Developers Face

**Trailing Commas** - JSON doesn't allow trailing commas, but JavaScript does. This is the most common source of JSON parsing errors when copying data between contexts.

**Single Quotes** - JSON requires double quotes for strings and keys. Single quotes are a common mistake for developers coming from JavaScript.

**Unquoted Keys** - Object keys must be quoted in JSON, unlike JavaScript object literals.

**Comments** - JSON doesn't support comments. Use JSONC or JSON5 if you need comments in your data files.

**Character Encoding** - Special characters must be properly escaped. Unicode characters in strings can cause parsing errors if not handled correctly.

## Features Every JSON Formatter Should Have

1. **Syntax Validation** - Instantly detect and highlight errors with line numbers
2. **Pretty Print** - Format with consistent 2-space indentation
3. **Minification** - Compress JSON for production use
4. **Tree View** - Navigate complex structures visually
5. **Error Recovery** - Attempt to fix common mistakes automatically
6. **Copy to Clipboard** - One-click copy of formatted output

Our JSON Formatter tool provides all of these features and more, running entirely in your browser for maximum speed and privacy.`,
  },
  {
    id: 11,
    slug: 'base64-encoding-complete-guide',
    title: 'Base64 Encoding: The Complete Guide for Developers',
    excerpt:
      'Everything you need to know about Base64 encoding, from basic concepts to advanced use cases in web development.',
    date: '2025-11-28',
    readTime: '7 min',
    category: 'Developer',
    image: '/blog/base64-encoding-complete-guide.png',
    author: 'Raj Patel',
    content: `Base64 encoding is one of those fundamental concepts that every web developer encounters but few truly understand. Let's demystify it.

## What is Base64?

Base64 is a binary-to-text encoding scheme that converts binary data into ASCII characters. It uses a set of 64 characters (A-Z, a-z, 0-9, +, /) plus = for padding. Every 3 bytes of binary data become 4 ASCII characters, resulting in approximately 33% size increase.

## Common Use Cases

**Data URIs** - Embed small images directly in HTML or CSS using Base64-encoded data URIs. This eliminates HTTP requests for small assets.

**API Authentication** - HTTP Basic Auth sends credentials as Base64-encoded strings in the Authorization header. Note: this is encoding, not encryption — always use HTTPS.

**Email Attachments** - MIME encoding uses Base64 to attach binary files (images, documents) to email messages, which only support text transmission.

**JWT Tokens** - JSON Web Tokens use Base64URL encoding for their header and payload sections, making them URL-safe.

**Configuration Data** - Embed configuration or metadata in URLs, cookies, or custom headers using Base64 encoding.

## Important Security Considerations

Base64 is **NOT encryption**. It provides zero security — anyone can decode Base64 data. Never use Base64 to protect sensitive information. It's purely an encoding format for data representation.

## Performance Impact

The 33% size overhead of Base64 means:
- Larger network payloads when used in APIs
- Increased memory usage for encoded data
- Slower parsing compared to native binary formats

Use Base64 selectively — only when you need text-safe representation of binary data.

Try our Base64 Encoder/Decoder tool for instant encoding and decoding of text and files!`,
  },
  {
    id: 12,
    slug: 'remove-background-product-photos',
    title: 'How to Remove Backgrounds from Product Photos',
    excerpt:
      'Step-by-step guide to creating clean, professional product images with transparent backgrounds for e-commerce.',
    date: '2025-11-10',
    readTime: '6 min',
    category: 'Tutorials',
    image: '/blog/remove-background-product-photos.png',
    author: 'Alex Rivera',
    content: `Professional product photos with clean backgrounds are essential for e-commerce success. Here's how to achieve them without expensive software.

## Why Clean Backgrounds Matter

Product images with cluttered or inconsistent backgrounds look unprofessional and can reduce customer trust. Studies show that products displayed on clean, white or transparent backgrounds have higher conversion rates across major e-commerce platforms.

## Shooting Tips for Easy Background Removal

1. **Use a solid background** - White, black, or green screen backgrounds are easiest to remove. Avoid patterned or textured surfaces.

2. **Ensure good lighting** - Even, diffused lighting eliminates harsh shadows that complicate background removal. Use a lightbox for small products.

3. **Maintain contrast** - The product should clearly stand out from the background. Dark products on light backgrounds (or vice versa) work best.

4. **Keep the background uniform** - Wrinkles, creases, and shadows make removal harder. Stretch fabric backgrounds tight and iron out wrinkles.

## Browser-Based Background Removal

Modern browser tools can remove backgrounds without uploading to a server:
- Color-based thresholding works great for solid backgrounds
- Adjustable tolerance controls how aggressively the background is removed
- Instant preview with before/after comparison
- Transparent PNG output ready for use

## After Removal: Next Steps

Once you've removed the background, you can:
- Place the product on a white background for Amazon/eBay
- Add a custom gradient or color for social media
- Create composite images with multiple products
- Use in marketing materials and advertisements

Try our Background Remover tool to create professional product images instantly in your browser!`,
  },
];

/* ────────────────────────────────────────────
   Category Colors
   ──────────────────────────────────────────── */

const categoryColors: Record<string, string> = {
  Guides: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Tutorials: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Security: 'bg-green-500/10 text-green-400 border-green-500/20',
  'Content Creation': 'bg-red-500/10 text-red-400 border-red-500/20',
  Writing: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Productivity: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Accessibility: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  Developer: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const categories = ['All', 'Guides', 'Tutorials', 'Security', 'Content Creation', 'Writing', 'Productivity', 'Accessibility', 'Developer'];

const POSTS_PER_PAGE = 6;

/* ────────────────────────────────────────────
   Component
   ──────────────────────────────────────────── */

interface BlogPageProps {
  onNavigate: (hash: string) => void;
}

export default function BlogPage({ onNavigate }: BlogPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  /* ── Filtering & Searching ── */
  const filteredPosts = useMemo(() => {
    let posts = blogPosts;

    // Category filter
    if (selectedCategory !== 'All') {
      posts = posts.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return posts;
  }, [searchQuery, selectedCategory]);

  /* ── Pagination ── */
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handleCategoryChange = useCallback((cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handlePostClick = useCallback(
    (slug: string) => {
      onNavigate(`/blog/${slug}`);
    },
    [onNavigate]
  );

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* ── Header ── */}
        <div className="text-center mb-14">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 mb-5">
            <BookOpen className="h-7 w-7 text-[#8A2BE2]" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
            Blog & <span className="gradient-text">Guides</span>
          </h1>
          <p className="text-[#AAAAAA] max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            Tips, tutorials, and insights to help you make the most of free online tools and boost your productivity.
          </p>
        </div>

        {/* ── Search Bar ── */}
        <div className="relative max-w-xl mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full bg-[#111111] border border-[#222222] rounded-xl pl-11 pr-10 py-3.5 text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:outline-none transition-colors text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/5 text-[#555555] hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ── Category Filters ── */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          <SlidersHorizontal className="h-4 w-4 text-[#555555] shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-[#8A2BE2]/10 text-[#8A2BE2] border border-[#8A2BE2]/20'
                  : 'bg-[#111111] text-[#888888] border border-[#1a1a1a] hover:border-[#8A2BE2]/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Results Count ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#555555]">
            {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* ── Blog Grid ── */}
        {paginatedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => handlePostClick(post.slug)}
                className="tool-card cursor-pointer group"
              >
                {/* Featured Image Placeholder */}
                <div
                  className="h-44 relative overflow-hidden bg-[#111111]"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                        categoryColors[post.category] || 'bg-[#8A2BE2]/10 text-[#8A2BE2] border-[#8A2BE2]/20'
                      }`}
                    >
                      <Tag className="h-2.5 w-2.5 mr-1" />
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3 text-xs text-[#555555]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-white mb-2 group-hover:text-[#8A2BE2] transition-colors duration-300 leading-snug line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-[#888888] leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8A2BE2] group-hover:gap-2.5 transition-all duration-300">
                    Read More
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="h-12 w-12 text-[#333333] mb-4" />
            <p className="text-lg font-semibold text-white mb-2">No articles found</p>
            <p className="text-sm text-[#888888] mb-6">
              Try a different search term or category
            </p>
            <button
              onClick={() => {
                handleSearch('');
                handleCategoryChange('All');
              }}
              className="cta-primary px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#111111] border border-[#1a1a1a] text-[#AAAAAA] hover:border-[#8A2BE2]/30 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 w-10 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-[#8A2BE2]/10 text-[#8A2BE2] border border-[#8A2BE2]/20'
                      : 'bg-[#111111] text-[#888888] border border-[#1a1a1a] hover:border-[#8A2BE2]/30 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#111111] border border-[#1a1a1a] text-[#AAAAAA] hover:border-[#8A2BE2]/30 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ── Ad Banner ── */}
        <div className="my-14">
          <AdPlaceholder size="banner" />
        </div>
      </div>
    </main>
  );
}
