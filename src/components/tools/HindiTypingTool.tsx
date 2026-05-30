'use client';

import { useState, useCallback, useEffect } from 'react';
import { Languages, Copy, Check, Trash2, Download, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

/* ─── Hindi Transliteration Map ─── */
const hindiMap: Record<string, string> = {
  // Vowels
  'a': 'अ', 'aa': 'आ', 'i': 'इ', 'ee': 'ई', 'u': 'उ', 'oo': 'ऊ',
  'e': 'ए', 'ai': 'ऐ', 'o': 'ओ', 'au': 'औ', 'am': 'अं', 'ah': 'अः',
  // Consonants - Guturals
  'ka': 'क', 'kha': 'ख', 'ga': 'ग', 'gha': 'घ', 'nga': 'ङ',
  // Palatals
  'cha': 'च', 'chha': 'छ', 'ja': 'ज', 'jha': 'झ', 'nya': 'ञ',
  // Retroflexes
  'ta': 'ट', 'tha': 'ठ', 'da': 'ड', 'dha': 'ढ', 'na': 'ण',
  // Dentals
  'tta': 'त', 'ttha': 'थ', 'dda': 'द', 'ddha': 'ध', 'nna': 'न',
  // Labials
  'pa': 'प', 'pha': 'फ', 'ba': 'ब', 'bha': 'भ', 'ma': 'म',
  // Semivowels
  'ya': 'य', 'ra': 'र', 'la': 'ल', 'va': 'व',
  // Sibilants
  'sha': 'श', 'ssa': 'ष', 'sa': 'स',
  // Others
  'ha': 'ह', 'ksha': 'क्ष', 'tra': 'त्र', 'jna': 'ज्ञ',
  // Additional common mappings
  'ki': 'कि', 'ke': 'के', 'ku': 'कु', 'ko': 'को',
  'kae': 'कै', 'kou': 'कौ',
  'gi': 'गि', 'ge': 'गे', 'gu': 'गु', 'go': 'गो',
  'ji': 'जि', 'je': 'जे', 'ju': 'जु', 'jo': 'जो',
  'di': 'दि', 'de': 'दे', 'du': 'दु', 'do': 'दो',
  'mi': 'मि', 'me': 'मे', 'mu': 'मु', 'mo': 'मो',
  'pi': 'पि', 'pe': 'पे', 'pu': 'पु', 'po': 'पो',
  'ri': 'रि', 're': 'रे', 'ru': 'रु', 'ro': 'रो',
  'si': 'सि', 'se': 'से', 'su': 'सु', 'so': 'सो',
  'hi': 'हि', 'he': 'हे', 'hu': 'हु', 'ho': 'हो',
  'bi': 'बि', 'be': 'बे', 'bu': 'बु', 'bo': 'बो',
  'ti': 'ति', 'te': 'ते', 'tu': 'तु', 'to': 'तो',
  'vi': 'वि', 've': 'वे', 'vu': 'वु', 'vo': 'वो',
  'li': 'लि', 'le': 'ले', 'lu': 'लु', 'lo': 'लो',
  'ni': 'नि', 'ne': 'ने', 'nu': 'नु', 'no': 'नो',
  // Common words
  'namaste': 'नमस्ते', 'dhanyavad': 'धन्यवाद', 'shukriya': 'शुक्रिया',
  'kaise': 'कैसे', 'ho': 'हो', 'hai': 'है', 'hain': 'हैं',
  'main': 'मैं', 'hum': 'हम', 'tum': 'तुम', 'aap': 'आप',
  'kya': 'क्या', 'kyun': 'क्यों', 'kab': 'कब', 'kahan': 'कहाँ',
  'achha': 'अच्छा', 'bura': 'बुरा', 'bahut': 'बहुत', 'thoda': 'थोड़ा',
  'zara': 'ज़रा', 'jaldi': 'जल्दी', 'aaj': 'आज', 'kal': 'कल',
  'ghar': 'घर', 'kaam': 'काम', 'paani': 'पानी', 'khana': 'खाना',
  'duniya': 'दुनिया', 'pyaar': 'प्यार', 'dil': 'दिल', 'zindagi': 'ज़िंदगी',
  'sir': 'सिर', 'ankh': 'आँख', 'haath': 'हाथ', 'pair': 'पैर',
  // Matras
  'aa': 'ा', 'ee': 'ी', 'ii': 'ी', 'uu': 'ू',
  // Numbers
  '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
  '5': '५', '6': '६', '7': '७', '8': '८', '9': '९',
  // Punctuation
  '.': '।', '..': '॥',
};

/* ─── Transliterate function ─── */
function transliterateToHindi(text: string): string {
  if (!text.trim()) return '';

  const words = text.split(/\s+/);
  const result = words.map(word => {
    // Try full word match first
    const lowerWord = word.toLowerCase().replace(/[^a-z0-9.]/g, '');
    if (hindiMap[lowerWord]) {
      return hindiMap[lowerWord];
    }

    // Character-by-character transliteration
    let converted = '';
    let i = 0;
    const cleanWord = word.toLowerCase();

    while (i < cleanWord.length) {
      let matched = false;

      // Try longest match first (3 chars, 2 chars, 1 char)
      for (let len = 3; len >= 1; len--) {
        const sub = cleanWord.substring(i, i + len);
        if (hindiMap[sub]) {
          converted += hindiMap[sub];
          i += len;
          matched = true;
          break;
        }
      }

      if (!matched) {
        // Keep original character if no mapping found
        converted += cleanWord[i];
        i++;
      }
    }

    return converted;
  });

  return result.join(' ');
}

/* ─── Sample Texts ─── */
const sampleTexts = [
  { label: 'Greeting', english: 'namaste kaise ho aap', hindi: 'नमस्ते कैसे हो आप' },
  { label: 'Thank you', english: 'dhanyavad shukriya', hindi: 'धन्यवाद शुक्रिया' },
  { label: 'Love', english: 'pyaar dil zindagi', hindi: 'प्यार दिल ज़िंदगी' },
  { label: 'Daily life', english: 'aaj kal ghar kaam', hindi: 'आज कल घर काम' },
];

/* ─── FAQ Items ─── */
const faqItems = [
  {
    question: 'How does Hindi typing work?',
    answer:
      'Simply type Hindi words using English letters (Romanized Hindi / Hinglish), and the tool automatically converts them to Hindi Devanagari script. For example, type "namaste" and it converts to "नमस्ते". This is called phonetic or transliteration-based typing.',
  },
  {
    question: 'What is Hinglish/Romanized Hindi?',
    answer:
      'Hinglish is Hindi written using English (Latin) letters. Instead of learning the Devanagari keyboard layout, you type Hindi words the way they sound in English. For example: "kaise" = "कैसे", "aap" = "आप", "dhanyavad" = "धन्यवाद".',
  },
  {
    question: 'Is the conversion accurate?',
    answer:
      'The tool uses a comprehensive phonetic mapping system that covers common Hindi words and sounds. It works best for standard Hindi words typed phonetically. Complex words or proper nouns may need manual adjustment. You can always edit the Hindi text directly.',
  },
  {
    question: 'Can I edit the Hindi text directly?',
    answer:
      'Yes! The Hindi text output is fully editable. You can click on the text area and make any corrections or additions directly. The tool gives you a starting point that you can refine.',
  },
];

/* ─── Related Tools ─── */
const relatedTools = [
  {
    name: 'Word Counter',
    hash: '#/tools/word-counter',
    description: 'Count words and characters in your Hindi text.',
  },
  {
    name: 'Text to Speech',
    hash: '#/tools/text-to-speech',
    description: 'Convert your Hindi text to speech.',
  },
  {
    name: 'Emoji Keyboard',
    hash: '#/tools/emoji-keyboard',
    description: 'Browse and copy emojis for your content.',
  },
];

/* ─── Component ─── */
interface HindiTypingToolProps {
  onNavigate: (hash: string) => void;
}

export default function HindiTypingTool({ onNavigate }: HindiTypingToolProps) {
  const [englishText, setEnglishText] = useState('');
  const [hindiText, setHindiText] = useState('');
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  /* Convert on the fly */
  useEffect(() => {
    const result = transliterateToHindi(englishText);
    setHindiText(result);
    setCharCount(result.length);
    setWordCount(result.trim() ? result.trim().split(/\s+/).length : 0);
  }, [englishText]);

  /* Copy Hindi text */
  const handleCopy = useCallback(async () => {
    if (!hindiText.trim()) return;
    try {
      await navigator.clipboard.writeText(hindiText);
      setCopied(true);
      toast.success('Hindi text copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy text');
    }
  }, [hindiText]);

  /* Download Hindi text */
  const handleDownload = useCallback(() => {
    if (!hindiText.trim()) return;
    const blob = new Blob([hindiText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hindi-text.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Text downloaded!');
  }, [hindiText]);

  /* Load sample text */
  const loadSample = useCallback((text: string) => {
    setEnglishText(text);
  }, []);

  /* Clear all */
  const handleClear = useCallback(() => {
    setEnglishText('');
    setHindiText('');
  }, []);

  return (
    <ToolLayout
      title="Hindi Typing Tool"
      description="Type in Hindi using English letters. Automatic Hinglish to Hindi Devanagari conversion."
      icon={Languages}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {/* Quick Samples */}
        <div>
          <label className="text-sm font-medium text-white mb-3 block">Quick Start Examples</label>
          <div className="flex flex-wrap gap-2">
            {sampleTexts.map((sample) => (
              <button
                key={sample.label}
                onClick={() => loadSample(sample.english)}
                className="px-4 py-2 rounded-lg bg-black/40 border border-[#1a1a1a] text-xs font-medium text-[#AAAAAA] hover:border-[#8A2BE2]/30 hover:text-white hover:bg-[#8A2BE2]/5 transition-all"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* English Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <Type className="h-4 w-4 text-[#00FFFF]" />
              Type in Hinglish (English Letters)
            </label>
            <span className="text-xs text-[#555555]">
              {englishText.length} characters
            </span>
          </div>
          <textarea
            value={englishText}
            onChange={(e) => setEnglishText(e.target.value)}
            placeholder="Type Hindi in English letters... e.g., 'namaste kaise ho aap'"
            rows={5}
            className="w-full rounded-xl bg-black/40 border border-[#222222] px-4 py-3 text-white text-sm leading-relaxed resize-y focus:outline-none focus:border-[#8A2BE2]/50 focus:ring-1 focus:ring-[#8A2BE2]/20 transition-all placeholder:text-[#444444]"
            dir="ltr"
          />
        </div>

        {/* Hindi Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <Languages className="h-4 w-4 text-[#8A2BE2]" />
              Hindi Output (Devanagari)
            </label>
            <span className="text-xs text-[#555555]">
              {wordCount} words · {charCount} chars
            </span>
          </div>
          <textarea
            value={hindiText}
            onChange={(e) => setHindiText(e.target.value)}
            placeholder="Hindi text will appear here..."
            rows={5}
            className="w-full rounded-xl bg-black/40 border border-[#222222] px-4 py-3 text-white text-lg leading-relaxed resize-y focus:outline-none focus:border-[#8A2BE2]/50 focus:ring-1 focus:ring-[#8A2BE2]/20 transition-all placeholder:text-[#444444]"
            dir="ltr"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleCopy}
            disabled={!hindiText.trim()}
            className="flex-1 h-11 cta-primary font-semibold"
            size="lg"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Hindi Text
              </>
            )}
          </Button>
          <Button
            onClick={handleDownload}
            disabled={!hindiText.trim()}
            variant="outline"
            className="h-11 px-5 border-[#222222] text-[#AAAAAA] hover:text-white hover:border-[#8A2BE2]/40 hover:bg-white/5 transition-all"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={handleClear}
            disabled={!englishText && !hindiText}
            variant="outline"
            className="h-11 px-5 border-[#222222] text-[#AAAAAA] hover:text-white hover:border-[#8A2BE2]/40 hover:bg-white/5 transition-all"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        {/* Transliteration Guide */}
        <div className="p-5 rounded-xl bg-black/40 border border-[#1a1a1a]">
          <h3 className="text-sm font-semibold text-white mb-3">Common Hindi Mappings</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              ['namaste → नमस्ते', 'dhanyavad → धन्यवाद'],
              ['kaise → कैसे', 'aap → आप'],
              ['pyaar → प्यार', 'zindagi → ज़िंदगी'],
              ['kaam → काम', 'ghar → घर'],
              ['khana → खाना', 'paani → पानी'],
              ['dil → दिल', 'duniya → दुनिया'],
            ].flat().map((item) => (
              <div
                key={item}
                className="px-3 py-2 rounded-lg bg-black/30 border border-[#1a1a1a] text-xs text-[#AAAAAA]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
