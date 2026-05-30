'use client';

import { useState, useCallback, useMemo } from 'react';
import { ShieldCheck, Upload, FileText, AlertTriangle, CheckCircle2, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

/* ─── Utility: Tokenize text into sentences ─── */
function tokenizeSentences(text: string): string[] {
  return text
    .replace(/\n+/g, '. ')
    .split(/[.!?]+/)
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length > 10);
}

/* ─── Utility: Create n-grams ─── */
function createNgrams(text: string, n: number = 3): Set<string> {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const ngrams = new Set<string>();
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.add(words.slice(i, i + n).join(' '));
  }
  return ngrams;
}

/* ─── Utility: Calculate Jaccard similarity ─── */
function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 0;
  let intersection = 0;
  setA.forEach(item => {
    if (setB.has(item)) intersection++;
  });
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/* ─── Utility: Find matching sentences ─── */
function findMatchingSentences(
  originalSentences: string[],
  checkSentences: string[]
): { original: string; check: string; similarity: number }[] {
  const matches: { original: string; check: string; similarity: number }[] = [];

  for (const origSent of originalSentences) {
    const origNgrams = createNgrams(origSent, 3);
    if (origNgrams.size === 0) continue;

    for (const checkSent of checkSentences) {
      const checkNgrams = createNgrams(checkSent, 3);
      if (checkNgrams.size === 0) continue;

      const similarity = jaccardSimilarity(origNgrams, checkNgrams);
      if (similarity > 0.4) {
        matches.push({
          original: origSent,
          check: checkSent,
          similarity,
        });
      }
    }
  }

  return matches.sort((a, b) => b.similarity - a.similarity);
}

/* ─── FAQ Items ─── */
const faqItems = [
  {
    question: 'How does the Plagiarism Checker work?',
    answer:
      'Our Plagiarism Checker compares two texts using n-gram analysis and Jaccard similarity. It breaks both texts into small word sequences (n-grams) and calculates the overlap between them. Matching sentences and similar phrases are highlighted with their similarity percentage, helping you identify potential plagiarism.',
  },
  {
    question: 'Is this a substitute for professional plagiarism detection?',
    answer:
      'No. This tool performs local text comparison between two documents you provide. It does not search the internet or academic databases. Professional tools like Turnitin compare against billions of web pages and publications. Use this tool for quick checks between specific documents.',
  },
  {
    question: 'What similarity percentage indicates plagiarism?',
    answer:
      'Generally, similarity above 20% may indicate potential plagiarism. However, context matters — academic papers may have higher similarity due to quotes and citations, while original content should be below 10%. Matching phrases in quotes or common expressions are usually not concerning.',
  },
  {
    question: 'Is my text stored or sent anywhere?',
    answer:
      'No. All text comparison happens directly in your browser. Your text is never sent to any server, stored, or shared. The tool uses client-side JavaScript for all analysis, ensuring complete privacy.',
  },
  {
    question: 'Can I check text against online sources?',
    answer:
      'This tool only compares text you provide — it does not search the internet. For checking against online sources, you would need a professional plagiarism detection service that has access to web indexes and academic databases.',
  },
];

/* ─── Related Tools ─── */
const relatedTools = [
  {
    name: 'Word Counter',
    hash: '#/tools/word-counter',
    description: 'Count words and analyze text statistics.',
  },
  {
    name: 'Base64 Encoder',
    hash: '#/tools/base64-encoder',
    description: 'Encode and decode text and data.',
  },
  {
    name: 'JSON Formatter',
    hash: '#/tools/json-formatter',
    description: 'Format and validate JSON data.',
  },
];

/* ─── Component ─── */
interface PlagiarismCheckerProps {
  onNavigate: (hash: string) => void;
}

