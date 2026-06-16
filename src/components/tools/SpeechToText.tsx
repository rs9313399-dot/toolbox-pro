'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Copy, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
    question: 'Which languages are supported?',
    answer:
      'The Web Speech API supports a wide range of languages including English, Spanish, French, German, Chinese, Japanese, Korean, Portuguese, Russian, Arabic, Hindi, and many more. The exact list depends on your browser and operating system. Chrome typically offers the broadest language support.',
  },
  {
    question: 'Which browsers support Speech Recognition?',
    answer:
      'Speech Recognition is primarily supported in Chrome, Edge, and Safari (with some limitations). Firefox has limited or no support for the Web Speech API. For the best experience, we recommend using Google Chrome or Microsoft Edge.',
  },
  {
    question: 'How accurate is the speech recognition?',
    answer:
      'Accuracy depends on several factors: your microphone quality, background noise, speaking clarity, and the language/dialect selected. In optimal conditions (quiet environment, good microphone, clear speech), accuracy can exceed 95%. Using the correct language/dialect setting significantly improves results.',
  },
  {
    question: 'Is my voice data sent to a server?',
    answer:
      'The Web Speech API in Chrome does send audio data to Google servers for processing. However, the data is not stored and is only used for the recognition request. In browsers that support offline recognition (some Safari configurations), processing happens entirely on your device. No data is stored on our servers.',
  },
  {
    question: 'What is continuous recognition mode?',
    answer:
      'Continuous recognition mode keeps the microphone active and continues transcribing speech until you manually stop it. Without continuous mode, recognition stops automatically after a pause in speech. Enable continuous mode for longer dictation sessions.',
  },
];

const relatedTools = [
  {
    name: 'Text to Speech',
    hash: '/tools/text-to-speech',
    description: 'Convert text to spoken audio using browser speech synthesis.',
  },
  {
    name: 'Word Counter',
    hash: '/tools/word-counter',
    description: 'Count words, characters, and more in your text.',
  },
  {
    name: 'JSON Formatter',
    hash: '/tools/json-formatter',
    description: 'Format, validate, and beautify JSON data.',
  },
];

const LANGUAGES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'es-ES', label: 'Spanish (Spain)' },
  { code: 'fr-FR', label: 'French' },
  { code: 'de-DE', label: 'German' },
  { code: 'it-IT', label: 'Italian' },
  { code: 'pt-BR', label: 'Portuguese (Brazil)' },
  { code: 'ru-RU', label: 'Russian' },
  { code: 'ja-JP', label: 'Japanese' },
  { code: 'ko-KR', label: 'Korean' },
  { code: 'zh-CN', label: 'Chinese (Simplified)' },
  { code: 'zh-TW', label: 'Chinese (Traditional)' },
  { code: 'ar-SA', label: 'Arabic' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'nl-NL', label: 'Dutch' },
  { code: 'pl-PL', label: 'Polish' },
  { code: 'sv-SE', label: 'Swedish' },
  { code: 'tr-TR', label: 'Turkish' },
];

type RecognitionStatus = 'idle' | 'recording' | 'processing';

interface SpeechToTextProps {
  onNavigate: (hash: string) => void;
}

