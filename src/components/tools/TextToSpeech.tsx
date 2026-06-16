'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, Play, Pause, Square, VolumeX } from 'lucide-react';
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
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'What languages and voices are supported?',
    answer:
      'The available voices depend on your operating system and browser. Chrome typically offers the most voices including multiple languages (English, Spanish, French, German, Chinese, Japanese, and many more). You can select any voice from the dropdown menu. The quality and naturalness of voices vary by provider — system voices tend to sound more robotic, while cloud-based voices (available in Chrome) sound more natural.',
  },
  {
    question: 'Which browsers support the Web Speech API?',
    answer:
      'The Web Speech API is supported in all modern browsers including Chrome, Firefox, Safari, and Edge. Chrome typically offers the most voices and best quality. Some browsers may have limited voice options depending on your operating system. If you don\'t see any voices in the selector, try refreshing the page or using Chrome.',
  },
  {
    question: 'Can I download the speech as an audio file?',
    answer:
      'The Web Speech API does not natively support exporting speech to audio files. This tool plays the speech directly through your browser\'s audio output. To save the audio, you can use your operating system\'s screen recording feature or a third-party audio capture tool while the speech is playing.',
  },
  {
    question: 'How do I adjust the speed, pitch, and volume?',
    answer:
      'Use the sliders below the text area to fine-tune the output. The speed (rate) ranges from 0.5x (half speed) to 2x (double speed). Pitch ranges from 0.5 (low) to 2.0 (high). Volume ranges from 0 (mute) to 1 (maximum). The defaults are 1x speed, 1.0 pitch, and 1.0 volume. Adjustments take effect the next time you press Play.',
  },
  {
    question: 'Is the voice quality natural-sounding?',
    answer:
      'Voice quality varies significantly depending on the voice selected and your browser. Chrome\'s cloud-based voices (typically labeled "Google") tend to sound the most natural. System-provided voices may sound more robotic. The quality is continuously improving as browser vendors update their speech synthesis engines. For the best experience, we recommend using Chrome and selecting a Google voice.',
  },
];

const relatedTools = [
  {
    name: 'Speech to Text',
    hash: '/tools/speech-to-text',
    description: 'Convert spoken words to text using your microphone.',
  },
  {
    name: 'Word Counter',
    hash: '/tools/word-counter',
    description: 'Count words, characters, and more in your text.',
  },
  {
    name: 'QR Code Generator',
    hash: '/tools/qr-code-generator',
    description: 'Generate QR codes from URLs or text.',
  },
];

interface VoiceOption {
  voice: SpeechSynthesisVoice;
  label: string;
}

interface TextToSpeechProps {
  onNavigate: (hash: string) => void;
}

