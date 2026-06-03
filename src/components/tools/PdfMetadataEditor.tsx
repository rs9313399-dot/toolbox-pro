'use client';

import { useState, useRef, useCallback } from 'react';
import { FileSearch, Upload, Download, Trash2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'What PDF metadata can I edit with this tool?',
    answer:
      'You can view and edit all standard PDF metadata fields including Title, Author, Subject, Keywords, Creator, Producer, Creation Date, and Modification Date. These fields are part of the PDF document information dictionary and are recognized by all major PDF readers and cataloging software.',
  },
  {
    question: 'Does editing metadata affect the visual content of my PDF?',
    answer:
      'No. Metadata is stored separately from the page content in a PDF. Editing metadata only changes the document properties — all text, images, formatting, and layout remain completely untouched. The visual output is identical to the original.',
  },
  {
    question: 'Is my PDF data secure when using this tool?',
    answer:
      'Absolutely. All processing happens entirely in your browser using the pdf-lib library. Your PDF is never uploaded to any server, and no data leaves your device. Once you close the page, all file data is cleared from memory. Your privacy is guaranteed.',
  },
  {
    question: 'Why would I want to edit PDF metadata?',
    answer:
      'Editing PDF metadata is useful for organizing documents, improving searchability in document management systems, correcting incorrect author or title information, adding keywords for better categorization, removing personal information before sharing, and ensuring consistent branding with proper creator and producer fields.',
  },
  {
    question: 'Can I remove or clear metadata fields entirely?',
    answer:
      'Yes. You can clear any metadata field by deleting its content in the editor and saving the PDF. Empty fields will be written as blank values. This is especially useful for privacy — you may want to strip personal information like author name or creation dates before sharing a document publicly.',
  },
];

const relatedTools = [
  {
    name: 'PDF Compress',
    hash: '#/tools/pdf-compress',
    description: 'Reduce PDF file size while keeping quality.',
  },
  {
    name: 'PDF Protect',
    hash: '#/tools/pdf-unlock',
    description: 'Unlock or remove PDF password protection.',
  },
  {
    name: 'PDF Merge',
    hash: '#/tools/pdf-merge',
    description: 'Merge multiple PDFs into a single document.',
  },
];

interface MetadataFields {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
  creationDate: string;
  modificationDate: string;
}

interface PdfMetadataEditorProps {
  onNavigate: (hash: string) => void;
}

function formatDateForInput(date: Date | undefined): string {
  if (!date) return '';
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return '';
  }
}

function parseDateFromInput(value: string): Date | undefined {
  if (!value) return undefined;
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return undefined;
    return date;
  } catch {
    return undefined;
  }
}

