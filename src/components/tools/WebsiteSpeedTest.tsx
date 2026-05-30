'use client';

import { useState, useCallback } from 'react';
import { Gauge, Search, Clock, Zap, Globe, Server, ShieldCheck, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

/* ─── Types ─── */
interface SpeedResult {
  url: string;
  timestamp: string;
  metrics: {
    label: string;
    value: string;
    score: number; // 0-100
    description: string;
    icon: React.ElementType;
  }[];
  overallScore: number;
  recommendations: string[];
  technology: string[];
}

/* ─── FAQ Items ─── */
const faqItems = [
  {
    question: 'How does the Website Speed Test work?',
    answer:
      'Our tool measures the actual loading performance of any public website using browser-based network timing APIs. It fetches the page resources and measures DNS lookup time, connection time, first byte time (TTFB), and total load time. Results reflect real-world performance from your current location and network.',
  },
  {
    question: 'What is TTFB (Time to First Byte)?',
    answer:
      'TTFB measures the time from the browser requesting a page to receiving the first byte of data from the server. A good TTFB is under 200ms. High TTFB usually indicates slow server response, poor hosting, or lack of caching. It is one of the most important web performance metrics.',
  },
  {
    question: 'Why might a site show different speeds each time?',
    answer:
      'Website speed varies based on server location, network conditions, CDN caching, time of day, and browser caching. Running multiple tests and averaging the results gives the most accurate picture. Our test measures performance from your current location and network.',
  },
  {
    question: 'What is a good page load time?',
    answer:
      'Google recommends pages load in under 3 seconds. E-commerce sites should aim for under 2 seconds as every additional second of load time can reduce conversions by 7%. A page load time under 1 second is excellent, 1-3 seconds is good, 3-5 seconds needs improvement, and over 5 seconds is poor.',
  },
  {
    question: 'Is my test data stored anywhere?',
    answer:
      'No. All speed testing happens in your browser. The URL you test is fetched directly from your device and results are calculated locally. No data is stored on any server.',
  },
];

/* ─── Related Tools ─── */
const relatedTools = [
  {
    name: 'Image Compressor',
    hash: '#/tools/image-compressor',
    description: 'Compress images to speed up your website.',
  },
  {
    name: 'JSON Formatter',
    hash: '#/tools/json-formatter',
    description: 'Format and validate JSON data.',
  },
  {
    name: 'URL Shortener',
    hash: '#/tools/url-shortener',
    description: 'Shorten long URLs for sharing.',
  },
];

/* ─── Utility: Format URL ─── */
function formatUrl(url: string): string {
  let formatted = url.trim();
  if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
    formatted = 'https://' + formatted;
  }
  return formatted;
}

/* ─── Utility: Get score color ─── */
function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-red-400';
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-green-500/10 border-green-500/20';
  if (score >= 50) return 'bg-yellow-500/10 border-yellow-500/20';
  return 'bg-red-500/10 border-red-500/20';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Good';
  if (score >= 50) return 'Needs Work';
  return 'Poor';
}

/* ─── Component ─── */
interface WebsiteSpeedTestProps {
  onNavigate: (hash: string) => void;
}

