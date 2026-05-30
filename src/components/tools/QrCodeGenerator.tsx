'use client';

import { useState, useCallback } from 'react';
import { QrCode, Download, Wifi, Mail, Phone, Link, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'What can I use QR codes for?',
    answer:
      'QR codes are incredibly versatile! You can encode URLs to direct people to websites, share Wi-Fi credentials for easy network access, embed email addresses with pre-filled subjects, store phone numbers for quick dialing, or encode any plain text. They\'re perfect for business cards, marketing materials, product packaging, restaurant menus, and event tickets.',
  },
  {
    question: 'Can I customize the appearance of my QR code?',
    answer:
      'Yes! This tool lets you choose custom foreground and background colors, and adjust the size of the output image. However, keep in mind that high contrast between foreground and background is essential for reliable scanning. We strongly recommend using dark colors on light backgrounds for the best scanning results.',
  },
  {
    question: 'Will my custom-colored QR code still scan properly?',
    answer:
      'As long as there is sufficient contrast between the foreground and background colors, your QR code will scan reliably. Avoid using similar colors (like dark blue on black) or very light foregrounds on dark backgrounds, as some scanners may struggle. The safest option is always black on white, but dark colors on light backgrounds work well too.',
  },
  {
    question: 'How much data can a QR code store?',
    answer:
      'QR codes can store up to 4,296 alphanumeric characters or 2,953 bytes of binary data. However, the more data you encode, the denser the QR code becomes, which can make it harder to scan from a distance. For URLs, we recommend using shortened URLs when possible. WiFi QR codes and simple contact info typically work very well.',
  },
  {
    question: 'What size should I choose for my QR code?',
    answer:
      'The size depends on your use case. 128px is great for digital displays and small prints. 256px works well for standard printed materials like business cards and flyers. 512px is ideal for large-format printing such as posters and banners, where the QR code needs to be scanned from a distance. You can always scale the PNG up or down after downloading.',
  },
];

const relatedTools = [
  {
    name: 'URL Shortener',
    hash: '#/tools/url-shortener',
    description: 'Shorten long URLs for easy sharing.',
  },
  {
    name: 'Base64 Encoder',
    hash: '#/tools/base64-encoder',
    description: 'Encode and decode Base64 strings.',
  },
  {
    name: 'Password Generator',
    hash: '#/tools/password-generator',
    description: 'Create strong, secure passwords easily.',
  },
];

type QrType = 'url' | 'text' | 'wifi' | 'email' | 'phone';

interface QrCodeGeneratorProps {
  onNavigate: (hash: string) => void;
}