export default function TextToSpeech({ onNavigate }: TextToSpeechProps) {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length === 0) return;

      const voiceOptions: VoiceOption[] = availableVoices.map((voice) => ({
        voice,
        label: `${voice.name} (${voice.lang})${voice.default ? ' — Default' : ''}`,
      }));

      setVoices(voiceOptions);

      // Set default voice
      const defaultVoice = availableVoices.find((v) => v.default) || availableVoices[0];
      setSelectedVoiceName(defaultVoice.name);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handlePlay = useCallback(() => {
    if (!text.trim()) {
      toast.error('Please enter some text to speak');
      return;
    }

    // If paused, resume
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    const voice = voices.find((v) => v.voice.name === selectedVoiceName);
    if (voice) {
      utterance.voice = voice.voice;
    }

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      if (event.error !== 'canceled') {
        console.error('Speech error:', event.error);
        toast.error('Speech synthesis error. Please try again.');
      }
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  }, [text, isPaused, voices, selectedVoiceName, rate, pitch, volume]);

  const handlePause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  }, []);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Average speech rate is ~150 words per minute at rate 1.0
  const estimatedDuration = wordCount > 0 ? Math.ceil((wordCount / (150 * rate)) * 60) : 0;

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <ToolLayout
      title="Text to Speech"
      description="Convert any text to natural-sounding speech using your browser's built-in speech synthesis engine. Adjust speed, pitch, and volume to customize the output. Supports multiple languages and voices — all processing happens locally on your device."
      icon={Volume2}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
      seoContent={`
        <h2>Free Text to Speech — Convert Text to Natural-Sounding Speech Online</h2>
        <p>Text-to-speech (TTS) technology converts written text into spoken audio, making content accessible to people with visual impairments, reading disabilities, or anyone who prefers listening over reading. Our free online Text to Speech tool uses your browser's built-in Web Speech API to generate natural-sounding speech from any text, with full control over voice selection, speed, pitch, and volume. All processing happens locally on your device.</p>
        <h3>Accessibility and Inclusive Design</h3>
        <p>Text-to-speech is a cornerstone of web accessibility. The Web Content Accessibility Guidelines (WCAG) recommend providing text alternatives for non-text content and ensuring content is operable and understandable. TTS tools help people with dyslexia, low vision, cognitive disabilities, and those learning a new language access written content more easily. By offering a speech output option, content creators and educators can reach a broader audience and comply with accessibility regulations like the ADA and Section 508.</p>
        <h3>Applications of Text-to-Speech Technology</h3>
        <p>Beyond accessibility, TTS has numerous practical applications. Students use it to review study materials while commuting or exercising. Professionals listen to reports and emails hands-free while multitasking. Language learners practice pronunciation by hearing native-sounding speech. Writers proofread their work by listening to it, catching errors that the eye might miss. Content creators generate voiceovers for videos and podcasts without recording equipment. The Web Speech API makes all of these use cases possible directly in the browser with no software installation.</p>
        <h3>Key Features</h3>
        <ul>
          <li>Multiple voice options including system voices and cloud-based voices (browser dependent)</li>
          <li>Adjustable speech rate from 0.5x (half speed) to 2.0x (double speed)</li>
          <li>Pitch control from low (0.5) to high (2.0) for natural-sounding output</li>
          <li>Volume adjustment from mute to maximum</li>
          <li>Play, pause, and stop controls for full playback management</li>
          <li>Estimated speech duration display based on word count and selected rate</li>
          <li>Support for multiple languages including English, Spanish, French, German, Chinese, Japanese, and more</li>
        </ul>
        <h3>Tips for Best Results</h3>
        <ul>
          <li>Use Google Chrome for the largest selection of natural-sounding voices</li>
          <li>Select a Google-branded voice for the most human-like speech quality</li>
          <li>Set the rate to 0.9x–1.0x for natural pacing when proofreading</li>
          <li>Use 1.2x–1.5x speed for efficient content consumption when reviewing material</li>
        </ul>
      `}
    >
      <div className="space-y-6">
        {/* Textarea */}
        <div>
          <Label className="text-sm font-medium text-white mb-2 block">
            Enter Text
          </Label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste the text you want to hear spoken aloud..."
            rows={6}
            className="w-full bg-black/40 border border-[#222222] rounded-xl p-3 text-white placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:outline-none transition-colors resize-y"
          />
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-[#888888]">
              {charCount} character{charCount !== 1 ? 's' : ''}
            </span>
            <span className="text-xs text-[#888888]">
              {wordCount} word{wordCount !== 1 ? 's' : ''}
            </span>
            {estimatedDuration > 0 && (
              <span className="text-xs text-[#8A2BE2]">
                ~{formatDuration(estimatedDuration)} estimated
              </span>
            )}
          </div>
        </div>

        {/* Voice Selector */}
        <div>
          <Label className="text-sm font-medium text-white mb-2 block">
            Voice
          </Label>
          {voices.length > 0 ? (
            <Select value={selectedVoiceName} onValueChange={setSelectedVoiceName}>
              <SelectTrigger className="w-full bg-black/40 border border-[#222222] text-white">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent className="bg-[#111111] border-[#222222] max-h-64">
                {voices.map((v) => (
                  <SelectItem key={v.voice.name} value={v.voice.name}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="p-3 rounded-xl bg-black/20 border border-[#1a1a1a] text-sm text-[#555555]">
              Loading voices... If none appear, your browser may not support the Web Speech API.
            </div>
          )}
        </div>

        {/* Rate Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-white">
              Speed (Rate)
            </Label>
            <span className="text-sm font-mono text-[#8A2BE2] font-bold">
              {rate.toFixed(1)}x
            </span>
          </div>
          <Slider
            value={[rate]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={(value) => setRate(value[0])}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[#555555]">0.5x</span>
            <span className="text-[10px] text-[#555555]">1.0x</span>
            <span className="text-[10px] text-[#555555]">2.0x</span>
          </div>
        </div>

        {/* Pitch Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-white">
              Pitch
            </Label>
            <span className="text-sm font-mono text-[#8A2BE2] font-bold">
              {pitch.toFixed(1)}
            </span>
          </div>
          <Slider
            value={[pitch]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={(value) => setPitch(value[0])}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[#555555]">Low (0.5)</span>
            <span className="text-[10px] text-[#555555]">Normal (1.0)</span>
            <span className="text-[10px] text-[#555555]">High (2.0)</span>
          </div>
        </div>

        {/* Volume Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-white flex items-center gap-2">
              {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              Volume
            </Label>
            <span className="text-sm font-mono text-[#8A2BE2] font-bold">
              {Math.round(volume * 100)}%
            </span>
          </div>
          <Slider
            value={[volume]}
            min={0}
            max={1}
            step={0.05}
            onValueChange={(value) => setVolume(value[0])}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[#555555]">Mute</span>
            <span className="text-[10px] text-[#555555]">50%</span>
            <span className="text-[10px] text-[#555555]">100%</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-3 p-5 rounded-xl bg-black/30 border border-[#1a1a1a]">
          <Button
            onClick={handlePlay}
            disabled={!text.trim() || isPlaying}
            className="cta-primary h-12 w-12 rounded-full p-0 flex items-center justify-center"
            size="icon"
            aria-label="Play"
          >
            <Play className="h-5 w-5" />
          </Button>
          <Button
            onClick={handlePause}
            disabled={!isPlaying}
            variant="outline"
            className="border-[#222222] text-white hover:border-[#8A2BE2]/50 hover:bg-[#8A2BE2]/10 h-12 w-12 rounded-full p-0 flex items-center justify-center"
            size="icon"
            aria-label="Pause"
          >
            <Pause className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            variant="outline"
            className="border-[#222222] text-white hover:border-red-400/50 hover:bg-red-400/10 h-12 w-12 rounded-full p-0 flex items-center justify-center"
            size="icon"
            aria-label="Stop"
          >
            <Square className="h-5 w-5" />
          </Button>

          <div className="ml-4 flex items-center gap-2">
            {isPlaying && (
              <span className="text-sm text-[#00FFFF] flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-[#00FFFF] animate-pulse" />
                Speaking...
              </span>
            )}
            {isPaused && (
              <span className="text-sm text-[#AAAAAA]">Paused</span>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
