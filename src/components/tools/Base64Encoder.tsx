'use client';

import { useState, useCallback, useRef } from 'react';
import { Binary, Copy, Trash2, Check, ArrowRightLeft, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'What is Base64 encoding used for?',
    answer:
      'Base64 encoding converts binary data into ASCII text, making it safe to transmit over text-based protocols like email, HTML, CSS, and JSON. Common uses include embedding images in HTML/CSS (data URIs), encoding API credentials, and attaching binary files in email (MIME).',
  },
  {
    question: 'Are there file size limits for encoding?',
    answer:
      'Since all processing happens in your browser, the practical limit depends on your device memory. For text encoding, you can process several megabytes easily. For file encoding, images up to 5-10MB work well, but larger files may cause browser performance issues. Base64 output is approximately 33% larger than the input.',
  },
  {
    question: 'Is Base64 encoding the same as encryption?',
    answer:
      'No! Base64 is an encoding scheme, not encryption. It does not provide any security — anyone can decode Base64 data. It simply converts data to a different representation. Never use Base64 as a substitute for encryption when handling sensitive data.',
  },
  {
    question: 'What is a Base64 data URI?',
    answer:
      'A data URI embeds file data directly into a URL using the format: data:[mediaType][;base64],data. For example, data:image/png;base64,iVBOR... allows you to embed an image directly in HTML or CSS without a separate file. This is useful for small icons and single-file web applications.',
  },
  {
    question: 'Why does the encoded output seem larger?',
    answer:
      'Base64 encoding increases data size by approximately 33%. This is because every 3 bytes of binary data are represented as 4 ASCII characters. This overhead is normal and expected. The trade-off is compatibility with text-based systems that cannot handle raw binary data.',
  },
];

const relatedTools = [
  {
    name: 'JSON Formatter',
    hash: '/tools/json-formatter',
    description: 'Format, validate, and beautify JSON data.',
  },
  {
    name: 'URL Shortener',
    hash: '/tools/url-shortener',
    description: 'Shorten and manage long URLs.',
  },
  {
    name: 'QR Code Generator',
    hash: '/tools/qr-code-generator',
    description: 'Generate QR codes from URLs or text.',
  },
];

function encodeBase64(text: string): string {
  return btoa(unescape(encodeURIComponent(text)));
}

