'use client';

import { useState, useMemo, useCallback } from 'react';
import { Type, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'How does the word counter work?',
    answer:
      'The word counter splits your text by whitespace and filters out empty strings to give you an accurate word count. It processes everything in real-time as you type, with no server roundtrips.',
  },
  {
    question: 'Is my text stored anywhere?',
    answer:
      'No, all processing happens entirely in your browser. Your text is never sent to any server, stored in any database, or shared with anyone. When you close the page, your text is gone.',
  },
  {
    question: 'How is reading time calculated?',
    answer:
      'Reading time is calculated based on an average reading speed of 200 words per minute, which is the widely accepted standard for adult readers. The estimate helps you gauge how long your content will take to read.',
  },
];

const relatedTools = [
  {
    name: 'Password Generator',
    hash: '#/tools/password-generator',
    description: 'Create strong, secure passwords easily.',
  },
  {
    name: 'Image Compressor',
    hash: '#/tools/image-compressor',
    description: 'Compress images without losing quality.',
  },
  {
    name: 'YouTube Thumbnail',
    hash: '#/tools/youtube-thumbnail',
    description: 'Download YouTube video thumbnails easily.',
  },
];

interface WordCounterProps {
  onNavigate: (hash: string) => void;
}

export default function WordCounter({ onNavigate }: WordCounterProps) {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();

    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
      : 0;
    const paragraphs = trimmed
      ? trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length ||
        (trimmed ? 1 : 0)
      : 0;
    const avgWordLength =
      words > 0
        ? (
            trimmed.split(/\s+/).reduce((acc, w) => acc + w.length, 0) / words
          ).toFixed(1)
        : '0.0';
    let readingTime: string;
    if (words === 0) {
      readingTime = '0 min';
    } else if (words < 200) {
      readingTime = '< 1 min';
    } else {
      readingTime = `${Math.ceil(words / 200)} min`;
    }

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      avgWordLength,
      readingTime,
    };
  }, [text]);

  const handleClear = useCallback(() => {
    setText('');
  }, []);

  const statCards = [
    { label: 'Words', value: stats.words, color: 'text-purple-400' },
    { label: 'Characters', value: stats.characters, color: 'text-cyan-400' },
    { label: 'No Spaces', value: stats.charactersNoSpaces, color: 'text-cyan-300' },
    { label: 'Sentences', value: stats.sentences, color: 'text-green-400' },
    { label: 'Paragraphs', value: stats.paragraphs, color: 'text-yellow-400' },
    { label: 'Avg Length', value: stats.avgWordLength, color: 'text-pink-400' },
    { label: 'Reading Time', value: stats.readingTime, color: 'text-orange-400' },
  ];

  return (
    <ToolLayout
      title="Word Counter"
      description="Count words, characters, sentences, paragraphs, and estimate reading time. All processing happens in your browser for maximum privacy."
      icon={Type}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-black/30 border border-[#1a1a1a] p-4 text-center"
            >
              <p className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs text-[#888888] mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Textarea */}
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here to see real-time stats..."
            className="min-h-[250px] sm:min-h-[300px] bg-black/30 border-[#1a1a1a] text-white placeholder:text-[#555555] text-sm leading-relaxed resize-y focus:border-[#8A2BE2] transition-colors"
          />
          {text && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute top-3 right-3 text-[#888888] hover:text-white"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
