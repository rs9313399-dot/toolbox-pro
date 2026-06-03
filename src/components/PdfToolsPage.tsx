'use client';

import {
  FilePlus,
  Scissors,
  FileDown,
  RotateCw,
  Droplets,
  Unlock,
  Lock,
  Hash,
  FileText,
  ArrowUpDown,
  FileSearch,
  Crop,
  FileImage,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  File,
  CheckCircle2,
} from 'lucide-react';
import AdPlaceholder from './AdPlaceholder';

interface PdfToolsPageProps {
  onNavigate: (hash: string) => void;
}

const pdfTools = [
  {
    name: 'PDF Merge',
    hash: '#/tools/pdf-merge',
    icon: FilePlus,
    description: 'Merge multiple PDF files into one document. Upload, reorder, and combine PDFs instantly in your browser.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    popular: true,
  },
  {
    name: 'PDF Split',
    hash: '#/tools/pdf-split',
    icon: Scissors,
    description: 'Extract specific pages from a PDF. Select pages by number or range and download as a new document.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    popular: true,
  },
  {
    name: 'PDF Compress',
    hash: '#/tools/pdf-compress',
    icon: FileDown,
    description: 'Reduce PDF file size by stripping unused data and optimizing structure. Keep quality while saving space.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    popular: true,
  },
  {
    name: 'PDF Rotate',
    hash: '#/tools/pdf-rotate',
    icon: RotateCw,
    description: 'Rotate PDF pages by 90, 180, or 270 degrees. Apply to all pages or specific pages only.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    name: 'PDF Watermark',
    hash: '#/tools/pdf-watermark',
    icon: Droplets,
    description: 'Add custom text watermarks to your PDF. Adjust font size, opacity, color, and position.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    name: 'PDF Unlock',
    hash: '#/tools/pdf-unlock',
    icon: Unlock,
    description: 'Remove password protection from PDF files. Enter the password and download an unlocked copy.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    name: 'PDF Protect',
    hash: '#/tools/pdf-protect',
    icon: Lock,
    description: 'Add password protection to your PDF files. Secure sensitive documents with a custom password.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  {
    name: 'PDF Page Numbers',
    hash: '#/tools/pdf-page-numbers',
    icon: Hash,
    description: 'Add page numbers to PDF documents. Choose position, font size, and starting number.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
  },
  {
    name: 'PDF to Text',
    hash: '#/tools/pdf-to-text',
    icon: FileText,
    description: 'Extract text from PDF documents. Copy to clipboard or download as a text file.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
  },
  {
    name: 'PDF Rearrange',
    hash: '#/tools/pdf-rearrange',
    icon: ArrowUpDown,
    description: 'Reorder PDF pages by dragging them into your desired sequence. Remove unwanted pages.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    name: 'PDF Metadata Editor',
    hash: '#/tools/pdf-metadata-editor',
    icon: FileSearch,
    description: 'View and edit PDF metadata including title, author, subject, keywords, and dates.',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
  },
  {
    name: 'PDF Crop',
    hash: '#/tools/pdf-crop',
    icon: Crop,
    description: 'Crop PDF pages by adjusting margins. Set custom crop areas for all or specific pages.',
    color: 'text-lime-400',
    bg: 'bg-lime-500/10',
    border: 'border-lime-500/20',
  },
  {
    name: 'Image to PDF',
    hash: '#/tools/image-to-pdf',
    icon: FileImage,
    description: 'Convert images to PDF documents instantly. Upload multiple images, rearrange, and download as a single PDF.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
  {
    name: 'PDF to Image',
    hash: '#/tools/pdf-to-image',
    icon: FileImage,
    description: 'Convert PDF pages to high-quality PNG images. Export each page individually or download all at once.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
];

const pdfBenefits = [
  { icon: ShieldCheck, label: '100% Private - Files never leave your browser' },
  { icon: Zap, label: 'Instant processing - No upload wait' },
  { icon: Globe, label: 'Works on any device - No installation' },
  { icon: File, label: '14 powerful PDF tools - All free' },
];

export default function PdfToolsPage({ onNavigate }: PdfToolsPageProps) {
  return (
    <main className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Background gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[180px]" />
          <div className="absolute top-20 -right-40 w-[400px] h-[400px] rounded-full bg-[#8A2BE2]/8 blur-[150px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-orange-500/5 blur-[200px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8">
            <File className="h-3.5 w-3.5 text-orange-400" />
            <span className="text-xs font-medium text-orange-400">14 Free PDF Tools</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
            <span className="text-orange-400">PDF Tools</span>
            <br />
            <span className="text-white">Suite</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#AAAAAA] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Complete PDF toolkit — merge, split, compress, rotate, watermark, protect, unlock, and more. 
            All processing happens in your browser. Your files never leave your device.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {pdfBenefits.map((b) => (
              <span key={b.label} className="flex items-center gap-1.5 text-sm text-[#888888]">
                <b.icon className="h-3.5 w-3.5 text-orange-400" />
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* AD BANNER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
        <AdPlaceholder size="banner" />
      </div>

      {/* Popular Tools Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
            Most <span className="text-orange-400">Popular</span>
          </h2>
          <p className="text-[#AAAAAA] text-base max-w-lg mx-auto">
            The PDF tools people use the most
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {pdfTools.filter(t => t.popular).map((tool) => (
            <button
              key={tool.hash}
              onClick={() => onNavigate(tool.hash)}
              className="tool-card p-7 text-left group relative overflow-hidden"
            >
              {/* Popular badge */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  POPULAR
                </span>
              </div>
              <div
                className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${tool.bg} border ${tool.border} mb-6 transition-all duration-300 group-hover:scale-110`}
              >
                <tool.icon className={`h-7 w-7 ${tool.color}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300">
                {tool.name}
              </h3>
              <p className="text-sm text-[#888888] leading-relaxed mb-5">
                {tool.description}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-400 group-hover:gap-3 transition-all duration-300">
                Use Tool
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* All PDF Tools Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
            All <span className="text-orange-400">PDF Tools</span>
          </h2>
          <p className="text-[#AAAAAA] text-base max-w-lg mx-auto">
            Complete collection of free PDF tools at your fingertips
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {pdfTools.map((tool) => (
            <button
              key={tool.hash}
              onClick={() => onNavigate(tool.hash)}
              className="tool-card p-6 text-left group"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${tool.bg} border ${tool.border} mb-4 transition-all duration-300 group-hover:scale-110`}
              >
                <tool.icon className={`h-6 w-6 ${tool.color}`} />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-orange-400 transition-colors duration-300">
                {tool.name}
              </h3>
              <p className="text-sm text-[#888888] leading-relaxed mb-4">
                {tool.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-400 group-hover:gap-2.5 transition-all duration-300">
                Open
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* IN-CONTENT AD */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
        <AdPlaceholder size="in-content" />
      </div>

      {/* Why Choose Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-3xl p-10 sm:p-16 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-orange-500/5 blur-[200px] pointer-events-none" />
          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
                Why Use Our <span className="text-orange-400">PDF Tools?</span>
              </h2>
              <p className="text-[#AAAAAA] text-base max-w-lg mx-auto">
                Secure, fast, and completely free PDF processing
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: ShieldCheck, title: '100% Private', desc: 'Your PDF files never leave your browser. No server uploads, no data collection, no privacy concerns.' },
                { icon: Zap, title: 'Lightning Fast', desc: 'All processing happens locally using pdf-lib. No upload/download wait times — instant results.' },
                { icon: CheckCircle2, title: 'No Watermarks', desc: 'Your output PDFs are clean with no watermarks, no branding, and no quality reduction.' },
                { icon: Globe, title: 'Works Everywhere', desc: 'Use on any device — desktop, tablet, or mobile. No installation or signup required.' },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-4">
                    <item.icon className="h-6 w-6 text-orange-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-[#888888] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM AD */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        <AdPlaceholder size="banner" />
      </div>
    </main>
  );
}