export default function SpeechToText({ onNavigate }: SpeechToTextProps) {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [status, setStatus] = useState<RecognitionStatus>('idle');
  const [language, setLanguage] = useState('en-US');
  const [continuous, setContinuous] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSupported] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  });
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition> | null>(null);
  const transcriptRef = useRef('');

  const startRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setStatus('recording');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalTranscript) {
        transcriptRef.current = transcriptRef.current + finalTranscript;
        setTranscript(transcriptRef.current);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: Event) => {
      const errorEvent = event as unknown as { error: string };
      if (errorEvent.error === 'not-allowed') {
        toast.error('Microphone access denied. Please allow microphone access and try again.');
      } else if (errorEvent.error === 'no-speech') {
        // Silent - no speech detected, just restart if continuous
        if (continuous && status === 'recording') {
          try {
            recognition.start();
          } catch {
            // Ignore restart errors
          }
        }
      } else if (errorEvent.error !== 'aborted') {
        toast.error(`Speech recognition error: ${errorEvent.error}`);
      }
      setStatus('idle');
    };

    recognition.onend = () => {
      // If continuous mode and still supposed to be recording, restart
      if (continuous && status === 'recording') {
        try {
          recognition.start();
        } catch {
          setStatus('idle');
        }
      } else {
        setStatus('idle');
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      toast.error('Failed to start speech recognition. Please try again.');
    }
  }, [language, continuous, status]);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setStatus('idle');
    setInterimTranscript('');
  }, []);

  const handleCopy = async () => {
    if (!transcript) return;
    try {
      await navigator.clipboard.writeText(transcript);
      setCopied(true);
      toast.success('Transcript copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy transcript');
    }
  };

  const handleClear = () => {
    stopRecognition();
    setTranscript('');
    setInterimTranscript('');
    transcriptRef.current = '';
    toast.success('Transcript cleared');
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  if (!isSupported) {
    return (
      <ToolLayout
        title="Speech to Text"
        description="Convert your voice to text in real-time using your browser's speech recognition engine. Perfect for dictation, note-taking, and accessibility. Supports multiple languages and works entirely in your browser with no server processing."
        icon={Mic}
        faqItems={faqItems}
        relatedTools={relatedTools}
        onNavigate={onNavigate}
        seoContent={`
          <h2>Speech to Text — Free Online Voice Dictation and Transcription</h2>
          <p>Speech-to-text technology, also known as speech recognition or voice dictation, converts spoken words into written text in real time. Our free online Speech to Text tool uses your browser's built-in Web Speech API to transcribe your voice directly in the browser, with no software installation or account required. Simply click the microphone button, start speaking, and watch your words appear as text instantly.</p>
          <h3>Accessibility Benefits of Voice Typing</h3>
          <p>Voice dictation is a game-changer for accessibility. People with motor disabilities, repetitive strain injuries, or conditions like carpal tunnel syndrome can compose text without typing. Individuals with dyslexia or other learning disabilities can express their thoughts more fluently through speech than through writing. Multilingual users can dictate in their preferred language, with support for over 15 languages including English, Spanish, French, German, Chinese, Japanese, Arabic, and Hindi. The Web Speech API makes these accessibility features available to everyone with just a web browser.</p>
          <h3>Use Cases for Speech Recognition</h3>
          <p>Beyond accessibility, speech-to-text has countless practical applications. Students record lecture notes without looking away from the board. Professionals dictate emails and documents while on the go. Writers capture ideas and first drafts through natural speech, overcoming writer's block. Journalists transcribe interviews in real time. Customer service teams create call summaries automatically. Medical professionals dictate clinical notes hands-free. Continuous recognition mode keeps the microphone active for extended dictation sessions, making it ideal for long-form content creation.</p>
          <h3>Key Features</h3>
          <ul>
            <li>Real-time transcription with interim results shown as you speak</li>
            <li>18 supported languages including English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, and Hindi</li>
            <li>Continuous recognition mode for extended dictation sessions</li>
            <li>One-click copy of the full transcript to clipboard</li>
            <li>Word count and character count displayed in real time</li>
            <li>Browser-based processing — no software download required</li>
          </ul>
          <h3>Tips for Accurate Transcription</h3>
          <ul>
            <li>Use a quality microphone in a quiet environment for best accuracy</li>
            <li>Speak clearly and at a moderate pace — rushing reduces accuracy</li>
            <li>Select the correct language and dialect for your speech (e.g., en-US vs en-GB)</li>
            <li>Enable continuous mode for longer dictation to avoid interruptions</li>
            <li>Use Google Chrome or Microsoft Edge for the most reliable speech recognition performance</li>
          </ul>
        `}
      >
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MicOff className="h-16 w-16 text-[#555555] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Browser Not Supported
          </h3>
          <p className="text-sm text-[#888888] max-w-md">
            Speech recognition is not available in your browser. Please use Google Chrome or Microsoft Edge for the best experience.
          </p>
        </div>
      </ToolLayout>
    );
  }

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  const charCount = transcript.length;

  return (
    <ToolLayout
      title="Speech to Text"
      description="Convert your voice to text in real-time using your browser's speech recognition engine. Perfect for dictation, note-taking, and accessibility. Supports multiple languages and works entirely in your browser with no server processing."
      icon={Mic}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
      seoContent={`
        <h2>Speech to Text — Free Online Voice Dictation and Transcription</h2>
        <p>Speech-to-text technology, also known as speech recognition or voice dictation, converts spoken words into written text in real time. Our free online Speech to Text tool uses your browser's built-in Web Speech API to transcribe your voice directly in the browser, with no software installation or account required. Simply click the microphone button, start speaking, and watch your words appear as text instantly.</p>
        <h3>Accessibility Benefits of Voice Typing</h3>
        <p>Voice dictation is a game-changer for accessibility. People with motor disabilities, repetitive strain injuries, or conditions like carpal tunnel syndrome can compose text without typing. Individuals with dyslexia or other learning disabilities can express their thoughts more fluently through speech than through writing. Multilingual users can dictate in their preferred language, with support for over 15 languages including English, Spanish, French, German, Chinese, Japanese, Arabic, and Hindi. The Web Speech API makes these accessibility features available to everyone with just a web browser.</p>
        <h3>Use Cases for Speech Recognition</h3>
        <p>Beyond accessibility, speech-to-text has countless practical applications. Students record lecture notes without looking away from the board. Professionals dictate emails and documents while on the go. Writers capture ideas and first drafts through natural speech, overcoming writer's block. Journalists transcribe interviews in real time. Customer service teams create call summaries automatically. Medical professionals dictate clinical notes hands-free. Continuous recognition mode keeps the microphone active for extended dictation sessions, making it ideal for long-form content creation.</p>
        <h3>Key Features</h3>
        <ul>
          <li>Real-time transcription with interim results shown as you speak</li>
          <li>18 supported languages including English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, and Hindi</li>
          <li>Continuous recognition mode for extended dictation sessions</li>
          <li>One-click copy of the full transcript to clipboard</li>
          <li>Word count and character count displayed in real time</li>
          <li>Browser-based processing — no software download required</li>
        </ul>
        <h3>Tips for Accurate Transcription</h3>
        <ul>
          <li>Use a quality microphone in a quiet environment for best accuracy</li>
          <li>Speak clearly and at a moderate pace — rushing reduces accuracy</li>
          <li>Select the correct language and dialect for your speech (e.g., en-US vs en-GB)</li>
          <li>Enable continuous mode for longer dictation to avoid interruptions</li>
          <li>Use Google Chrome or Microsoft Edge for the most reliable speech recognition performance</li>
        </ul>
      `}
    >
      <div className="space-y-6">
        {/* Language Selector */}
        <div>
          <Label className="text-sm font-medium text-white mb-2 block">
            Language
          </Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full bg-black/40 border border-[#222222] text-white">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-[#111111] border-[#222222] max-h-64">
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Continuous Mode Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-[#1a1a1a]">
          <div>
            <Label className="text-sm font-medium text-white">
              Continuous Mode
            </Label>
            <p className="text-xs text-[#888888] mt-0.5">
              Keep listening until you manually stop
            </p>
          </div>
          <Switch
            checked={continuous}
            onCheckedChange={setContinuous}
            disabled={status === 'recording'}
          />
        </div>

        {/* Record Button */}
        <div className="flex flex-col items-center gap-4 py-6">
          <button
            onClick={status === 'recording' ? stopRecognition : startRecognition}
            className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 ${
              status === 'recording'
                ? 'bg-red-500/20 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
                : 'bg-[#8A2BE2]/10 border-2 border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/20 hover:border-[#8A2BE2]/60 hover:shadow-[0_0_30px_rgba(138,43,226,0.2)]'
            }`}
            aria-label={status === 'recording' ? 'Stop recording' : 'Start recording'}
          >
            {status === 'recording' ? (
              <>
                <span className="absolute inset-0 rounded-full animate-ping bg-red-500/20" />
                <MicOff className="h-8 w-8 text-red-400 relative z-10" />
              </>
            ) : (
              <Mic className="h-8 w-8 text-[#8A2BE2]" />
            )}
          </button>
          <div className="text-center">
            {status === 'recording' ? (
              <span className="text-sm text-red-400 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                Recording... Click to stop
              </span>
            ) : (
              <span className="text-sm text-[#888888]">Click to start recording</span>
            )}
          </div>
        </div>

        {/* Transcript Display */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium text-white">
              Transcript
            </Label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#888888]">
                {wordCount} word{wordCount !== 1 ? 's' : ''}
              </span>
              <span className="text-xs text-[#888888]">
                {charCount} char{charCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="min-h-[200px] max-h-[400px] overflow-y-auto rounded-xl bg-black/40 border border-[#222222] p-4">
            {transcript || interimTranscript ? (
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                {transcript}
                {interimTranscript && (
                  <span className="text-[#8A2BE2]/60">{interimTranscript}</span>
                )}
              </p>
            ) : (
              <p className="text-[#555555] text-sm italic">
                Your speech will appear here as you speak...
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleCopy}
            disabled={!transcript}
            variant="outline"
            className="flex-1 border-[#222222] text-white hover:border-[#8A2BE2]/50 hover:bg-[#8A2BE2]/10"
          >
            {copied ? (
              <Check className="h-4 w-4 mr-2 text-green-400" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copied ? 'Copied!' : 'Copy Transcript'}
          </Button>
          <Button
            onClick={handleClear}
            disabled={!transcript && status === 'idle'}
            variant="outline"
            className="flex-1 border-[#222222] text-white hover:border-red-400/50 hover:bg-red-400/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
