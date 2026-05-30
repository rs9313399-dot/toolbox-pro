'use client';

import { useState, useCallback, useMemo } from 'react';
import { Smile, Search, Copy, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

/* ─── Types ─── */
interface EmojiItem {
  emoji: string;
  name: string;
  category: EmojiCategory;
}

type EmojiCategory =
  | 'Smileys'
  | 'Gestures'
  | 'Hearts'
  | 'Animals'
  | 'Food'
  | 'Travel'
  | 'Objects'
  | 'Symbols';

interface EmojiKeyboardProps {
  onNavigate: (hash: string) => void;
}

/* ─── Category metadata ─── */
const CATEGORY_META: Record<EmojiCategory, { label: string; icon: string }> = {
  Smileys: { label: 'Smileys', icon: '😀' },
  Gestures: { label: 'Gestures', icon: '👋' },
  Hearts: { label: 'Hearts', icon: '❤️' },
  Animals: { label: 'Animals', icon: '🐱' },
  Food: { label: 'Food', icon: '🍕' },
  Travel: { label: 'Travel', icon: '✈️' },
  Objects: { label: 'Objects', icon: '💡' },
  Symbols: { label: 'Symbols', icon: '⚡' },
};

const CATEGORIES: EmojiCategory[] = [
  'Smileys',
  'Gestures',
  'Hearts',
  'Animals',
  'Food',
  'Travel',
  'Objects',
  'Symbols',
];

/* ─── Emoji data (120+ emojis) ─── */
const EMOJI_DATA: EmojiItem[] = [
  // ── Smileys (20) ──
  { emoji: '😀', name: 'grinning', category: 'Smileys' },
  { emoji: '😃', name: 'smiley', category: 'Smileys' },
  { emoji: '😄', name: 'smile', category: 'Smileys' },
  { emoji: '😁', name: 'grin', category: 'Smileys' },
  { emoji: '😆', name: 'laughing', category: 'Smileys' },
  { emoji: '😅', name: 'sweat smile', category: 'Smileys' },
  { emoji: '🤣', name: 'rofl', category: 'Smileys' },
  { emoji: '😂', name: 'joy', category: 'Smileys' },
  { emoji: '🙂', name: 'slightly smiling', category: 'Smileys' },
  { emoji: '😉', name: 'wink', category: 'Smileys' },
  { emoji: '😊', name: 'blush', category: 'Smileys' },
  { emoji: '😇', name: 'innocent', category: 'Smileys' },
  { emoji: '🥰', name: 'smiling hearts', category: 'Smileys' },
  { emoji: '😍', name: 'heart eyes', category: 'Smileys' },
  { emoji: '🤩', name: 'star struck', category: 'Smileys' },
  { emoji: '😘', name: 'kissing heart', category: 'Smileys' },
  { emoji: '😋', name: 'yum', category: 'Smileys' },
  { emoji: '😜', name: 'winking tongue', category: 'Smileys' },
  { emoji: '🤪', name: 'zany', category: 'Smileys' },
  { emoji: '😎', name: 'cool', category: 'Smileys' },

  // ── Gestures (20) ──
  { emoji: '👋', name: 'wave', category: 'Gestures' },
  { emoji: '🤚', name: 'raised back of hand', category: 'Gestures' },
  { emoji: '✋', name: 'raised hand', category: 'Gestures' },
  { emoji: '🖖', name: 'vulcan salute', category: 'Gestures' },
  { emoji: '👌', name: 'ok hand', category: 'Gestures' },
  { emoji: '🤌', name: 'pinched fingers', category: 'Gestures' },
  { emoji: '✌️', name: 'peace', category: 'Gestures' },
  { emoji: '🤞', name: 'crossed fingers', category: 'Gestures' },
  { emoji: '🤟', name: 'love you gesture', category: 'Gestures' },
  { emoji: '🤘', name: 'rock on', category: 'Gestures' },
  { emoji: '🤙', name: 'call me', category: 'Gestures' },
  { emoji: '👈', name: 'point left', category: 'Gestures' },
  { emoji: '👉', name: 'point right', category: 'Gestures' },
  { emoji: '👆', name: 'point up', category: 'Gestures' },
  { emoji: '👇', name: 'point down', category: 'Gestures' },
  { emoji: '👍', name: 'thumbs up', category: 'Gestures' },
  { emoji: '👎', name: 'thumbs down', category: 'Gestures' },
  { emoji: '✊', name: 'fist', category: 'Gestures' },
  { emoji: '👊', name: 'punch', category: 'Gestures' },
  { emoji: '🙌', name: 'raising hands', category: 'Gestures' },

  // ── Hearts (18) ──
  { emoji: '❤️', name: 'red heart', category: 'Hearts' },
  { emoji: '🧡', name: 'orange heart', category: 'Hearts' },
  { emoji: '💛', name: 'yellow heart', category: 'Hearts' },
  { emoji: '💚', name: 'green heart', category: 'Hearts' },
  { emoji: '💙', name: 'blue heart', category: 'Hearts' },
  { emoji: '💜', name: 'purple heart', category: 'Hearts' },
  { emoji: '🖤', name: 'black heart', category: 'Hearts' },
  { emoji: '🤍', name: 'white heart', category: 'Hearts' },
  { emoji: '🤎', name: 'brown heart', category: 'Hearts' },
  { emoji: '💔', name: 'broken heart', category: 'Hearts' },
  { emoji: '❤️‍🔥', name: 'heart on fire', category: 'Hearts' },
  { emoji: '💕', name: 'two hearts', category: 'Hearts' },
  { emoji: '💞', name: 'revolving hearts', category: 'Hearts' },
  { emoji: '💓', name: 'beating heart', category: 'Hearts' },
  { emoji: '💗', name: 'growing heart', category: 'Hearts' },
  { emoji: '💖', name: 'sparkling heart', category: 'Hearts' },
  { emoji: '💘', name: 'cupid heart', category: 'Hearts' },
  { emoji: '💝', name: 'gift heart', category: 'Hearts' },

  // ── Animals (18) ──
  { emoji: '🐱', name: 'cat', category: 'Animals' },
  { emoji: '🐶', name: 'dog', category: 'Animals' },
  { emoji: '🐭', name: 'mouse', category: 'Animals' },
  { emoji: '🐹', name: 'hamster', category: 'Animals' },
  { emoji: '🐰', name: 'rabbit', category: 'Animals' },
  { emoji: '🦊', name: 'fox', category: 'Animals' },
  { emoji: '🐻', name: 'bear', category: 'Animals' },
  { emoji: '🐼', name: 'panda', category: 'Animals' },
  { emoji: '🐨', name: 'koala', category: 'Animals' },
  { emoji: '🐯', name: 'tiger', category: 'Animals' },
  { emoji: '🦁', name: 'lion', category: 'Animals' },
  { emoji: '🐮', name: 'cow', category: 'Animals' },
  { emoji: '🐷', name: 'pig', category: 'Animals' },
  { emoji: '🐸', name: 'frog', category: 'Animals' },
  { emoji: '🐵', name: 'monkey', category: 'Animals' },
  { emoji: '🦋', name: 'butterfly', category: 'Animals' },
  { emoji: '🐧', name: 'penguin', category: 'Animals' },
  { emoji: '🦄', name: 'unicorn', category: 'Animals' },

  // ── Food (18) ──
  { emoji: '🍕', name: 'pizza', category: 'Food' },
  { emoji: '🍔', name: 'burger', category: 'Food' },
  { emoji: '🍟', name: 'fries', category: 'Food' },
  { emoji: '🌭', name: 'hotdog', category: 'Food' },
  { emoji: '🥪', name: 'sandwich', category: 'Food' },
  { emoji: '🌮', name: 'taco', category: 'Food' },
  { emoji: '🍣', name: 'sushi', category: 'Food' },
  { emoji: '🍜', name: 'noodles', category: 'Food' },
  { emoji: '🍩', name: 'donut', category: 'Food' },
  { emoji: '🍪', name: 'cookie', category: 'Food' },
  { emoji: '🎂', name: 'birthday cake', category: 'Food' },
  { emoji: '🍰', name: 'cake', category: 'Food' },
  { emoji: '🍦', name: 'ice cream', category: 'Food' },
  { emoji: '☕', name: 'coffee', category: 'Food' },
  { emoji: '🍵', name: 'tea', category: 'Food' },
  { emoji: '🍺', name: 'beer', category: 'Food' },
  { emoji: '🥤', name: 'cup with straw', category: 'Food' },
  { emoji: '🍷', name: 'wine', category: 'Food' },

  // ── Travel (18) ──
  { emoji: '✈️', name: 'airplane', category: 'Travel' },
  { emoji: '🚀', name: 'rocket', category: 'Travel' },
  { emoji: '🚗', name: 'car', category: 'Travel' },
  { emoji: '🚕', name: 'taxi', category: 'Travel' },
  { emoji: '🚌', name: 'bus', category: 'Travel' },
  { emoji: '🚂', name: 'train', category: 'Travel' },
  { emoji: '🚢', name: 'ship', category: 'Travel' },
  { emoji: '🏍️', name: 'motorcycle', category: 'Travel' },
  { emoji: '🚲', name: 'bicycle', category: 'Travel' },
  { emoji: '🏔️', name: 'mountain', category: 'Travel' },
  { emoji: '🌋', name: 'volcano', category: 'Travel' },
  { emoji: '🏖️', name: 'beach', category: 'Travel' },
  { emoji: '🏝️', name: 'island', category: 'Travel' },
  { emoji: '🗽', name: 'statue of liberty', category: 'Travel' },
  { emoji: '🗼', name: 'tower', category: 'Travel' },
  { emoji: '🏰', name: 'castle', category: 'Travel' },
  { emoji: '🌈', name: 'rainbow', category: 'Travel' },
  { emoji: '🌍', name: 'earth', category: 'Travel' },

  // ── Objects (18) ──
  { emoji: '💡', name: 'light bulb', category: 'Objects' },
  { emoji: '📱', name: 'phone', category: 'Objects' },
  { emoji: '💻', name: 'laptop', category: 'Objects' },
  { emoji: '⌨️', name: 'keyboard', category: 'Objects' },
  { emoji: '🖥️', name: 'desktop', category: 'Objects' },
  { emoji: '📷', name: 'camera', category: 'Objects' },
  { emoji: '📺', name: 'television', category: 'Objects' },
  { emoji: '🎮', name: 'game controller', category: 'Objects' },
  { emoji: '🎧', name: 'headphones', category: 'Objects' },
  { emoji: '🔔', name: 'bell', category: 'Objects' },
  { emoji: '🔑', name: 'key', category: 'Objects' },
  { emoji: '📦', name: 'package', category: 'Objects' },
  { emoji: '✉️', name: 'envelope', category: 'Objects' },
  { emoji: '📝', name: 'memo', category: 'Objects' },
  { emoji: '📚', name: 'books', category: 'Objects' },
  { emoji: '🎨', name: 'art', category: 'Objects' },
  { emoji: '🔮', name: 'crystal ball', category: 'Objects' },
  { emoji: '🧲', name: 'magnet', category: 'Objects' },

  // ── Symbols (18) ──
  { emoji: '⚡', name: 'lightning', category: 'Symbols' },
  { emoji: '🔥', name: 'fire', category: 'Symbols' },
  { emoji: '💧', name: 'water drop', category: 'Symbols' },
  { emoji: '⭐', name: 'star', category: 'Symbols' },
  { emoji: '🌟', name: 'glowing star', category: 'Symbols' },
  { emoji: '💫', name: 'dizzy star', category: 'Symbols' },
  { emoji: '✨', name: 'sparkles', category: 'Symbols' },
  { emoji: '💥', name: 'boom', category: 'Symbols' },
  { emoji: '🎯', name: 'bullseye', category: 'Symbols' },
  { emoji: '🏆', name: 'trophy', category: 'Symbols' },
  { emoji: '🥇', name: 'gold medal', category: 'Symbols' },
  { emoji: '💰', name: 'money bag', category: 'Symbols' },
  { emoji: '💎', name: 'gem', category: 'Symbols' },
  { emoji: '♻️', name: 'recycle', category: 'Symbols' },
  { emoji: '♾️', name: 'infinity', category: 'Symbols' },
  { emoji: '🔴', name: 'red circle', category: 'Symbols' },
  { emoji: '🟢', name: 'green circle', category: 'Symbols' },
  { emoji: '🔵', name: 'blue circle', category: 'Symbols' },
];

/* ─── FAQ & Related Tools ─── */
const faqItems = [
  {
    question: 'How do I copy an emoji?',
    answer:
      'Simply click on any emoji and it will be instantly copied to your clipboard. A "Copied!" confirmation will appear briefly. The emoji is also added to the text area at the top where you can collect multiple emojis.',
  },
  {
    question: 'Can I copy multiple emojis at once?',
    answer:
      'Yes! Click on multiple emojis to add them to the text area. Then use the "Copy All" button to copy the entire contents of the text area to your clipboard at once.',
  },
  {
    question: 'What are recent emojis?',
    answer:
      'The Recent Emojis section keeps track of the last 10 emojis you have copied. This makes it easy to quickly access your most-used emojis without searching or browsing categories.',
  },
  {
    question: 'Does this work on mobile devices?',
    answer:
      'Absolutely! The Emoji Keyboard is fully responsive and works great on phones and tablets. Simply tap any emoji to copy it, just like on desktop.',
  },
];

const relatedTools = [
  {
    name: 'Word Counter',
    hash: '#/tools/word-counter',
    description: 'Count words, characters, and more in your text.',
  },
  {
    name: 'Text to Speech',
    hash: '#/tools/text-to-speech',
    description: 'Convert text to natural speech with browser synthesis.',
  },
  {
    name: 'JSON Formatter',
    hash: '#/tools/json-formatter',
    description: 'Format, validate, and beautify JSON data.',
  },
];

/* ─── Component ─── */
export default function EmojiKeyboard({ onNavigate }: EmojiKeyboardProps) {
  const [activeCategory, setActiveCategory] = useState<EmojiCategory>('Smileys');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);

  /* Filter emojis by search or category */
  const filteredEmojis = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return EMOJI_DATA.filter((e) => e.name.toLowerCase().includes(q));
    }
    return EMOJI_DATA.filter((e) => e.category === activeCategory);
  }, [searchQuery, activeCategory]);

  /* Copy a single emoji */
  const handleCopyEmoji = useCallback(async (item: EmojiItem) => {
    try {
      await navigator.clipboard.writeText(item.emoji);
      setCopiedId(item.emoji);
      setSelectedText((prev) => prev + item.emoji);
      setRecentEmojis((prev) => {
        const next = [item.emoji, ...prev.filter((r) => r !== item.emoji)];
        return next.slice(0, 10);
      });
      toast.success(`Copied ${item.emoji}`);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      toast.error('Failed to copy emoji');
    }
  }, []);

  /* Copy all from text area */
  const handleCopyAll = useCallback(async () => {
    if (!selectedText) return;
    try {
      await navigator.clipboard.writeText(selectedText);
      setCopiedAll(true);
      toast.success('All emojis copied!');
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  }, [selectedText]);

  /* Clear text area */
  const handleClear = useCallback(() => {
    setSelectedText('');
  }, []);

  return (
    <ToolLayout
      title="Emoji Keyboard"
      description="Browse and copy emojis easily - click to copy!"
      icon={Smile}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {/* ── Selected text area ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white">Selected Emojis</label>
            <span className="text-xs text-[#555555]">
              {selectedText.length} character{selectedText.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="relative">
            <textarea
              value={selectedText}
              onChange={(e) => setSelectedText(e.target.value)}
              placeholder="Click emojis below to add them here..."
              rows={3}
              className="w-full rounded-xl bg-black/40 border border-[#222222] px-4 py-3 text-white text-lg leading-relaxed resize-none focus:outline-none focus:border-[#8A2BE2]/50 focus:ring-1 focus:ring-[#8A2BE2]/20 transition-all placeholder:text-[#444444]"
              aria-label="Selected emojis text area"
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleCopyAll}
              disabled={!selectedText}
              className="flex-1 h-11 cta-primary font-semibold"
              size="lg"
            >
              {copiedAll ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </>
              )}
            </Button>
            <Button
              onClick={handleClear}
              disabled={!selectedText}
              variant="outline"
              className="h-11 px-5 border-[#222222] text-[#AAAAAA] hover:text-white hover:border-[#8A2BE2]/40 hover:bg-white/5 transition-all"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* ── Search bar ── */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search emojis by name..."
            className="w-full rounded-xl bg-black/40 border border-[#222222] pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#8A2BE2]/50 focus:ring-1 focus:ring-[#8A2BE2]/20 transition-all placeholder:text-[#444444]"
            aria-label="Search emojis"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555555] hover:text-white transition-colors text-xs"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* ── Recent emojis ── */}
        {recentEmojis.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-[#AAAAAA]">Recent</h3>
            <div className="flex flex-wrap gap-1.5">
              {recentEmojis.map((emoji) => {
                const item = EMOJI_DATA.find((e) => e.emoji === emoji);
                return (
                  <button
                    key={`recent-${emoji}`}
                    onClick={() => item && handleCopyEmoji(item)}
                    className="h-10 w-10 flex items-center justify-center rounded-lg bg-black/30 border border-[#1a1a1a] hover:border-[#8A2BE2]/30 hover:bg-[#8A2BE2]/10 hover:scale-110 transition-all duration-200 text-xl"
                    title={item?.name ?? emoji}
                    aria-label={`Copy ${item?.name ?? emoji}`}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Category tabs ── */}
        {!searchQuery && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
            {CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat];
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 shrink-0 ${
                    isActive
                      ? 'bg-[#8A2BE2]/15 border border-[#8A2BE2]/30 text-white'
                      : 'bg-black/20 border border-[#1a1a1a] text-[#AAAAAA] hover:border-[#8A2BE2]/20 hover:text-white'
                  }`}
                  aria-pressed={isActive}
                >
                  <span className="text-base">{meta.icon}</span>
                  {meta.label}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Search results info ── */}
        {searchQuery && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#555555]">
              {filteredEmojis.length} result{filteredEmojis.length !== 1 ? 's' : ''} for &ldquo;
              <span className="text-[#AAAAAA]">{searchQuery}</span>&rdquo;
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#8A2BE2] hover:text-[#00FFFF] transition-colors"
            >
              Clear search
            </button>
          </div>
        )}

        {/* ── Emoji grid ── */}
        {filteredEmojis.length > 0 ? (
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
            {filteredEmojis.map((item) => {
              const isCopied = copiedId === item.emoji;
              return (
                <button
                  key={`${item.category}-${item.name}`}
                  onClick={() => handleCopyEmoji(item)}
                  className={`relative h-11 w-11 sm:h-12 sm:w-12 flex items-center justify-center rounded-xl text-xl sm:text-2xl transition-all duration-200 group ${
                    isCopied
                      ? 'bg-[#8A2BE2]/20 border border-[#8A2BE2]/40 scale-110'
                      : 'bg-black/20 border border-[#1a1a1a] hover:border-[#8A2BE2]/30 hover:bg-[#8A2BE2]/10 hover:scale-110'
                  }`}
                  title={item.name}
                  aria-label={`Copy ${item.name} ${item.emoji}`}
                >
                  {item.emoji}
                  {/* Copied overlay */}
                  {isCopied && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#8A2BE2]">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </span>
                  )}
                  {/* Tooltip on hover */}
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-sm text-[#555555]">No emojis found for &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-xs text-[#444444] mt-1">Try a different search term</p>
          </div>
        )}

        {/* ── Category stats ── */}
        {!searchQuery && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="text-xs text-[#444444]">
              {CATEGORY_META[activeCategory].icon} {filteredEmojis.length} emojis in {activeCategory}
            </span>
            <span className="text-[#333333]">·</span>
            <span className="text-xs text-[#444444]">{EMOJI_DATA.length} total</span>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