function decodeBase64(encoded: string): string {
  return decodeURIComponent(escape(atob(encoded)));
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

interface Base64EncoderProps {
  onNavigate: (hash: string) => void;
}

export default function Base64Encoder({ onNavigate }: Base64EncoderProps) {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [textInput, setTextInput] = useState('');
  const [textOutput, setTextOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [fileOutput, setFileOutput] = useState('');
  const [fileMimeType, setFileMimeType] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextProcess = useCallback(() => {
    if (!textInput.trim()) {
      toast.error('Please enter some text to process');
      return;
    }

    try {
      if (mode === 'encode') {
        const result = encodeBase64(textInput);
        setTextOutput(result);
        toast.success('Text encoded successfully!');
      } else {
        const result = decodeBase64(textInput.trim());
        setTextOutput(result);
        toast.success('Text decoded successfully!');
      }
    } catch {
      if (mode === 'encode') {
        toast.error('Failed to encode text. Please check your input.');
      } else {
        toast.error('Failed to decode. Please ensure the input is valid Base64.');
      }
      setTextOutput('');
    }
  }, [textInput, mode]);

  const handleSwap = useCallback(() => {
    if (!textOutput) return;
    setTextInput(textOutput);
    setTextOutput('');
    setMode((prev) => (prev === 'encode' ? 'decode' : 'encode'));
  }, [textOutput]);

  const handleCopy = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleClear = () => {
    setTextInput('');
    setTextOutput('');
  };

  const handleFileUpload = useCallback((file: File) => {
    setFileName(file.name);
    setFileSize(file.size);
    setFileMimeType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileOutput(result);
      toast.success('File encoded to Base64!');
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    reader.readAsDataURL(file);
  }, []);

  const inputSize = new Blob([textInput]).size;
  const outputSize = new Blob([textOutput]).size;

  const isImage = fileMimeType.startsWith('image/');

  return (
    <ToolLayout
      title="Base64 Encoder / Decoder"
      description="Encode text to Base64 or decode Base64 back to text instantly. Also supports encoding and decoding files like images and documents. An essential tool for developers working with APIs, data URIs, and embedded content — all processing happens locally in your browser."
      icon={Binary}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
      seoContent={`
        <h2>Base64 Encoder / Decoder — Encode and Decode Base64 Text and Files</h2>
        <p>Base64 encoding is a fundamental technique in web development that converts binary data into ASCII text, making it safe to transmit over text-based protocols like HTTP, email, and JSON. Our free online Base64 Encoder and Decoder supports both text encoding/decoding and file encoding with data URI generation. Whether you are embedding images in CSS, encoding API credentials, or converting files for inline transmission, this tool handles it all — completely in your browser with no server processing.</p>
        <h3>What is Base64 Encoding?</h3>
        <p>Base64 is a binary-to-text encoding scheme that represents binary data using a set of 64 ASCII characters: A–Z, a–z, 0–9, +, and /. Every 3 bytes of binary data are converted into 4 Base64 characters, which means the encoded output is approximately 33% larger than the input. This overhead is the trade-off for gaining compatibility with systems that can only handle text data. Base64 is defined in RFC 4648 and is one of the most widely used encoding schemes on the internet.</p>
        <h3>Web Development Use Cases</h3>
        <p>Base64 encoding has numerous practical applications in web development. Data URIs embed small images directly in HTML or CSS files using Base64, eliminating the need for separate HTTP requests — this is particularly useful for icons, logos, and small UI elements. API authentication often uses Base64 to encode credentials in HTTP Basic Auth headers. Email attachments are encoded in Base64 as part of the MIME standard. JSON Web Tokens (JWTs) use Base64URL encoding for their header, payload, and signature sections. Source maps and configuration files frequently contain Base64-encoded data. Understanding and working with Base64 is an essential skill for any web developer.</p>
        <h3>Key Features</h3>
        <ul>
          <li>Text mode — encode plain text to Base64 or decode Base64 back to text</li>
          <li>File mode — encode any file (images, documents, etc.) to a Base64 data URI</li>
          <li>Swap button to instantly reverse encode/decode direction</li>
          <li>Image preview for encoded image files</li>
          <li>File size display for both input and output</li>
          <li>One-click copy to clipboard for encoded/decoded results</li>
          <li>Full Unicode support for international text encoding</li>
          <li>Complete client-side processing — your data never leaves your device</li>
        </ul>
        <h3>Important Security Note</h3>
        <ul>
          <li>Base64 is encoding, NOT encryption — it provides zero security or data protection</li>
          <li>Anyone can decode Base64 data, so never use it to "protect" sensitive information</li>
          <li>For securing data, use proper encryption algorithms like AES-256 instead</li>
          <li>Base64 is safe for transmitting data through text-only channels, but does not hide the content</li>
        </ul>
      `}
    >
      <div className="space-y-6">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="bg-black/40 border border-[#222222] w-full">
            <TabsTrigger value="text" className="flex-1 data-[state=active]:bg-[#8A2BE2]/10 data-[state=active]:text-[#8A2BE2]">
              Text Mode
            </TabsTrigger>
            <TabsTrigger value="file" className="flex-1 data-[state=active]:bg-[#8A2BE2]/10 data-[state=active]:text-[#8A2BE2]">
              File Mode
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-6 space-y-6">
            {/* Mode Switch */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-black/30 border border-[#1a1a1a]">
              <button
                onClick={() => { setMode('encode'); setTextOutput(''); }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  mode === 'encode'
                    ? 'bg-[#8A2BE2]/10 text-[#8A2BE2] border border-[#8A2BE2]/20'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => { setMode('decode'); setTextOutput(''); }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  mode === 'decode'
                    ? 'bg-[#8A2BE2]/10 text-[#8A2BE2] border border-[#8A2BE2]/20'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                Decode
              </button>
            </div>

            {/* Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-white">
                  {mode === 'encode' ? 'Plain Text' : 'Base64 String'}
                </Label>
                {inputSize > 0 && (
                  <span className="text-xs text-[#888888]">
                    {inputSize > 1024 ? `${(inputSize / 1024).toFixed(1)} KB` : `${inputSize} B`}
                  </span>
                )}
              </div>
              <textarea
                value={textInput}
                onChange={(e) => { setTextInput(e.target.value); setTextOutput(''); }}
                placeholder={
                  mode === 'encode'
                    ? 'Enter text to encode to Base64...'
                    : 'Enter Base64 string to decode...'
                }
                rows={6}
                spellCheck={false}
                className="w-full bg-black/40 border border-[#222222] rounded-xl p-3 text-white font-mono text-sm placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:outline-none transition-colors resize-y"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleTextProcess} className="cta-primary" size="sm">
                {mode === 'encode' ? 'Encode' : 'Decode'}
              </Button>
              <Button
                onClick={handleSwap}
                variant="outline"
                size="sm"
                className="border-[#222222] text-white hover:border-[#8A2BE2]/50 hover:bg-[#8A2BE2]/10"
                disabled={!textOutput}
              >
                <ArrowRightLeft className="h-4 w-4 mr-1" />
                Swap
              </Button>
              <Button
                onClick={() => handleCopy(textOutput)}
                variant="outline"
                size="sm"
                className="border-[#222222] text-white hover:border-[#8A2BE2]/50 hover:bg-[#8A2BE2]/10"
                disabled={!textOutput}
              >
                {copied ? <Check className="h-4 w-4 mr-1 text-green-400" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? 'Copied!' : 'Copy Output'}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                size="sm"
                className="border-[#222222] text-white hover:border-red-400/50 hover:bg-red-400/10"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>

            {/* Output */}
            {textOutput && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-white">
                    {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
                  </Label>
                  {outputSize > 0 && (
                    <span className="text-xs text-[#888888]">
                      {outputSize > 1024 ? `${(outputSize / 1024).toFixed(1)} KB` : `${outputSize} B`}
                    </span>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto rounded-xl bg-black/40 border border-[#222222] p-4">
                  <pre className="text-sm font-mono text-white whitespace-pre-wrap break-all">
                    {textOutput}
                  </pre>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="file" className="mt-6 space-y-6">
            {/* File Upload Area */}
            <div
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFileUpload(file);
              }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 cursor-pointer transition-all duration-300 ${
                isDragging
                  ? 'border-[#8A2BE2] bg-[#8A2BE2]/5'
                  : 'border-[#222222] hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5'
              }`}
            >
              <Upload className={`h-10 w-10 mb-3 ${isDragging ? 'text-[#8A2BE2]' : 'text-[#555555]'}`} />
              <p className="text-sm font-semibold text-white mb-1">Drop a file here or click to browse</p>
              <p className="text-xs text-[#888888]">Any file type — will be encoded to Base64 data URI</p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </div>

            {/* File Result */}
            {fileOutput && (
              <>
                {/* File Info */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-[#1a1a1a]">
                  <div className="flex items-center gap-3">
                    {isImage ? (
                      <ImageIcon className="h-5 w-5 text-[#8A2BE2]" />
                    ) : (
                      <Binary className="h-5 w-5 text-[#8A2BE2]" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{fileName}</p>
                      <p className="text-xs text-[#888888]">
                        {fileMimeType || 'Unknown type'} · {formatFileSize(fileSize)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFileOutput('');
                      setFileName('');
                      setFileSize(0);
                      setFileMimeType('');
                    }}
                    className="text-[#888888] hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Image Preview */}
                {isImage && (
                  <div className="rounded-xl bg-black/30 border border-[#1a1a1a] p-4">
                    <Label className="text-sm font-medium text-white mb-3 block">Preview</Label>
                    <div
                      className="rounded-lg overflow-hidden flex items-center justify-center max-h-[200px]"
                      style={{
                        backgroundImage:
                          'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)',
                        backgroundSize: '16px 16px',
                        backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
                        backgroundColor: '#222',
                      }}
                    >
                      <img
                        src={fileOutput}
                        alt="Decoded preview"
                        className="max-w-full max-h-[200px] object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Base64 Output */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-white">Base64 Data URI</Label>
                    <span className="text-xs text-[#888888]">
                      {formatFileSize(new Blob([fileOutput]).size)}
                    </span>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto rounded-xl bg-black/40 border border-[#222222] p-4">
                    <pre className="text-xs font-mono text-white whitespace-pre-wrap break-all">
                      {fileOutput}
                    </pre>
                  </div>
                </div>

                {/* Copy Button */}
                <Button
                  onClick={() => handleCopy(fileOutput)}
                  className="w-full cta-primary h-12"
                  size="lg"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Data URI
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
}