export default function PlagiarismChecker({ onNavigate }: PlagiarismCheckerProps) {
  const [originalText, setOriginalText] = useState('');
  const [checkText, setCheckText] = useState('');
  const [results, setResults] = useState<{
    overallSimilarity: number;
    matchingSentences: { original: string; check: string; similarity: number }[];
    originalWordCount: number;
    checkWordCount: number;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /* Run plagiarism check */
  const handleCheck = useCallback(() => {
    if (!originalText.trim() || !checkText.trim()) {
      toast.error('Please enter text in both fields');
      return;
    }

    if (originalText.trim().length < 30 || checkText.trim().length < 30) {
      toast.error('Please enter at least 30 characters in each text field');
      return;
    }

    setIsAnalyzing(true);

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const origSentences = tokenizeSentences(originalText);
      const checkSentences = tokenizeSentences(checkText);
      const origNgrams = createNgrams(originalText, 3);
      const checkNgrams = createNgrams(checkText, 3);

      const overallSimilarity = jaccardSimilarity(origNgrams, checkNgrams);
      const matchingSentences = findMatchingSentences(origSentences, checkSentences);

      setResults({
        overallSimilarity: Math.round(overallSimilarity * 100),
        matchingSentences,
        originalWordCount: originalText.trim().split(/\s+/).length,
        checkWordCount: checkText.trim().split(/\s+/).length,
      });

      setIsAnalyzing(false);
      toast.success('Analysis complete!');
    }, 500);
  }, [originalText, checkText]);

  /* Reset */
  const handleReset = useCallback(() => {
    setOriginalText('');
    setCheckText('');
    setResults(null);
  }, []);

  /* Copy results */
  const handleCopyResults = useCallback(async () => {
    if (!results) return;
    const text = `Plagiarism Check Results\nOverall Similarity: ${results.overallSimilarity}%\nOriginal: ${results.originalWordCount} words\nChecked: ${results.checkWordCount} words\nMatching Sentences: ${results.matchingSentences.length}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Results copied!');
    } catch {
      toast.error('Failed to copy');
    }
  }, [results]);

  /* Similarity color */
  const getSimilarityColor = (pct: number) => {
    if (pct < 20) return 'text-green-400';
    if (pct < 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSimilarityBg = (pct: number) => {
    if (pct < 20) return 'bg-green-500/10 border-green-500/20';
    if (pct < 50) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <ToolLayout
      title="Plagiarism Checker"
      description="Compare two texts and find similarities. Detect matching phrases and sentences instantly."
      icon={ShieldCheck}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {/* Original Text */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#00FFFF]" />
              Original Text
            </label>
            <span className="text-xs text-[#555555]">
              {originalText.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <textarea
            value={originalText}
            onChange={(e) => { setOriginalText(e.target.value); setResults(null); }}
            placeholder="Paste the original text here..."
            rows={6}
            className="w-full rounded-xl bg-black/40 border border-[#222222] px-4 py-3 text-white text-sm leading-relaxed resize-y focus:outline-none focus:border-[#00FFFF]/50 focus:ring-1 focus:ring-[#00FFFF]/20 transition-all placeholder:text-[#444444]"
          />
        </div>

        {/* Check Text */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#8A2BE2]" />
              Text to Check
            </label>
            <span className="text-xs text-[#555555]">
              {checkText.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <textarea
            value={checkText}
            onChange={(e) => { setCheckText(e.target.value); setResults(null); }}
            placeholder="Paste the text you want to compare here..."
            rows={6}
            className="w-full rounded-xl bg-black/40 border border-[#222222] px-4 py-3 text-white text-sm leading-relaxed resize-y focus:outline-none focus:border-[#8A2BE2]/50 focus:ring-1 focus:ring-[#8A2BE2]/20 transition-all placeholder:text-[#444444]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleCheck}
            disabled={isAnalyzing || !originalText.trim() || !checkText.trim()}
            className="flex-1 h-12 text-base font-semibold cta-primary"
            size="lg"
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            Check Plagiarism
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="h-12 px-5 border-[#222222] text-[#AAAAAA] hover:text-white hover:border-[#8A2BE2]/40 hover:bg-white/5 transition-all"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Overall Similarity */}
            <div className={`p-6 rounded-xl border ${getSimilarityBg(results.overallSimilarity)} relative overflow-hidden`}>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className={`text-5xl font-black ${getSimilarityColor(results.overallSimilarity)}`}>
                    {results.overallSimilarity}%
                  </p>
                  <p className="text-xs text-[#888888] mt-1">Similarity</p>
                </div>
                <div className="flex-1 ml-4">
                  {results.overallSimilarity < 20 ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-green-400">Low Similarity</p>
                        <p className="text-xs text-[#888888]">The texts appear to be largely original</p>
                      </div>
                    </div>
                  ) : results.overallSimilarity < 50 ? (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="text-sm font-medium text-yellow-400">Moderate Similarity</p>
                        <p className="text-xs text-[#888888]">Some matching content detected — review carefully</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="text-sm font-medium text-red-400">High Similarity</p>
                        <p className="text-xs text-[#888888]">Significant matching content — likely plagiarized</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-[#1a1a1a] text-center">
                <p className="text-lg font-bold text-white">{results.originalWordCount}</p>
                <p className="text-xs text-[#888888]">Original Words</p>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-[#1a1a1a] text-center">
                <p className="text-lg font-bold text-white">{results.checkWordCount}</p>
                <p className="text-xs text-[#888888]">Checked Words</p>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-[#1a1a1a] text-center">
                <p className="text-lg font-bold text-white">{results.matchingSentences.length}</p>
                <p className="text-xs text-[#888888]">Matching Phrases</p>
              </div>
            </div>

            {/* Matching Sentences */}
            {results.matchingSentences.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Matching Phrases</h3>
                <div className="space-y-3">
                  {results.matchingSentences.slice(0, 10).map((match, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-black/40 border border-[#1a1a1a] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#555555]">Match #{idx + 1}</span>
                        <span className={`text-xs font-bold ${getSimilarityColor(match.similarity * 100)}`}>
                          {Math.round(match.similarity * 100)}% similar
                        </span>
                      </div>
                      <p className="text-sm text-[#00FFFF]/80 leading-relaxed">
                        <span className="text-[#555555] mr-1">Original:</span>
                        {match.original}
                      </p>
                      <p className="text-sm text-[#8A2BE2]/80 leading-relaxed">
                        <span className="text-[#555555] mr-1">Checked:</span>
                        {match.check}
                      </p>
                    </div>
                  ))}
                </div>
                {results.matchingSentences.length > 10 && (
                  <p className="text-xs text-[#555555] mt-3 text-center">
                    Showing top 10 of {results.matchingSentences.length} matches
                  </p>
                )}
              </div>
            )}

            {/* Copy Results */}
            <Button
              onClick={handleCopyResults}
              variant="outline"
              className="w-full h-10 border-[#222222] text-[#AAAAAA] hover:text-white hover:border-[#8A2BE2]/40"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Results Summary
            </Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