export default function QrCodeGenerator({ onNavigate }: QrCodeGeneratorProps) {
  const [qrType, setQrType] = useState<QrType>('url');
  const [text, setText] = useState('');
  const [ssid, setSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const getQrContent = useCallback((): string => {
    switch (qrType) {
      case 'url':
        return text.trim();
      case 'text':
        return text.trim();
      case 'wifi':
        return `WIFI:T:${wifiEncryption};S:${ssid};P:${wifiPassword};;`;
      case 'email':
        const subject = emailSubject ? `?subject=${encodeURIComponent(emailSubject)}` : '';
        return `mailto:${emailAddress.trim()}${subject}`;
      case 'phone':
        return `tel:${phoneNumber.trim()}`;
      default:
        return text.trim();
    }
  }, [qrType, text, ssid, wifiPassword, wifiEncryption, emailAddress, emailSubject, phoneNumber]);

  const isGenerateDisabled = useCallback((): boolean => {
    switch (qrType) {
      case 'url':
      case 'text':
        return !text.trim();
      case 'wifi':
        return !ssid.trim();
      case 'email':
        return !emailAddress.trim();
      case 'phone':
        return !phoneNumber.trim();
      default:
        return true;
    }
  }, [qrType, text, ssid, emailAddress, phoneNumber]);

  const generateQr = useCallback(async () => {
    const content = getQrContent();
    if (!content) {
      toast.error('Please fill in the required fields');
      return;
    }

    setIsGenerating(true);
    try {
      const dataUrl = await QRCode.toDataURL(content, {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: 'M',
      });
      setQrDataUrl(dataUrl);
      toast.success('QR code generated!');
    } catch (error) {
      console.error('QR generation error:', error);
      toast.error('Failed to generate QR code. Content may be too long.');
    } finally {
      setIsGenerating(false);
    }
  }, [getQrContent, size, fgColor, bgColor]);

  const downloadQr = useCallback(() => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qrcode_${size}px.png`;
    link.click();
    toast.success('QR code downloaded!');
  }, [qrDataUrl, size]);

  const qrTypeOptions: { value: QrType; label: string; icon: React.ReactNode }[] = [
    { value: 'url', label: 'URL', icon: <Link className="h-4 w-4" /> },
    { value: 'text', label: 'Text', icon: <Type className="h-4 w-4" /> },
    { value: 'wifi', label: 'WiFi', icon: <Wifi className="h-4 w-4" /> },
    { value: 'email', label: 'Email', icon: <Mail className="h-4 w-4" /> },
    { value: 'phone', label: 'Phone', icon: <Phone className="h-4 w-4" /> },
  ];

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Generate custom QR codes instantly for URLs, text, Wi-Fi credentials, and more. Download high-quality QR code images in PNG format. Create scannable QR codes for business cards, marketing materials, or personal use — all processed locally in your browser."
      icon={QrCode}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {/* QR Type Selector */}
        <div>
          <Label className="text-sm font-medium text-white mb-3 block">
            QR Code Type
          </Label>
          <div className="grid grid-cols-5 gap-2">
            {qrTypeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setQrType(opt.value);
                  setQrDataUrl('');
                }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-300 ${
                  qrType === opt.value
                    ? 'bg-[#8A2BE2]/10 border-[#8A2BE2]/30 text-[#8A2BE2]'
                    : 'bg-black/20 border-[#1a1a1a] text-[#888888] hover:border-[#8A2BE2]/20 hover:text-white'
                }`}
              >
                {opt.icon}
                <span className="text-xs font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Input Fields */}
        {(qrType === 'url' || qrType === 'text') && (
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              {qrType === 'url' ? 'Enter URL' : 'Enter Text'}
            </Label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={qrType === 'url' ? 'https://example.com' : 'Enter text to encode...'}
              className="w-full bg-black/40 border border-[#222222] rounded-xl p-3 text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:outline-none transition-colors"
            />
          </div>
        )}

        {qrType === 'wifi' && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-white mb-2 block">
                Network Name (SSID)
              </Label>
              <input
                type="text"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                placeholder="MyWiFiNetwork"
                className="w-full bg-black/40 border border-[#222222] rounded-xl p-3 text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-white mb-2 block">
                Password
              </Label>
              <input
                type="text"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder="WiFi password"
                className="w-full bg-black/40 border border-[#222222] rounded-xl p-3 text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-white mb-2 block">
                Encryption
              </Label>
              <Select value={wifiEncryption} onValueChange={setWifiEncryption}>
                <SelectTrigger className="w-full bg-black/40 border border-[#222222] text-white">
                  <SelectValue placeholder="Select encryption" />
                </SelectTrigger>
                <SelectContent className="bg-[#111111] border-[#222222]">
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">None (Open)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {qrType === 'email' && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-white mb-2 block">
                Email Address
              </Label>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="hello@example.com"
                className="w-full bg-black/40 border border-[#222222] rounded-xl p-3 text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-white mb-2 block">
                Subject (optional)
              </Label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject line"
                className="w-full bg-black/40 border border-[#222222] rounded-xl p-3 text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {qrType === 'phone' && (
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              Phone Number
            </Label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full bg-black/40 border border-[#222222] rounded-xl p-3 text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:outline-none transition-colors"
            />
          </div>
        )}

        {/* Size Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-white">
              QR Code Size
            </Label>
            <span className="text-sm font-mono text-[#8A2BE2] font-bold">
              {size}px
            </span>
          </div>
          <Slider
            value={[size]}
            min={128}
            max={1024}
            step={64}
            onValueChange={(value) => setSize(value[0])}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[#555555]">128px</span>
            <span className="text-[10px] text-[#555555]">512px</span>
            <span className="text-[10px] text-[#555555]">1024px</span>
          </div>
        </div>

        {/* Color Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              Foreground Color
            </Label>
            <div className="flex items-center gap-3 bg-black/40 border border-[#222222] rounded-xl p-3">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="h-8 w-8 rounded-lg border-0 cursor-pointer bg-transparent"
              />
              <span className="text-sm text-white font-mono">{fgColor}</span>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              Background Color
            </Label>
            <div className="flex items-center gap-3 bg-black/40 border border-[#222222] rounded-xl p-3">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-8 w-8 rounded-lg border-0 cursor-pointer bg-transparent"
              />
              <span className="text-sm text-white font-mono">{bgColor}</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateQr}
          disabled={isGenerateDisabled() || isGenerating}
          className="w-full h-12 text-base font-semibold cta-primary"
          size="lg"
        >
          {isGenerating ? 'Generating...' : 'Generate QR Code'}
        </Button>

        {/* QR Code Preview */}
        {qrDataUrl && (
          <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-black/30 border border-[#1a1a1a]">
            <div className="rounded-xl overflow-hidden bg-white p-3">
              <img
                src={qrDataUrl}
                alt="Generated QR Code"
                className="max-w-full"
                style={{ width: `${Math.min(size, 300)}px` }}
              />
            </div>
            <Button
              onClick={downloadQr}
              className="cta-primary"
              size="sm"
            >
              <Download className="h-4 w-4 mr-1" />
              Download PNG
            </Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