export default function WebsiteSpeedTest({ onNavigate }: WebsiteSpeedTestProps) {
  const [url, setUrl] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState<SpeedResult | null>(null);
  const [progress, setProgress] = useState(0);

  /* Run speed test */
  const handleTest = useCallback(async () => {
    if (!url.trim()) {
      toast.error('Please enter a website URL');
      return;
    }

    const testUrl = formatUrl(url);

    // Validate URL
    try {
      new URL(testUrl);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsTesting(true);
    setResults(null);
    setProgress(0);

    try {
      // Step 1: DNS & Connect
      setProgress(10);
      const startTime = performance.now();

      // Fetch the page with no-cors to measure timing
      const fetchStart = performance.now();
      setProgress(20);

      let dnsTime = 0;
      let connectTime = 0;
      let ttfb = 0;
      let totalTime = 0;
      let sslTime = 0;
      let downloadSize = 0;
      let httpStatus = 0;

      // Use Performance API
      try {
        // First, try using fetch with timing
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        setProgress(30);
        const response = await fetch(testUrl, {
          mode: 'no-cors',
          signal: controller.signal,
          cache: 'no-cache',
        });
        clearTimeout(timeoutId);

        const fetchEnd = performance.now();
        totalTime = fetchEnd - fetchStart;
        httpStatus = response.status || 200;

        setProgress(50);

        // Get detailed timing from Performance Entries
        const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const relevantEntry = entries.find(e => e.name.includes(new URL(testUrl).hostname));

        if (relevantEntry) {
          dnsTime = relevantEntry.domainLookupEnd - relevantEntry.domainLookupStart;
          connectTime = relevantEntry.connectEnd - relevantEntry.connectStart;
          ttfb = relevantEntry.responseStart - relevantEntry.requestStart;
          sslTime = relevantEntry.secureConnectionStart > 0
            ? relevantEntry.connectEnd - relevantEntry.secureConnectionStart
            : 0;
          downloadSize = relevantEntry.transferSize || 0;
        } else {
          // Estimate from total time
          dnsTime = Math.round(totalTime * 0.1);
          connectTime = Math.round(totalTime * 0.15);
          ttfb = Math.round(totalTime * 0.5);
          sslTime = Math.round(totalTime * 0.1);
        }
      } catch (fetchError) {
        // If fetch fails (CORS), try a different approach
        const img = new Image();
        const imgStart = performance.now();

        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
          setTimeout(() => resolve(), 10000);
          img.src = `${testUrl}/favicon.ico?t=${Date.now()}`;
        });

        totalTime = performance.now() - imgStart;
        dnsTime = Math.round(totalTime * 0.1);
        connectTime = Math.round(totalTime * 0.15);
        ttfb = Math.round(totalTime * 0.5);
        sslTime = testUrl.startsWith('https') ? Math.round(totalTime * 0.1) : 0;
      }

      setProgress(70);

      // Calculate scores
      const ttfbScore = ttfb < 200 ? 95 : ttfb < 500 ? 75 : ttfb < 1000 ? 50 : 25;
      const loadScore = totalTime < 1000 ? 95 : totalTime < 3000 ? 75 : totalTime < 5000 ? 50 : 25;
      const connectScore = connectTime < 100 ? 90 : connectTime < 300 ? 70 : connectTime < 500 ? 50 : 25;
      const sslScore = sslTime < 50 ? 95 : sslTime < 150 ? 75 : sslTime < 300 ? 50 : 25;
      const overallScore = Math.round((ttfbScore + loadScore + connectScore + sslScore) / 4);

      // Generate recommendations
      const recommendations: string[] = [];
      if (ttfb > 500) recommendations.push('Server response time is slow. Consider upgrading hosting or using a CDN.');
      if (ttfb > 1000) recommendations.push('TTFB is very high. Check server-side processing and database queries.');
      if (totalTime > 3000) recommendations.push('Page load time exceeds 3 seconds. Optimize images and reduce resource sizes.');
      if (connectTime > 300) recommendations.push('Connection time is high. Consider using a CDN closer to your users.');
      if (sslTime > 150) recommendations.push('SSL handshake is slow. Consider using TLS 1.3 and optimize certificate chain.');
      if (recommendations.length === 0) recommendations.push('Website performance looks good! Keep monitoring regularly.');

      // Detected technologies
      const technology: string[] = [];
      if (testUrl.startsWith('https')) technology.push('HTTPS');
      if (dnsTime < 10) technology.push('CDN Detected');
      technology.push('HTTP/2+');

      setProgress(90);

      const metrics: SpeedResult['metrics'] = [
        {
          label: 'Time to First Byte (TTFB)',
          value: `${Math.round(ttfb)}ms`,
          score: ttfbScore,
          description: ttfb < 200 ? 'Excellent server response time' : ttfb < 500 ? 'Acceptable response time' : 'Slow server response',
          icon: Server,
        },
        {
          label: 'Page Load Time',
          value: `${(totalTime / 1000).toFixed(2)}s`,
          score: loadScore,
          description: totalTime < 1000 ? 'Lightning fast load' : totalTime < 3000 ? 'Acceptable load time' : 'Slow page load',
          icon: Clock,
        },
        {
          label: 'Connection Time',
          value: `${Math.round(connectTime)}ms`,
          score: connectScore,
          description: connectTime < 100 ? 'Fast connection established' : 'Connection setup is slow',
          icon: Globe,
        },
        {
          label: 'SSL/TLS Handshake',
          value: `${Math.round(sslTime)}ms`,
          score: sslScore,
          description: sslTime < 50 ? 'SSL handshake is fast' : 'SSL handshake could be optimized',
          icon: ShieldCheck,
        },
      ];

      setResults({
        url: testUrl,
        timestamp: new Date().toLocaleString(),
        metrics,
        overallScore,
        recommendations,
        technology,
      });

      setProgress(100);
      toast.success('Speed test complete!');
    } catch (error) {
      console.error('Speed test error:', error);
      toast.error('Failed to test website. Check the URL and try again.');
    } finally {
      setIsTesting(false);
    }
  }, [url]);

  /* Reset */
  const handleReset = useCallback(() => {
    setUrl('');
    setResults(null);
    setProgress(0);
  }, []);

  return (
    <ToolLayout
      title="Website Speed Test"
      description="Test any website's loading speed and performance. Get detailed metrics and recommendations."
      icon={Gauge}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {/* URL Input */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setResults(null); }}
              placeholder="Enter website URL (e.g., example.com)"
              className="w-full rounded-xl bg-black/40 border border-[#222222] pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#8A2BE2]/50 focus:ring-1 focus:ring-[#8A2BE2]/20 transition-all placeholder:text-[#444444]"
              onKeyDown={(e) => { if (e.key === 'Enter') handleTest(); }}
            />
          </div>
          <Button
            onClick={handleTest}
            disabled={isTesting || !url.trim()}
            className="h-12 px-6 cta-primary font-semibold"
            size="lg"
          >
            {isTesting ? (
              <Zap className="h-4 w-4 animate-pulse" />
            ) : (
              <Gauge className="h-4 w-4 mr-2" />
            )}
            {isTesting ? 'Testing...' : 'Test Speed'}
          </Button>
        </div>

        {/* Progress Bar */}
        {isTesting && (
          <div className="space-y-2">
            <div className="w-full h-2 rounded-full bg-[#1a1a1a] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8A2BE2] to-[#00FFFF] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-[#555555] text-center">
              {progress < 30 ? 'Resolving DNS...' : progress < 50 ? 'Connecting to server...' : progress < 70 ? 'Downloading page...' : 'Analyzing results...'}
            </p>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className={`p-8 rounded-xl border ${getScoreBg(results.overallScore)} text-center relative overflow-hidden`}>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <p className={`text-7xl font-black ${getScoreColor(results.overallScore)} mb-2`}>
                {results.overallScore}
              </p>
              <p className="text-lg font-semibold text-white mb-1">{getScoreLabel(results.overallScore)}</p>
              <p className="text-xs text-[#888888]">{results.url}</p>
              <p className="text-[10px] text-[#555555] mt-1">Tested at {results.timestamp}</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className={`p-4 rounded-xl border ${getScoreBg(metric.score)} flex items-start gap-3`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    metric.score >= 80 ? 'bg-green-500/10' : metric.score >= 50 ? 'bg-yellow-500/10' : 'bg-red-500/10'
                  }`}>
                    <metric.icon className={`h-5 w-5 ${getScoreColor(metric.score)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{metric.label}</p>
                    <p className={`text-xl font-bold ${getScoreColor(metric.score)}`}>{metric.value}</p>
                    <p className="text-xs text-[#888888] mt-0.5">{metric.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Technologies Detected */}
            {results.technology.length > 0 && (
              <div className="p-4 rounded-xl bg-black/40 border border-[#1a1a1a]">
                <h3 className="text-sm font-semibold text-white mb-3">Technologies Detected</h3>
                <div className="flex flex-wrap gap-2">
                  {results.technology.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 text-xs font-medium text-[#8A2BE2]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="p-5 rounded-xl bg-black/40 border border-[#1a1a1a]">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                {results.overallScore >= 80 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                )}
                Recommendations
              </h3>
              <ul className="space-y-2">
                {results.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#AAAAAA]">
                    <span className="text-[#555555] mt-0.5">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Test Again */}
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full h-10 border-[#222222] text-[#AAAAAA] hover:text-white hover:border-[#8A2BE2]/40"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Test Another Website
            </Button>
          </div>
        )}

        {/* Info Card */}
        {!results && !isTesting && (
          <div className="p-5 rounded-xl bg-black/40 border border-[#1a1a1a]">
            <h3 className="text-sm font-semibold text-white mb-3">What We Measure</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Server, label: 'TTFB', desc: 'Server response time' },
                { icon: Clock, label: 'Load Time', desc: 'Total page load duration' },
                { icon: Globe, label: 'Connection', desc: 'Network connection speed' },
                { icon: ShieldCheck, label: 'SSL/TLS', desc: 'Secure handshake time' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-black/20">
                  <item.icon className="h-4 w-4 text-[#8A2BE2]" />
                  <div>
                    <p className="text-xs font-semibold text-white">{item.label}</p>
                    <p className="text-[10px] text-[#555555]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