function formatDisplayDate(date: Date | undefined): string {
  if (!date) return 'Not set';
  try {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
}

const emptyMetadata: MetadataFields = {
  title: '',
  author: '',
  subject: '',
  keywords: '',
  creator: '',
  producer: '',
  creationDate: '',
  modificationDate: '',
};

export default function PdfMetadataEditor({ onNavigate }: PdfMetadataEditorProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [metadata, setMetadata] = useState<MetadataFields>(emptyMetadata);
  const [originalMetadata, setOriginalMetadata] = useState<MetadataFields>(emptyMetadata);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPdf = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      toast.error('Please upload a valid PDF file');
      return;
    }

    setIsLoading(true);
    setOriginalFile(file);
    setHasChanges(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      const loadedMetadata: MetadataFields = {
        title: pdfDoc.getTitle() ?? '',
        author: pdfDoc.getAuthor() ?? '',
        subject: pdfDoc.getSubject() ?? '',
        keywords: typeof pdfDoc.getKeywords() === 'string' ? pdfDoc.getKeywords()! : '',
        creator: pdfDoc.getCreator() ?? '',
        producer: pdfDoc.getProducer() ?? '',
        creationDate: formatDateForInput(pdfDoc.getCreationDate()),
        modificationDate: formatDateForInput(pdfDoc.getModificationDate()),
      };

      setMetadata(loadedMetadata);
      setOriginalMetadata(loadedMetadata);
      setPdfBytes(new Uint8Array(arrayBuffer));

      toast.success('PDF loaded — metadata fields populated');
    } catch (error) {
      console.error('PDF load error:', error);
      toast.error(
        'Failed to read PDF. The file may be corrupted or use unsupported features.'
      );
      setOriginalFile(null);
      setMetadata(emptyMetadata);
      setOriginalMetadata(emptyMetadata);
      setPdfBytes(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMetadataChange = useCallback(
    (field: keyof MetadataFields, value: string) => {
      setMetadata((prev) => {
        const updated = { ...prev, [field]: value };
        setHasChanges(
          Object.keys(updated).some(
            (key) => updated[key as keyof MetadataFields] !== originalMetadata[key as keyof MetadataFields]
          )
        );
        return updated;
      });
    },
    [originalMetadata]
  );

  const handleSave = useCallback(async () => {
    if (!pdfBytes) return;

    setIsSaving(true);

    try {
      const pdfDoc = await PDFDocument.load(pdfBytes, {
        ignoreEncryption: true,
      });

      pdfDoc.setTitle(metadata.title);
      pdfDoc.setAuthor(metadata.author);
      pdfDoc.setSubject(metadata.subject);
      pdfDoc.setKeywords(metadata.keywords.split(',').map((k) => k.trim()).filter(Boolean));
      pdfDoc.setCreator(metadata.creator);
      pdfDoc.setProducer(metadata.producer);

      const creationDate = parseDateFromInput(metadata.creationDate);
      if (creationDate) {
        pdfDoc.setCreationDate(creationDate);
      }

      const modificationDate = parseDateFromInput(metadata.modificationDate);
      if (modificationDate) {
        pdfDoc.setModificationDate(modificationDate);
      } else {
        pdfDoc.setModificationDate(new Date());
      }

      const savedBytes = await pdfDoc.save();

      const blob = new Blob([savedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = originalFile
        ? originalFile.name.replace(/\.pdf$/i, '_metadata.pdf')
        : 'document_metadata.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setPdfBytes(savedBytes);
      setOriginalMetadata({ ...metadata });
      setHasChanges(false);

      toast.success('PDF saved with updated metadata and downloaded!');
    } catch (error) {
      console.error('PDF save error:', error);
      toast.error('Failed to save PDF. An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  }, [pdfBytes, metadata, originalFile]);

  const handleReset = useCallback(() => {
    setOriginalFile(null);
    setPdfBytes(null);
    setMetadata(emptyMetadata);
    setOriginalMetadata(emptyMetadata);
    setIsDragging(false);
    setHasChanges(false);
    toast.info('Reset — ready for a new file');
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) loadPdf(file);
    },
    [loadPdf]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const metadataFieldConfig: {
    key: keyof MetadataFields;
    label: string;
    placeholder: string;
    type?: string;
  }[] = [
    { key: 'title', label: 'Title', placeholder: 'Document title' },
    { key: 'author', label: 'Author', placeholder: 'Author name' },
    { key: 'subject', label: 'Subject', placeholder: 'Document subject' },
    { key: 'keywords', label: 'Keywords', placeholder: 'keyword1, keyword2, keyword3' },
    { key: 'creator', label: 'Creator', placeholder: 'Application that created the PDF' },
    { key: 'producer', label: 'Producer', placeholder: 'PDF producer application' },
    { key: 'creationDate', label: 'Creation Date', placeholder: '', type: 'datetime-local' },
    { key: 'modificationDate', label: 'Modification Date', placeholder: '', type: 'datetime-local' },
  ];

  return (
    <ToolLayout
      title="PDF Metadata Editor"
      description="View, edit, and update PDF metadata fields directly in your browser. Modify title, author, keywords, dates, and more — all processing happens client-side so your files never leave your device."
      icon={FileSearch}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {!originalFile ? (
          /* Upload Area */
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-16 cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-[#8A2BE2] bg-[#8A2BE2]/5'
                : 'border-[#222222] hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5'
            }`}
          >
            <Upload
              className={`h-14 w-14 mb-4 ${
                isDragging ? 'text-[#8A2BE2]' : 'text-[#555555]'
              }`}
            />
            <p className="text-lg font-semibold text-white mb-1">
              Drop your PDF here
            </p>
            <p className="text-sm text-[#888888]">
              or click to browse &middot; PDF files only
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) loadPdf(file);
              }}
            />
          </div>
        ) : (
          <>
            {/* File Info Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20">
                  <FileSearch className="h-5 w-5 text-[#8A2BE2]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white truncate max-w-[240px]">
                    {originalFile.name}
                  </p>
                  <p className="text-xs text-[#888888]">
                    {(originalFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="border-[#222222] text-white hover:border-[#8A2BE2]/50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="h-8 w-8 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-[#AAAAAA]">Reading PDF metadata...</p>
              </div>
            )}

            {/* Metadata Editor */}
            {!isLoading && (
              <div className="space-y-5">
                {/* Section Header */}
                <div className="flex items-center gap-2 pb-2 border-b border-[#1a1a1a]">
                  <FileSearch className="h-4 w-4 text-[#8A2BE2]" />
                  <h3 className="text-sm font-semibold text-white">Document Metadata</h3>
                  {hasChanges && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#8A2BE2]/10 text-[#8A2BE2]">
                      Unsaved changes
                    </span>
                  )}
                </div>

                {/* Metadata Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {metadataFieldConfig.map((field) => (
                    <div
                      key={field.key}
                      className={
                        field.key === 'keywords' || field.key === 'subject'
                          ? 'sm:col-span-2'
                          : ''
                      }
                    >
                      <Label
                        htmlFor={`metadata-${field.key}`}
                        className="text-xs font-medium text-[#AAAAAA] mb-1.5 block"
                      >
                        {field.label}
                      </Label>
                      <Input
                        id={`metadata-${field.key}`}
                        type={field.type || 'text'}
                        placeholder={field.placeholder}
                        value={metadata[field.key]}
                        onChange={(e) => handleMetadataChange(field.key, e.target.value)}
                        className="bg-black/30 border-[#222222] text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/60 focus:ring-[#8A2BE2]/20 h-10 text-sm rounded-lg"
                      />
                      {/* Show original value for date fields if changed */}
                      {field.type === 'datetime-local' &&
                        metadata[field.key] !== originalMetadata[field.key] && (
                          <p className="text-[10px] text-[#666666] mt-1">
                            Original: {originalMetadata[field.key]
                              ? formatDisplayDate(parseDateFromInput(originalMetadata[field.key]))
                              : 'Not set'}
                          </p>
                        )}
                    </div>
                  ))}
                </div>

                {/* Keywords hint */}
                <p className="text-xs text-[#666666] -mt-2">
                  Separate keywords with commas. Changes are applied when you save and download.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !hasChanges}
                    className="flex-1 h-11 text-sm font-semibold cta-primary"
                    size="lg"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save & Download PDF'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMetadata({ ...originalMetadata });
                      setHasChanges(false);
                      toast.info('Changes reverted to original values');
                    }}
                    disabled={!hasChanges || isSaving}
                    className="h-11 border-[#222222] text-white hover:border-[#8A2BE2]/50 disabled:opacity-40"
                    size="lg"
                  >
                    Revert Changes
                  </Button>
                </div>

                {/* Saving Spinner */}
                {isSaving && (
                  <div className="flex items-center justify-center gap-2 py-2">
                    <div className="h-4 w-4 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-[#AAAAAA]">Saving metadata and preparing download...</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
