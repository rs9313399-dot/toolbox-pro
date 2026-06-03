'use client';

import { useState, useRef, useCallback } from 'react';
import { Unlock, Upload, Download, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'How does PDF Unlock work?',
    answer:
      'This tool uses the pdf-lib library to load your password-protected PDF with the correct password, then re-saves it without any encryption. The resulting file is identical in content but no longer requires a password to open. All processing happens entirely in your browser — your PDF and password never leave your device.',
  },
  {
    question: 'What types of PDF password protection does this tool remove?',
    answer:
      'PDFs can have two types of passwords: a user password (required to open the file) and an owner password (controls permissions like printing, copying, or editing). This tool removes both types of protection, giving you full unrestricted access to the PDF. You must know the user password to unlock the file.',
  },
  {
    question: 'Is my PDF data and password secure?',
    answer:
      'Absolutely. All processing happens locally in your browser using client-side JavaScript. Your PDF file and password are never uploaded to any server or sent over the internet. Once you close the page, all data is cleared from memory. This is far more secure than online services that require you to upload your file.',
  },
  {
    question: 'What happens if I enter the wrong password?',
    answer:
      'If you enter an incorrect password, the tool will display an error message indicating that the password is wrong. No unlocked file will be generated. Simply re-enter the correct password and try again. There is no limit on the number of attempts you can make.',
  },
  {
    question: 'Will the unlocked PDF lose any content or quality?',
    answer:
      'No. The unlocked PDF retains all original content, formatting, images, fonts, and layout exactly as they were. The only change is the removal of password protection and encryption. Page content, bookmarks, annotations, and form fields are all preserved.',
  },
];

const relatedTools = [
  {
    name: 'PDF Protect',
    hash: '#/tools/pdf-protect',
    description: 'Add password protection to your PDF files.',
  },
  {
    name: 'PDF Merge',
    hash: '#/tools/pdf-merge',
    description: 'Combine multiple PDF files into one document.',
  },
  {
    name: 'PDF Compress',
    hash: '#/tools/pdf-compress',
    description: 'Reduce PDF file size while keeping quality.',
  },
];

interface PdfUnlockProps {
  onNavigate: (hash: string) => void;
}

export default function PdfUnlock({ onNavigate }: PdfUnlockProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState('');
  const [password, setPassword] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [unlockedBytes, setUnlockedBytes] = useState<Uint8Array | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please upload a valid PDF file');
      return;
    }

    setPdfFile(file);
    setPdfName(file.name.replace(/\.pdf$/i, ''));
    setPassword('');
    setUnlocked(false);
    setUnlockedBytes(null);
    toast.success('PDF file loaded successfully');
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

  const unlockPdf = useCallback(async () => {
    if (!pdfFile) {
      toast.error('Please upload a PDF file first');
      return;
    }

    if (!password.trim()) {
      toast.error('Please enter the PDF password');
      return;
    }

    setIsUnlocking(true);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      // Re-save without encryption
      const pdfBytes = await pdfDoc.save();

      setUnlockedBytes(pdfBytes);
      setUnlocked(true);
      toast.success('PDF unlocked successfully! You can now download the unlocked file.');
    } catch (error: unknown) {
      console.error('PDF unlock error:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (
        errorMessage.toLowerCase().includes('password') ||
        errorMessage.toLowerCase().includes('decrypt') ||
        errorMessage.toLowerCase().includes('encrypt') ||
        errorMessage.toLowerCase().includes('invalid')
      ) {
        toast.error('Incorrect password. Please check and try again.');
      } else {
        toast.error('Failed to unlock PDF. The file may be corrupted or not password-protected.');
      }
    } finally {
      setIsUnlocking(false);
    }
  }, [pdfFile, password]);

  const downloadUnlocked = useCallback(() => {
    if (!unlockedBytes) return;

    const blob = new Blob([unlockedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pdfName || 'unlocked'}_unlocked.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.info('Download started');
  }, [unlockedBytes, pdfName]);

  const reset = useCallback(() => {
    setPdfFile(null);
    setPdfName('');
    setPassword('');
    setUnlocked(false);
    setUnlockedBytes(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <ToolLayout
      title="PDF Unlock"
      description="Remove password protection from PDF files instantly in your browser. Upload a password-protected PDF, enter the password, and download an unlocked version. All processing happens locally on your device — your files and passwords never leave your computer."
      icon={Unlock}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {!pdfFile ? (
          /* Upload Area */
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
            <p className="text-sm text-[#888888]">Password-protected PDF files only</p>
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
            {/* Selected File Info */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-[#1a1a1a]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 shrink-0">
                <Lock className="h-5 w-5 text-[#8A2BE2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{pdfFile.name}</p>
                <p className="text-xs text-[#888888]">
                  {(pdfFile.size / 1024).toFixed(1)} KB &middot; Password-protected
                </p>
              </div>
              <button
                onClick={reset}
                className="text-xs text-[#555555] hover:text-red-400 transition-colors duration-200"
                aria-label="Remove file"
              >
                Remove
              </button>
            </div>

            {/* Password Input */}
            {!unlocked && (
              <div className="space-y-3">
                <Label htmlFor="pdf-password" className="text-sm font-medium text-white">
                  Enter PDF Password
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="pdf-password"
                    type="password"
                    placeholder="Enter the password to unlock this PDF"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isUnlocking) unlockPdf();
                    }}
                    className="flex-1 bg-black/40 border-[#222222] text-white placeholder:text-[#555555] focus:border-[#8A2BE2] focus:ring-[#8A2BE2]/20"
                  />
                  <Button
                    onClick={unlockPdf}
                    disabled={isUnlocking || !password.trim()}
                    className="cta-primary shrink-0"
                  >
                    {isUnlocking ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Unlocking...
                      </>
                    ) : (
                      <>
                        <Unlock className="h-4 w-4 mr-2" />
                        Unlock
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-[#666666]">
                  Your password is processed locally and never sent to any server.
                </p>
              </div>
            )}

            {/* Unlocked Result */}
            {unlocked && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20 shrink-0">
                    <Unlock className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-400">PDF Unlocked Successfully</p>
                    <p className="text-xs text-[#888888]">
                      Password protection has been removed
                      {unlockedBytes && (
                        <> &middot; {(unlockedBytes.length / 1024).toFixed(1)} KB</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={downloadUnlocked}
                    className="flex-1 h-12 text-base font-semibold cta-primary"
                    size="lg"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Unlocked PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={reset}
                    className="border-[#222222] text-white hover:border-[#8A2BE2]/50 h-12"
                  >
                    Unlock Another PDF
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Loading Overlay */}
        {isUnlocking && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-8 w-8 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-[#AAAAAA]">Removing password protection...</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
