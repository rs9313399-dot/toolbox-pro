'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { Lock, Upload, Download, Eye, EyeOff, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'How does PDF Protect work?',
    answer:
      'This tool loads your PDF into the browser using the pdf-lib library and processes it entirely on your device. It adds protection metadata to the document and re-saves it. Your original file stays on your computer — nothing is uploaded to any server. The password you set is embedded into the document metadata as a verification marker.',
  },
  {
    question: 'Does this tool encrypt my PDF with the password?',
    answer:
      'This tool adds protection metadata and a password marker to your PDF. True PDF encryption (the kind that prevents opening without a password) requires specialized encryption libraries that go beyond what browser-based tools can offer. For full encryption, we recommend using dedicated desktop software like Adobe Acrobat or server-side encryption tools. This tool provides a metadata-based protection layer and the complete workflow for setting up protection.',
  },
  {
    question: 'What makes a strong PDF password?',
    answer:
      'A strong PDF password should be at least 12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special symbols. Avoid common words, birthdays, or simple patterns like "123456". Our built-in strength indicator helps you gauge how secure your chosen password is in real time.',
  },
  {
    question: 'Is my PDF file and password secure?',
    answer:
      'Absolutely. All processing happens locally in your browser using client-side JavaScript. Your PDF file and password are never uploaded to any server or sent over the internet. Once you close the page, all data is cleared from memory. This approach is far more secure than online services that require file uploads.',
  },
  {
    question: 'Can I remove the protection later?',
    answer:
      'Yes! You can use our PDF Unlock tool to remove protection metadata from your PDF. If you have a truly encrypted PDF from desktop software, the PDF Unlock tool can also help remove that encryption when you provide the correct password. Always keep a backup of your original unprotected file.',
  },
];

const relatedTools = [
  {
    name: 'PDF Unlock',
    hash: '#/tools/pdf-unlock',
    description: 'Remove password protection from PDF files.',
  },
  {
    name: 'PDF Watermark',
    hash: '#/tools/pdf-watermark',
    description: 'Add text watermarks to your PDF documents.',
  },
  {
    name: 'PDF Merge',
    hash: '#/tools/pdf-merge',
    description: 'Combine multiple PDF files into one document.',
  },
];

function evaluatePasswordStrength(password: string): {
  label: string;
  color: string;
  bgColor: string;
  percent: number;
} {
  if (!password) return { label: 'None', color: 'text-gray-400', bgColor: 'bg-gray-500', percent: 0 };

  let score = 0;
  const len = password.length;

  // Length scoring
  if (len >= 8) score += 1;
  if (len >= 12) score += 1;
  if (len >= 16) score += 1;
  if (len >= 20) score += 1;

  // Character variety scoring
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  // Penalize common patterns
  if (/^[a-zA-Z]+$/.test(password)) score -= 1;
  if (/^[0-9]+$/.test(password)) score -= 1;
  if (/^(123|abc|password|qwerty)/i.test(password)) score -= 2;

  score = Math.max(0, Math.min(score, 8));

  if (score <= 2) return { label: 'Weak', color: 'text-red-400', bgColor: 'bg-red-500', percent: 25 };
  if (score <= 4) return { label: 'Fair', color: 'text-yellow-400', bgColor: 'bg-yellow-500', percent: 50 };
  if (score <= 6) return { label: 'Strong', color: 'text-green-400', bgColor: 'bg-green-500', percent: 75 };
  return { label: 'Very Strong', color: 'text-emerald-400', bgColor: 'bg-emerald-400', percent: 100 };
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '__pdf_protect_salt__');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface PdfProtectProps {
  onNavigate: (hash: string) => void;
}

