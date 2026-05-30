'use client';

import { useState, useCallback, useRef } from 'react';
import { Film, Upload, Download, Play, Pause, Volume2, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

/* ─── FAQ Items ─── */
const faqItems = [
  {
    question: 'What video formats are supported?',
    answer:
      'Our Video to Audio converter supports MP4, WebM, OGG, and MOV video formats. The browser decodes the video and extracts the audio track using the Web Audio API, then re-encodes it as a downloadable audio file.',
  },
  {
    question: 'What audio format will I get?',
    answer:
      'The extracted audio is exported in WebM format (Opus codec) which is widely supported by modern browsers and media players. The file will have a .webm extension and can be played in Chrome, Firefox, VLC, and most modern media players.',
  },
  {
    question: 'Is there a file size limit?',
    answer:
      'The tool supports video files up to 500MB. However, very large files may take longer to process depending on your device capabilities. For best performance, we recommend files under 100MB.',
  },
  {
    question: 'Is my video uploaded to a server?',
    answer:
      'No. Your video is processed entirely in your browser using the Web Audio API. The video file never leaves your device, and no data is sent to any server. Your privacy is completely protected.',
  },
  {
    question: 'Why is the audio quality different from the original?',
    answer:
      'The audio is re-encoded during the extraction process, which may result in slight quality differences. The quality is generally very good for most purposes. For lossless extraction, you would need desktop software like FFmpeg.',
  },
];

/* ─── Related Tools ─── */
const relatedTools = [
  {
    name: 'Image Compressor',
    hash: '#/tools/image-compressor',
    description: 'Compress images for faster sharing.',
  },
  {
    name: 'YouTube Thumbnail',
    hash: '#/tools/youtube-thumbnail',
    description: 'Download YouTube video thumbnails.',
  },
  {
    name: 'Text to Speech',
    hash: '#/tools/text-to-speech',
    description: 'Convert text to natural speech.',
  },
];

/* ─── Component ─── */
interface VideoToAudioProps {
  onNavigate: (hash: string) => void;
}

export default function VideoToAudio({ onNavigate }: VideoToAudioProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* Handle file selection */
  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file (MP4, WebM, OGG, MOV)');
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      toast.error('Video must be less than 500MB');
      return;
    }

    // Clean up previous URLs
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (audioUrl) URL.revokeObjectURL(audioUrl);

    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setAudioUrl(null);
    setAudioDuration('');
  }, [videoUrl, audioUrl]);

  /* Extract audio from video */
  const handleExtract = useCallback(async () => {
    if (!videoFile) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const audioContext = new AudioContext();
      const arrayBuffer = await videoFile.arrayBuffer();
      setProgress(20);

      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      setProgress(50);

      // Create OfflineAudioContext for rendering
      const offlineCtx = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineCtx.destination);
      source.start();

      setProgress(70);
      const renderedBuffer = await offlineCtx.startRendering();
      setProgress(85);

      // Convert to WAV
      const wavBlob = audioBufferToWav(renderedBuffer);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);

      // Calculate duration
      const duration = audioBuffer.duration;
      const mins = Math.floor(duration / 60);
      const secs = Math.floor(duration % 60);
      setAudioDuration(`${mins}:${secs.toString().padStart(2, '0')}`);

      setProgress(100);
      toast.success('Audio extracted successfully!');
      audioContext.close();
    } catch (error) {
      console.error('Extraction Error:', error);
      toast.error('Failed to extract audio. Try a different video format.');
    } finally {
      setIsProcessing(false);
    }
  }, [videoFile]);

  /* Convert AudioBuffer to WAV Blob */
  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const dataLength = buffer.length * blockAlign;
    const headerLength = 44;
    const totalLength = headerLength + dataLength;

    const arrayBuffer = new ArrayBuffer(totalLength);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, totalLength - 8, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataLength, true);

    // Write interleaved samples
    const channels: Float32Array[] = [];
    for (let i = 0; i < numChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        const sample = Math.max(-1, Math.min(1, channels[ch][i]));
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  /* Download audio */
  const handleDownload = useCallback(() => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    const baseName = videoFile?.name.replace(/\.[^/.]+$/, '') || 'audio';
    a.download = `${baseName}-extracted.wav`;
    a.click();
    toast.success('Audio downloaded!');
  }, [audioUrl, videoFile]);

  /* Play/Pause audio */
  const togglePlay = useCallback(() => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [audioUrl, isPlaying]);

  /* Reset */
  const handleReset = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setVideoFile(null);
    setVideoUrl(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setAudioDuration('');
  }, [videoUrl, audioUrl]);

  /* Format file size */
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <ToolLayout
      title="Video to Audio Converter"
      description="Extract audio from video files. Upload a video and download the audio track instantly."
      icon={Film}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {/* Upload Area */}
        {!videoFile ? (
          <div
            className="relative border-2 border-dashed border-[#222222] hover:border-[#8A2BE2]/50 rounded-2xl p-12 text-center transition-all duration-300 bg-black/20"
          >
            <Film className="h-12 w-12 text-[#555555] mx-auto mb-4" />
            <p className="text-white font-semibold mb-2">
              Drop your video here or click to upload
            </p>
            <p className="text-sm text-[#555555] mb-6">
              Supports MP4, WebM, OGG, MOV (Max 500MB)
            </p>
            <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl cta-primary text-white text-sm font-semibold cursor-pointer">
              <Upload className="h-4 w-4" />
              Choose Video
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Video Preview */}
            {videoUrl && (
              <div className="relative rounded-xl overflow-hidden border border-[#1a1a1a]">
                <video
                  src={videoUrl}
                  controls
                  className="w-full max-h-72 bg-black"
                  preload="metadata"
                />
              </div>
            )}

            {/* File Info */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-[#1a1a1a]">
              <div>
                <p className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-[400px]">
                  {videoFile.name}
                </p>
                <p className="text-xs text-[#888888] mt-1">
                  {formatSize(videoFile.size)} · {videoFile.type}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="p-2 rounded-lg text-[#555555] hover:text-red-400 hover:bg-red-500/10 transition-all"
                aria-label="Remove video"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Extract Button */}
            {!audioUrl && (
              <Button
                onClick={handleExtract}
                disabled={isProcessing}
                className="w-full h-12 text-base font-semibold cta-primary"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Extracting Audio... {progress}%
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Extract Audio
                  </>
                )}
              </Button>
            )}

            {/* Progress Bar */}
            {isProcessing && (
              <div className="w-full h-2 rounded-full bg-[#1a1a1a] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8A2BE2] to-[#00FFFF] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Audio Result */}
        {audioUrl && (
          <div className="space-y-4">
            {/* Audio Player Card */}
            <div className="p-6 rounded-xl bg-black/40 border border-[#1a1a1a] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FFFF]/30 to-transparent" />
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={togglePlay}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#8A2BE2]/20 border border-[#8A2BE2]/30 hover:bg-[#8A2BE2]/30 transition-all"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-[#8A2BE2]" />
                  ) : (
                    <Play className="h-6 w-6 text-[#8A2BE2] ml-0.5" />
                  )}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Extracted Audio</p>
                  <p className="text-xs text-[#888888] mt-0.5">
                    WAV format · {audioDuration} duration
                  </p>
                </div>
                <Volume2 className="h-6 w-6 text-[#555555]" />
              </div>

              {/* Waveform visual */}
              <div className="flex items-center gap-[2px] h-12">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full bg-[#8A2BE2]/30"
                    style={{
                      height: `${Math.random() * 80 + 20}%`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleDownload}
                className="flex-1 h-11 cta-primary font-semibold"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Audio (WAV)
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="h-11 px-5 border-[#222222] text-[#AAAAAA] hover:text-white hover:border-[#8A2BE2]/40 hover:bg-white/5 transition-all"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                New Video
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
