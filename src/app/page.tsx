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
import EmojiKeyboard from '@/components/tools/EmojiKeyboard';
import ColorPicker from '@/components/tools/ColorPicker';
import LoveCalculator from '@/components/tools/LoveCalculator';
import EmiCalculator from '@/components/tools/EmiCalculator';
import AgeCalculator from '@/components/tools/AgeCalculator';
import ImageToText from '@/components/tools/ImageToText';
import VideoToAudio from '@/components/tools/VideoToAudio';
import HindiTypingTool from '@/components/tools/HindiTypingTool';
import PlagiarismChecker from '@/components/tools/PlagiarismChecker';
import WebsiteSpeedTest from '@/components/tools/WebsiteSpeedTest';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import AboutPage from '@/components/AboutPage';
import TermsOfService from '@/components/TermsOfService';
import DisclaimerPage from '@/components/DisclaimerPage';
import { LanguageProvider } from '@/context/LanguageContext';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

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
  {
    id: 13,
    slug: 'ocr-image-to-text-guide',
    title: 'Image to Text: How OCR Technology Works',
    excerpt: 'Learn how Optical Character Recognition converts images into editable text and the best practices for accurate results.',
    date: '2026-05-28',
    readTime: '7 min',
    category: 'Tutorials',
    image: '/blog/ocr-image-to-text-guide.png',
    content: `Optical Character Recognition (OCR) is a transformative technology that converts images of text into machine-readable, editable text. Whether you are digitizing documents, extracting data from receipts, or converting scanned books, OCR makes it possible.

## How OCR Works

OCR technology operates in several stages. First, the image is preprocessed to improve quality through binarization, deskewing, and noise reduction. Then, the text regions are identified and segmented into lines, words, and individual characters. Pattern recognition algorithms compare each character against known templates, and the results are assembled into the final text output.

## Tips for Better OCR Results

1. **Use high-resolution images** - At least 300 DPI for scanned documents. Higher resolution means more pixel data for the OCR engine to analyze accurately.

2. **Ensure good contrast** - Black text on white backgrounds works best. Avoid images with colored or textured backgrounds.

3. **Straighten skewed images** - Rotated or tilted text significantly reduces accuracy. Use deskewing tools before OCR.

4. **Clean the image** - Remove noise, stains, and artifacts before processing. Simple image preprocessing can dramatically improve results.

5. **Choose the right language** - Select the correct language for your document. OCR engines are optimized for specific character sets.

## Browser-Based OCR

Modern tools like Tesseract.js bring OCR directly to your browser. Your images never leave your device, and processing happens instantly without any server uploads.

Try our Image to Text (OCR) tool to extract text from your images right in your browser!`,
    author: 'Raj Patel',
  },
  {
    id: 14,
    slug: 'extract-audio-from-video-guide',
    title: 'How to Extract Audio from Video Files',
    excerpt: 'Step-by-step guide to extracting audio tracks from video files using browser-based tools without installing software.',
    date: '2026-05-22',
    readTime: '6 min',
    category: 'Tutorials',
    image: '/blog/extract-audio-from-video-guide.png',
    content: `Have you ever wanted to extract just the audio from a video file? Whether it is a podcast recording, a music video, or a lecture, extracting audio from video is a common need. Here is how to do it easily.

## Why Extract Audio from Video?

There are many reasons to extract audio from video files. You might want to create a podcast from video content, extract background music, save a lecture for offline listening, or reduce file size by keeping only the audio track.

## Methods for Audio Extraction

**Desktop Software** - Programs like Audacity, VLC Media Player, and FFmpeg can extract audio. However, they require installation and technical knowledge.

**Online Tools** - Browser-based converters let you upload a video and download the audio. But many of these upload your files to external servers.

**Browser-Based Processing** - Modern web tools use the Web Audio API to process video files directly in your browser. Your files never leave your device, ensuring complete privacy.

## Tips for Best Audio Quality

1. **Start with high-quality video** - The audio quality cannot exceed the source. Use the highest quality video available.

2. **Choose the right format** - WAV provides lossless audio quality but larger files. WebM with Opus codec offers excellent quality with smaller file sizes.

3. **Check the sample rate** - Higher sample rates capture more detail. 44.1kHz or 48kHz are standard for most purposes.

4. **Trim unnecessary parts** - Remove silence or unwanted sections to keep only what you need.

Try our Video to Audio Converter tool to extract audio from your videos right in the browser!`,
    author: 'Sarah Mitchell',
  },
  {
    id: 15,
    slug: 'hindi-typing-guide-hinglish',
    title: 'Hindi Typing Made Easy: Complete Hinglish Guide',
    excerpt: 'Master Hindi typing using English letters with our comprehensive Hinglish to Devanagari transliteration guide.',
    date: '2026-05-18',
    readTime: '8 min',
    category: 'Guides',
    image: '/blog/hindi-typing-guide-hinglish.png',
    content: `Typing in Hindi used to require learning the complex Devanagari keyboard layout. Not anymore. With Hinglish (Romanized Hindi), you can type Hindi using English letters, and the text is automatically converted to Devanagari script.

## What is Hinglish?

Hinglish is Hindi written using the English alphabet. Instead of learning where each Devanagari character is on the keyboard, you simply type Hindi words the way they sound. For example: "namaste" becomes "नमस्ते", "kaise" becomes "कैसे", and "dhanyavad" becomes "धन्यवाद".

This approach is incredibly popular among Hindi speakers who are more comfortable with the QWERTY keyboard layout. It is estimated that over 70% of Hindi content online is typed using Hinglish.

## How Phonetic Transliteration Works

Phonetic transliteration maps English letter combinations to their Hindi equivalents. The system recognizes patterns like:

- **Vowels**: a=अ, aa=आ, i=इ, ee=ई, u=उ, oo=ऊ
- **Consonants**: ka=क, kha=ख, ga=ग, cha=च, ja=ज, ta=ट, da=ड
- **Combined sounds**: ksha=क्ष, tra=त्र, jna=ज्ञ

## Common Hindi Words in Hinglish

Here are some everyday words and their Hinglish equivalents:
- namaste (नमस्ते) - Hello/Greetings
- dhanyavad (धन्यवाद) - Thank you
- kaise (कैसे) - How
- aap (आप) - You (formal)
- ghar (घर) - Home
- pyaar (प्यार) - Love

## Tips for Accurate Hindi Typing

1. **Spell phonetically** - Type words as they sound, not as they are written in English.
2. **Use double letters for long vowels** - "aa" for आ, "ee" for ई, "oo" for ऊ.
3. **Practice common words** - Start with greetings and everyday phrases.
4. **Edit the output** - The converted text is editable, so you can make corrections.

Try our Hindi Typing Tool to start typing in Hindi instantly!`,
    author: 'Priya Sharma',
  },
  {
    id: 16,
    slug: 'plagiarism-checker-guide',
    title: 'Plagiarism Checker: How to Verify Original Content',
    excerpt: 'Learn how plagiarism detection works and best practices for ensuring your content is original and authentic.',
    date: '2026-05-12',
    readTime: '7 min',
    category: 'Writing',
    image: '/blog/plagiarism-checker-guide.png',
    content: `Content originality is crucial in academics, publishing, and digital marketing. Plagiarism, whether intentional or accidental, can damage reputations, result in academic penalties, and harm SEO rankings. Here is how to check and ensure your content is original.

## What is Plagiarism?

Plagiarism is presenting someone else is work, ideas, or words as your own without proper attribution. It can range from directly copying text to paraphrasing without citation. Even unintentional plagiarism, where you forget to cite a source or inadvertently use similar phrasing, is taken seriously.

## Types of Plagiarism

1. **Direct Plagiarism** - Copying text word-for-word without attribution.
2. **Self-Plagiarism** - Reusing your own previously published work without disclosure.
3. **Patchwriting** - Replacing words in copied text while keeping the original structure.
4. **Uncredited Paraphrasing** - Restating someone else is ideas without citation.
5. **Mosaic Plagiarism** - Mixing copied phrases with your own words without citation.

## How Plagiarism Detection Works

Modern plagiarism checkers use text similarity algorithms to compare documents:

- **N-gram analysis** - Breaks text into small word sequences and compares them
- **Jaccard similarity** - Calculates the overlap between two sets of text features
- **Fingerprinting** - Creates unique hashes of text segments for quick comparison

## Best Practices for Original Content

1. **Always cite your sources** - Even when paraphrasing, give credit to the original author.
2. **Use quotation marks** - For direct quotes, always use quotation marks and citations.
3. **Write in your own voice** - Develop a unique writing style that is distinctly yours.
4. **Run checks before publishing** - Use plagiarism checkers as a final quality step.
5. **Keep track of references** - Maintain a bibliography during research to avoid missing citations.

Try our Plagiarism Checker tool to compare texts and detect similarities!`,
    author: 'Emily Brooks',
  },
  {
    id: 17,
    slug: 'website-speed-optimization-guide',
    title: 'Website Speed Optimization: The Complete Guide',
    excerpt: 'Learn why website speed matters and practical techniques to make your site load faster for better user experience.',
    date: '2026-05-08',
    readTime: '9 min',
    category: 'Developer',
    image: '/blog/website-speed-optimization-guide.png',
    content: `Website speed is one of the most critical factors for user experience, SEO, and business success. Google has confirmed that page speed is a ranking factor, and studies consistently show that slower sites lose visitors and revenue.

## Why Speed Matters

- **53% of mobile users** abandon sites that take longer than 3 seconds to load
- **Every 1-second delay** reduces conversions by 7%
- **Google ranks faster sites higher** in search results
- **Bounce rate increases 32%** when page load goes from 1 to 3 seconds

## Key Performance Metrics

**Time to First Byte (TTFB)** - Measures server response time. Target: under 200ms. This indicates how quickly your server responds to requests.

**First Contentful Paint (FCP)** - When the first content appears on screen. Target: under 1.8 seconds.

**Largest Contentful Paint (LCP)** - When the main content is visible. Target: under 2.5 seconds. This is a Core Web Vital.

**Cumulative Layout Shift (CLS)** - Measures visual stability. Target: under 0.1. Prevents annoying page jumps.

## Practical Optimization Techniques

1. **Optimize images** - Compress images, use WebP format, and implement lazy loading. Images are often the largest resources on a page.

2. **Use a CDN** - Content Delivery Networks serve content from servers closest to your users, reducing latency significantly.

3. **Minimize HTTP requests** - Combine CSS and JavaScript files, use CSS sprites, and reduce the number of third-party scripts.

4. **Enable browser caching** - Set proper cache headers so returning visitors load faster.

5. **Optimize server response** - Use efficient hosting, optimize database queries, and implement server-side caching.

6. **Compress resources** - Enable Gzip or Brotli compression for text-based resources.

7. **Defer non-critical JavaScript** - Load analytics and non-essential scripts after the main content.

Use our Website Speed Test tool to measure your site performance and identify areas for improvement!`,
    author: 'David Chen',
  },
  {
    id: 18,
    slug: 'emi-calculator-loan-planning',
    title: 'EMI Calculator: Smart Loan Planning Made Easy',
    excerpt: 'Understand how EMI calculations work and use an EMI calculator to plan your loans effectively before committing.',
    date: '2026-05-05',
    readTime: '7 min',
    category: 'Guides',
    image: '/blog/emi-calculator-loan-planning.png',
    content: `Taking a loan is a major financial decision. Whether it is a home loan, car loan, or personal loan, understanding your EMI (Equated Monthly Installment) before you commit is essential for sound financial planning.

## What is EMI?

EMI is the fixed monthly payment you make to repay a loan. It consists of two components: principal repayment and interest payment. In the early months, a larger portion of your EMI goes toward interest, while in later months, more goes toward the principal.

## The EMI Formula

EMI = P x r x (1+r)^n / ((1+r)^n - 1)

Where P = Principal loan amount, r = Monthly interest rate, n = Number of monthly installments.

## How to Use an EMI Calculator

An EMI calculator lets you experiment with different loan amounts, interest rates, and tenures to find the best combination for your budget. Simply adjust the sliders or enter values, and the calculator instantly shows your monthly EMI, total interest, and total payment.

## Tips for Smart Loan Planning

1. **Keep EMI under 40% of income** - Financial advisors recommend that total EMIs should not exceed 40% of your monthly income.

2. **Shorter tenure saves money** - While longer tenures reduce monthly EMI, you pay significantly more total interest.

3. **Compare interest rates** - Even a 0.5% difference in interest rate can save lakhs over the loan tenure.

4. **Consider prepayment** - Making occasional prepayments reduces the principal and total interest.

5. **Check the amortization schedule** - Understanding how your payments are split between principal and interest helps with tax planning.

Use our EMI Calculator to plan your loan repayments and make informed financial decisions!`,
    author: 'Michael Torres',
  },
  {
    id: 19,
    slug: 'emoji-keyboard-complete-guide',
    title: 'Emoji Keyboard: Express Yourself Better Online',
    excerpt: 'Discover how emojis enhance digital communication and learn to use them effectively across platforms and contexts.',
    date: '2026-04-30',
    readTime: '5 min',
    category: 'Guides',
    image: '/blog/emoji-keyboard-complete-guide.png',
    content: `Emojis have become an essential part of digital communication. From casual texts to professional emails, these small pictograms add emotion, context, and personality to our messages. Here is everything you need to know about using emojis effectively.

## The Rise of Emojis

Since their introduction in the late 1990s, emojis have evolved from simple smiley faces to a rich visual language with over 3,600 characters. They are now so prevalent that the Oxford Dictionary named an emoji (Face with Tears of Joy) as Word of the Year in 2015.

## Why Emojis Matter

- **Emotional context** - Text alone can be ambiguous. Emojis clarify tone and intent.
- **Engagement** - Social media posts with emojis get 25% more engagement.
- **Cross-language communication** - Emojis transcend language barriers.
- **Brand personality** - Companies use emojis to appear approachable and human.

## Emoji Etiquette

1. **Professional communication** - Use sparingly in business contexts. A single smiley can soften a message without being unprofessional.

2. **Social media** - Be generous but relevant. Emojis should enhance your message, not replace it.

3. **Know your audience** - Different age groups and cultures interpret emojis differently.

4. **Avoid emoji overload** - More than 3-4 emojis per message can be distracting.

5. **Stay updated** - New emojis are added regularly. Keep up with the latest additions.

Try our Emoji Keyboard tool to browse and copy emojis for any occasion!`,
    author: 'ToolBox Pro Team',
  },
  // ─── HINDI BLOG POSTS ───
  {
    id: 20,
    slug: 'best-free-online-tools-2026-hindi',
    title: '2026 में सबसे अच्छे मुफ्त ऑनलाइन टूल्स',
    excerpt: 'उन शीर्ष मुफ्त ऑनलाइन टूल्स की खोज करें जो आपकी प्रोडक्टिविटी बढ़ा सकते हैं और आपके जीवन को 2026 में आसान बना सकते हैं।',
    date: '2026-05-29',
    readTime: '6 min',
    category: 'गाइड',
    image: '/blog/best-free-online-tools-2026.png',
    content: `मुफ्त ऑनलाइन टूल्स का परिदृश्य तेज़ी से विकसित हो रहा है। 2026 में, हमारे पास अविश्वसनीय रूप से शक्तिशाली ब्राउज़र-आधारित टूल्स तक पहुंच है जो डेस्कटॉप एप्लिकेशन के बराबर हैं।

## 2026 के लिए शीर्ष चुनाव

**1. पासवर्ड जेनरेटर** - साइबर खतरों के बढ़ने के साथ, एक मजबूत पासवर्ड जेनरेटर का उपयोग करना पहले से कहीं अधिक महत्वपूर्ण है। आधुनिक जेनरेटर अधिकतम सुरक्षा के लिए crypto.getRandomValues() का उपयोग करते हैं।

**2. इमेज कम्प्रेशन टूल्स** - ब्राउज़र-आधारित इमेज कम्प्रेसर उल्लेखनीय रूप से अच्छे हो गए हैं, अक्सर न्यूनतम गुणवत्ता हानि के साथ 60-70% फ़ाइल आकार में कमी प्राप्त करते हैं।

**3. टेक्स्ट विश्लेषण टूल्स** - वर्ड काउंटर और टेक्स्ट एनालाइज़र अब पढ़ने के समय और SEO सिफारिशों सहित रीयल-टाइम आंकड़े प्रदान करते हैं।

**4. QR कोड जेनरेटर** - आधुनिक QR कोड टूल URL, WiFi क्रेडेंशियल, ईमेल और फोन नंबरों को अनुकूलन विकल्पों के साथ सपोर्ट करते हैं।

**5. JSON फॉर्मेटर** - API के साथ काम करने वाले डेवलपर्स के लिए आवश्यक, ये टूल तत्काल सत्यापन और फॉर्मेटिंग प्रदान करते हैं।

सबसे अच्छा हिस्सा? ये सभी टूल्स पूरी तरह से आपके ब्राउज़र में चलते हैं। कोई सर्वर नहीं, कोई साइनअप नहीं, कोई डाउनलोड आवश्यक नहीं।`,
    author: 'ToolBox Pro Team',
  },
  {
    id: 21,
    slug: 'hindi-typing-guide-hinglish-hindi',
    title: 'हिंदी टाइपिंग आसान बना दी: संपूर्ण हिंगलिश गाइड',
    excerpt: 'हमारे व्यापक हिंगलिश से देवनागरी लिप्यंतरण गाइड के साथ अंग्रेजी अक्षरों का उपयोग करके हिंदी टाइपिंग में महारत हासिल करें।',
    date: '2026-05-27',
    readTime: '8 min',
    category: 'गाइड',
    image: '/blog/hindi-typing-guide-hinglish.png',
    content: `हिंदी में टाइप करने के लिए पहले जटिल देवनागरी कीबोर्ड लेआउट सीखना पड़ता था। अब ऐसा नहीं है। हिंगलिश (रोमन लिपि हिंदी) के साथ, आप अंग्रेजी अक्षरों का उपयोग करके हिंदी टाइप कर सकते हैं, और टेक्स्ट स्वचालित रूप से देवनागरी लिपि में बदल जाता है।

## हिंगलिश क्या है?

हिंगलिश अंग्रेजी वर्णमाला का उपयोग करके लिखी गई हिंदी है। कीबोर्ड पर प्रत्येक देवनागरी अक्षर कहां है, यह सीखने के बजाय, आप बस हिंदी शब्दों को जैसे वे सुनाई देते हैं, वैसे ही टाइप करते हैं। उदाहरण के लिए: "namaste" बन जाता है "नमस्ते", "kaise" बन जाता है "कैसे", और "dhanyavad" बन जाता है "धन्यवाद"।

यह दृष्टिकोण उन हिंदी भाषियों में अविश्वसनीय रूप से लोकप्रिय है जो QWERTY कीबोर्ड लेआउट के साथ अधिक सहज हैं। अनुमान है कि ऑनलाइन 70% से अधिक हिंदी सामग्री हिंगलिश का उपयोग करके टाइप की जाती है।

## ध्वन्यात्मक लिप्यंतरण कैसे काम करता है

ध्वन्यात्मक लिप्यंतरण अंग्रेजी अक्षर संयोजनों को उनके हिंदी समकक्षों में मैप करता है। सिस्टम पैटर्न को पहचानता है जैसे:

- **स्वर**: a=अ, aa=आ, i=इ, ee=ई, u=उ, oo=ऊ
- **व्यंजन**: ka=क, kha=ख, ga=ग, cha=च, ja=ज, ta=ट, da=ड
- **संयुक्त ध्वनियाँ**: ksha=क्ष, tra=त्र, jna=ज्ञ

## सटीक हिंदी टाइपिंग के लिए टिप्स

1. **ध्वन्यात्मक रूप से स्पेल करें** - शब्दों को जैसे वे सुनाई देते हैं, वैसे टाइप करें।
2. **लंबे स्वरों के लिए दोहरे अक्षरों का उपयोग करें** - आ के लिए "aa", ई के लिए "ee", ऊ के लिए "oo"।
3. **सामान्य शब्दों का अभ्यास करें** - अभिवादन और रोजमर्रा के वाक्यांशों से शुरू करें।

हमारे हिंदी टाइपिंग टूल का उपयोग करके तुरंत हिंदी में टाइप करना शुरू करें!`,
    author: 'प्रिया शर्मा',
  },
  {
    id: 22,
    slug: 'emi-calculator-loan-planning-hindi',
    title: 'EMI कैलकुलेटर: स्मार्ट लोन प्लानिंग आसान बनी',
    excerpt: 'EMI गणनाएं कैसे काम करती हैं और प्रतिबद्ध होने से पहले अपने लोन की प्रभावी ढंग से योजना बनाने के लिए EMI कैलकुलेटर का उपयोग कैसे करें।',
    date: '2026-05-25',
    readTime: '7 min',
    category: 'गाइड',
    image: '/blog/emi-calculator-loan-planning.png',
    content: `लोन लेना एक प्रमुख वित्तीय निर्णय है। चाहे वह होम लोन हो, कार लोन हो, या पर्सनल लोन, प्रतिबद्ध होने से पहले अपनी EMI (समान मासिक किस्त) को समझना उचित वित्तीय योजना के लिए आवश्यक है।

## EMI क्या है?

EMI वह निश्चित मासिक भुगतान है जो आप लोन चुकाने के लिए करते हैं। इसमें दो घटक होते हैं: मूलधन चुकौती और ब्याज भुगतान। शुरुआती महीनों में, आपकी EMI का एक बड़ा हिस्सा ब्याज की ओर जाता है, जबकि बाद के महीनों में, अधिक मूलधन की ओर जाता है।

## EMI फॉर्मूला

EMI = P x r x (1+r)^n / ((1+r)^n - 1)

जहां P = मूल लोन राशि, r = मासिक ब्याज दर, n = मासिक किस्तों की संख्या।

## स्मार्ट लोन प्लानिंग के लिए टिप्स

1. **EMI को आय के 40% से नीचे रखें** - वित्तीय सलाहकारों की सिफारिश है कि कुल EMI आपकी मासिक आय के 40% से अधिक नहीं होनी चाहिए।

2. **छोटी अवधि पैसे बचाती है** - जबकि लंबी अवधि मासिक EMI कम करती है, आप काफी अधिक कुल ब्याज चुकाते हैं।

3. **ब्याज दरों की तुलना करें** - ब्याज दर में 0.5% का अंतर भी लोन अवधि में लाखों बचा सकता है।

4. **प्रीपेमेंट पर विचार करें** - समय-समय पर प्रीपेमेंट करने से मूलधन और कुल ब्याज कम होता है।

5. **परिशोधन अनुसूची जांचें** - यह समझना कि आपके भुगतान मूलधन और ब्याज के बीच कैसे विभाजित हैं, कर नियोजन में मदद करता है।

हमारे EMI कैलकुलेटर का उपयोग करके अपने लोन भुगतानों की योजना बनाएं!`,
    author: 'माइकल टोरेस',
  },
  {
    id: 23,
    slug: 'image-compress-karein-quality-hindi',
    title: 'गुणवत्ता खोए बिना इमेज कैसे कम्प्रेस करें',
    excerpt: 'इमेज कम्प्रेशन की सर्वोत्तम तकनीकें सीखें जो दृश्य गुणवत्ता बनाए रखते हुए फ़ाइल आकार में नाटकीय कमी करती हैं।',
    date: '2026-05-20',
    readTime: '8 min',
    category: 'ट्यूटोरियल',
    image: '/blog/compress-images-without-losing-quality.png',
    content: `इमेज कम्प्रेशन वेब परफॉर्मेंस के लिए आवश्यक है, लेकिन इसे सही ढंग से करने का मतलब है फ़ाइल आकार और दृश्य गुणवत्ता के बीच संतुलन बनाना।

## कम्प्रेशन प्रकारों को समझना

**लॉसी कम्प्रेशन** कुछ डेटा को स्थायी रूप से हटाकर फ़ाइल आकार कम करता है। JPEG सबसे आम लॉसी फॉर्मेट है।

**लॉसलेस कम्प्रेशन** बिना कोई डेटा खोए फ़ाइल आकार कम करता है। PNG लॉसलेस कम्प्रेशन का उपयोग करता है, लेकिन फ़ाइल आकार आमतौर पर बड़े होते हैं।

## सर्वोत्तम अभ्यास

1. **सही फॉर्मेट चुनें**: फोटो के लिए JPEG और वेब ग्राफिक्स के लिए WebP का उपयोग करें।

2. **गुणवत्ता समझदारी से समायोजित करें**: JPEG के लिए 75-85% गुणवत्ता सेटिंग आमतौर पर उत्कृष्ट परिणाम देती है।

3. **कम्प्रेस करने से पहले रीसाइज़ करें**: 4000px इमेज अपलोड न करें जब 1200px काम कर जाए।

## ब्राउज़र-आधारित कम्प्रेशन

आधुनिक ब्राउज़र टूल HTML5 Canvas API का उपयोग करके क्लाइंट-साइड पर इमेज कम्प्रेस करते हैं:
- आपकी इमेज कभी आपका डिवाइस नहीं छोड़ती
- प्रोसेसिंग तत्काल है
- कोई सर्वर अपलोड आवश्यक नहीं
- पूर्ण गोपनीयता

हमारे इमेज कम्प्रेसर टूल का उपयोग करके इन तकनीकों को काम में देखें!`,
    author: 'सारा मिशेल',
  },
  {
    id: 24,
    slug: 'strong-password-guide-hindi',
    title: 'मजबूत पासवर्ड के लिए अंतिम गाइड',
    excerpt: 'इन पासवर्ड सुरक्षा टिप्स से अपने अकाउंट की सुरक्षा करें और जानें कि पासवर्ड की मजबूती पहले से कहीं अधिक क्यों मायने रखती है।',
    date: '2026-05-10',
    readTime: '7 min',
    category: 'सुरक्षा',
    image: '/blog/ultimate-guide-to-strong-passwords.png',
    content: `साइबर खतरों के बढ़ने के युग में, पासवर्ड सुरक्षा आपकी पहली रक्षा रेखा है।

## पासवर्ड की मजबूती क्यों मायने रखती है

केवल छोटे अक्षरों वाला 6-अक्षर का पासवर्ड 10 मिनट से कम समय में क्रैक किया जा सकता है। मिश्रित अक्षर प्रकारों वाला 16-अक्षर का पासवर्ड क्रैक होने में अरबों साल लगेंगे।

## मजबूत पासवर्ड की विशेषताएं

- **लंबाई**: कम से कम 12 अक्षर, अधिमानतः 16+
- **जटिलता**: बड़े, छोटे अक्षरों, संख्याओं और प्रतीकों का मिश्रण
- **अद्वितीयता**: हर अकाउंट के लिए अलग
- **यादृच्छिकता**: व्यक्तिगत जानकारी या शब्दकोश शब्दों पर आधारित नहीं

## सामान्य गलतियाँ

1. **पासवर्ड का पुनः उपयोग** - यदि एक अकाउंट उल्लंघित होता है, तो समान पासवर्ड वाले सभी अकाउंट जोखिम में होते हैं।

2. **व्यक्तिगत जानकारी का उपयोग** - जन्मदिन, पालतू जानवरों के नाम और पते अनुमान लगाना आसान हैं।

3. **छोटे पासवर्ड** - जटिल छोटे पासवर्ड भी जल्दी क्रैक हो सकते हैं।

## समाधान: पासवर्ड मैनेजर + जेनरेटर

प्रत्येक अकाउंट के लिए अद्वितीय, यादृच्छिक पासवर्ड बनाने के लिए पासवर्ड जेनरेटर का उपयोग करें। उन्हें एक प्रतिष्ठित पासवर्ड मैनेजर में संग्रहीत करें।

हमारे पासवर्ड जेनरेटर टूल से आज ही सुरक्षित पासवर्ड जेनरेट करना शुरू करें!`,
    author: 'दवीद चेन',
  },
  {
    id: 25,
    slug: 'website-speed-optimization-hindi',
    title: 'वेबसाइट स्पीड ऑप्टिमाइज़ेशन: संपूर्ण गाइड',
    excerpt: 'जानें कि वेबसाइट स्पीड क्यों मायने रखती है और बेहतर यूज़र अनुभव के लिए अपनी साइट को तेज़ लोड होने वाली बनाने की व्यावहारिक तकनीकें।',
    date: '2026-05-06',
    readTime: '9 min',
    category: 'डेवलपर',
    image: '/blog/website-speed-optimization-guide.png',
    content: `वेबसाइट स्पीड यूज़र अनुभव, SEO और व्यावसायिक सफलता के लिए सबसे महत्वपूर्ण कारकों में से एक है। गूगल ने पुष्टि की है कि पेज स्पीड एक रैंकिंग कारक है, और अध्ययन लगातार दिखाते हैं कि धीमी साइटें विज़िटर और राजस्व खो देती हैं।

## स्पीड क्यों मायने रखती है

- **53% मोबाइल यूज़र्स** 3 सेकंड से अधिक समय लेने वाली साइटों को छोड़ देते हैं
- **हर 1-सेकंड की देरी** रूपांतरण में 7% की कमी करती है
- **गूगल तेज़ साइटों को उच्च रैंक** देता है खोज परिणामों में
- **बाउंस दर 32% बढ़ती है** जब पेज लोड 1 से 3 सेकंड हो जाता है

## प्रमुख प्रदर्शन मेट्रिक्स

**टाइम टू फर्स्ट बाइट (TTFB)** - सर्वर प्रतिक्रिया समय मापता है। लक्ष्य: 200ms से कम।

**फर्स्ट कंटेंटफुल पेंट (FCP)** - जब पहला कंटेंट स्क्रीन पर दिखाई देता है। लक्ष्य: 1.8 सेकंड से कम।

**लार्जेस्ट कंटेंटफुल पेंट (LCP)** - जब मुख्य कंटेंट दिखाई देता है। लक्ष्य: 2.5 सेकंड से कम।

## व्यावहारिक ऑप्टिमाइज़ेशन तकनीकें

1. **इमेज ऑप्टिमाइज़ करें** - इमेज कम्प्रेस करें, WebP फॉर्मेट का उपयोग करें, और लेज़ी लोडिंग लागू करें।

2. **CDN का उपयोग करें** - कंटेंट डिलीवरी नेटवर्क आपके यूज़र्स के सबसे करीबी सर्वर से कंटेंट प्रदान करते हैं।

3. **HTTP अनुरोध कम करें** - CSS और JavaScript फ़ाइलों को संयोजित करें।

4. **ब्राउज़र कैशिंग सक्षम करें** - उचित कैश हेडर सेट करें ताकि वापस आने वाले विज़िटर तेज़ी से लोड हों।

हमारे वेबसाइट स्पीड टेस्ट टूल का उपयोग करके अपनी साइट प्रदर्शन मापें!`,
    author: 'दवीद चेन',
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
  if (route === '#/tools/emoji-keyboard') return <EmojiKeyboard onNavigate={navigate} />;
  if (route === '#/tools/color-picker') return <ColorPicker onNavigate={navigate} />;
  if (route === '#/tools/love-calculator') return <LoveCalculator onNavigate={navigate} />;
  if (route === '#/tools/emi-calculator') return <EmiCalculator onNavigate={navigate} />;
  if (route === '#/tools/age-calculator') return <AgeCalculator onNavigate={navigate} />;
  if (route === '#/tools/image-to-text') return <ImageToText onNavigate={navigate} />;
  if (route === '#/tools/video-to-audio') return <VideoToAudio onNavigate={navigate} />;
  if (route === '#/tools/hindi-typing') return <HindiTypingTool onNavigate={navigate} />;
  if (route === '#/tools/plagiarism-checker') return <PlagiarismChecker onNavigate={navigate} />;
  if (route === '#/tools/website-speed-test') return <WebsiteSpeedTest onNavigate={navigate} />;

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
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-black">
        <Header currentHash={hash} onNavigate={navigate} />
        <div className="flex-1">
          <Router hash={hash} navigate={navigate} />
        </div>
        <Footer onNavigate={navigate} />
        <PWAInstallPrompt />
      </div>
    </LanguageProvider>
  );
}