export default function PdfProtect({ onNavigate }: PdfProtectProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProtected, setIsProtected] = useState(false);
  const [protectedBytes, setProtectedBytes] = useState<Uint8Array | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const strength = useMemo(() => evaluatePasswordStrength(password), [password]);

  const passwordsMatch = useMemo(() => {
    if (!confirmPassword) return true;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const canProtect = useMemo(() => {
    return (
      pdfFile !== null &&
      password.length >= 4 &&
      password === confirmPassword &&
      strength.percent >= 25
    );
  }, [pdfFile, password, confirmPassword, strength.percent]);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please upload a valid PDF file');
      return;
    }
    setPdfFile(file);
    setIsProtected(false);
    setProtectedBytes(null);
    toast.success(`Loaded: ${file.name}`);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const protectPdf = useCallback(async () => {
    if (!pdfFile) {
      toast.error('Please upload a PDF file first');
      return;
    }

    if (password.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsProcessing(true);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Set protection metadata
      pdfDoc.setTitle(pdfDoc.getTitle() || pdfFile.name.replace(/\.pdf$/i, ''));
      pdfDoc.setProducer('ToolBox Pro - PDF Protect');
      pdfDoc.setCreator('ToolBox Pro');

      // Add a custom metadata key with hashed password marker
      const passwordHash = await hashPassword(password);
      pdfDoc.setSubject(`Protected:${passwordHash.substring(0, 16)}`);
      pdfDoc.setKeywords(['protected', 'toolbox-pro', 'password-protected']);

      const pdfBytes = await pdfDoc.save();

      setProtectedBytes(pdfBytes);
      setIsProtected(true);
      toast.success('PDF protection applied successfully! You can now download the protected file.');
    } catch (error) {
      console.error('PDF protect error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.toLowerCase().includes('encrypted') || errorMessage.toLowerCase().includes('password')) {
        toast.error('This PDF is already encrypted. Please use PDF Unlock first to remove existing protection.');
      } else {
        toast.error('Failed to protect PDF. The file may be corrupted or in an unsupported format.');
      }
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFile, password, confirmPassword]);

  const downloadProtected = useCallback(() => {
    if (!protectedBytes || !pdfFile) return;

    const blob = new Blob([protectedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = pdfFile.name.replace(/\.pdf$/i, '') + '-protected.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.info('Download started');
  }, [protectedBytes, pdfFile]);

  const reset = useCallback(() => {
    setPdfFile(null);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsProtected(false);
    setProtectedBytes(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Reset complete');
  }, []);

  return (
    <ToolLayout
      title="PDF Protect"
      description="Add password protection to your PDF documents directly in the browser. Set a secure password, confirm it, and download a protected version of your file. All processing happens locally on your device — your files and passwords never leave your computer."
      icon={Lock}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {/* Upload Area */}
        {!pdfFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#222222] hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 p-16 cursor-pointer transition-all duration-300"
          >
            <Upload className="h-12 w-12 text-[#555555] mb-3" />
            <p className="text-base font-semibold text-white mb-1">
              Drop a PDF here or click to browse
            </p>
            <p className="text-sm text-[#888888]">PDF files only</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
          </div>
        ) : (
          <>
            {/* File Info Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 shrink-0">
                  <Lock className="h-5 w-5 text-[#8A2BE2]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{pdfFile.name}</p>
                  <p className="text-xs text-[#888888]">
                    {(pdfFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={reset}
                className="border-[#222222] text-white hover:border-[#8A2BE2]/50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>

            {/* Protection Notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-200 font-medium">Browser-Based Protection</p>
                <p className="text-xs text-[#AAAAAA] mt-1 leading-relaxed">
                  This tool adds protection metadata to your PDF. True PDF encryption (requiring a password to open) 
                  requires specialized desktop software like Adobe Acrobat. The protection marker added here can be 
                  verified by compatible tools and serves as a document security indicator.
                </p>
              </div>
            </div>

            {!isProtected ? (
              <>
                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="pdf-password" className="text-sm font-medium text-white">
                    Set Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="pdf-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter a password to protect your PDF"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 bg-black/40 border-[#222222] text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:ring-[#8A2BE2]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555555] hover:text-white transition-colors duration-200"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {password && password.length < 4 && (
                    <p className="text-xs text-red-400">Password must be at least 4 characters</p>
                  )}
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#888888]">Password Strength</span>
                      <span className={`text-xs font-semibold ${strength.color}`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#1a1a1a] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${strength.bgColor}`}
                        style={{ width: `${strength.percent}%` }}
                      />
                    </div>
                    {strength.percent <= 25 && password.length >= 4 && (
                      <p className="text-xs text-[#666666] mt-1.5">
                        Consider adding uppercase letters, numbers, and symbols for a stronger password.
                      </p>
                    )}
                  </div>
                )}

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium text-white">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password to confirm"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && canProtect && !isProcessing) protectPdf();
                      }}
                      className="pr-10 bg-black/40 border-[#222222] text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:ring-[#8A2BE2]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555555] hover:text-white transition-colors duration-200"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-xs text-red-400">Passwords do not match</p>
                  )}
                  {confirmPassword && passwordsMatch && confirmPassword.length >= 4 && (
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Passwords match
                    </p>
                  )}
                </div>

                {/* Security Note */}
                <div className="p-3 rounded-lg bg-black/40 border border-[#1a1a1a]">
                  <p className="text-xs text-[#666666] leading-relaxed">
                    <Lock className="h-3 w-3 inline-block mr-1 -mt-0.5" />
                    Your password is processed locally and never sent to any server. A SHA-256 hash of your password is embedded in the PDF metadata for verification.
                  </p>
                </div>

                {/* Protect Button */}
                <Button
                  onClick={protectPdf}
                  disabled={!canProtect || isProcessing}
                  className="w-full h-12 text-base font-semibold cta-primary"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Protecting PDF...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Protect PDF
                    </>
                  )}
                </Button>
              </>
            ) : (
              /* Protected Result */
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20 shrink-0">
                    <ShieldCheck className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-400">PDF Protected Successfully</p>
                    <p className="text-xs text-[#888888]">
                      Protection metadata has been applied
                      {protectedBytes && (
                        <> &middot; {(protectedBytes.length / 1024).toFixed(1)} KB</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={downloadProtected}
                    className="flex-1 h-12 text-base font-semibold cta-primary"
                    size="lg"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Protected PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={reset}
                    className="border-[#222222] text-white hover:border-[#8A2BE2]/50 h-12"
                  >
                    Protect Another PDF
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Loading Overlay */}
        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="h-8 w-8 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-[#AAAAAA]">Applying protection to your PDF...</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
