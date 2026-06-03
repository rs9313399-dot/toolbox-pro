'use client';

import { useState, useCallback } from 'react';
import { Braces, Copy, Trash2, Check, Play, Minus, FileJson, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

const faqItems = [
  {
    question: 'What does JSON validation check?',
    answer:
      'JSON validation checks whether your input conforms to the JSON specification. It verifies proper syntax including correct bracket matching, proper string quoting, valid number formats, proper use of commas and colons, and correct nesting of objects and arrays. If validation fails, it shows the exact error and line number.',
  },
  {
    question: 'What formatting standard does this tool use?',
    answer:
      'This tool uses 2-space indentation for formatting, which is the most common JSON formatting standard. The formatted output follows the canonical JSON representation produced by JSON.stringify() with consistent key ordering and proper whitespace.',
  },
  {
    question: 'What are common JSON errors?',
    answer:
      'Common JSON errors include: trailing commas (not allowed in JSON), single quotes instead of double quotes, missing commas between elements, unquoted keys, comments (not supported in JSON), and improperly escaped characters. This tool helps identify and locate these errors.',
  },
  {
    question: 'Is my JSON data secure?',
    answer:
      'Yes, all processing happens entirely in your browser using the built-in JSON.parse() and JSON.stringify() methods. Your data is never sent to any server. This makes it safe to use with sensitive data like API keys, configuration files, or personal information.',
  },
  {
    question: 'Can this tool handle large JSON files?',
    answer:
      'This tool can handle JSON data of reasonable size (up to several megabytes). Very large files may cause performance issues in the browser. For extremely large JSON files (100MB+), consider using a dedicated desktop application or command-line tool like jq.',
  },
];

const relatedTools = [
  {
    name: 'Base64 Encoder',
    hash: '#/tools/base64-encoder',
    description: 'Encode and decode Base64 text and files.',
  },
  {
    name: 'Word Counter',
    hash: '#/tools/word-counter',
    description: 'Count words, characters, and more in your text.',
  },
  {
    name: 'Password Generator',
    hash: '#/tools/password-generator',
    description: 'Generate strong, secure passwords.',
  },
];

const SAMPLE_JSON = `{
  "name": "JSON Formatter",
  "version": "1.0.0",
  "description": "A tool for formatting and validating JSON",
  "features": [
    "Format & beautify",
    "Minify",
    "Validate with error details",
    "Copy to clipboard"
  ],
  "settings": {
    "indentation": 2,
    "sortKeys": false,
    "theme": "dark"
  },
  "stats": {
    "users": 15000,
    "rating": 4.8,
    "isOpenSource": true
  }
}`;

interface ValidationError {
  message: string;
  line?: number;
  column?: number;
}

interface JsonFormatterProps {
  onNavigate: (hash: string) => void;
}

export default function JsonFormatter({ onNavigate }: JsonFormatterProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<ValidationError | null>(null);
  const [copied, setCopied] = useState(false);
  const [showTree, setShowTree] = useState(false);

  const findErrorPosition = (jsonStr: string, errorMessage: string): { line?: number; column?: number } => {
    // Try to extract position from the error message
    const posMatch = errorMessage.match(/position\s+(\d+)/i);
    if (posMatch) {
      const pos = parseInt(posMatch[1]);
      const beforeError = jsonStr.substring(0, pos);
      const lines = beforeError.split('\n');
      return {
        line: lines.length,
        column: lines[lines.length - 1].length + 1,
      };
    }
    return {};
  };

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      toast.error('Please enter some JSON to format');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setIsValid(true);
      setError(null);
      toast.success('JSON formatted successfully!');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON';
      const pos = findErrorPosition(input, msg);
      setIsValid(false);
      setError({ message: msg, ...pos });
      setOutput('');
      toast.error('Invalid JSON — check the error details');
    }
  }, [input]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) {
      toast.error('Please enter some JSON to minify');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setIsValid(true);
      setError(null);
      toast.success('JSON minified successfully!');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON';
      const pos = findErrorPosition(input, msg);
      setIsValid(false);
      setError({ message: msg, ...pos });
      setOutput('');
      toast.error('Invalid JSON — check the error details');
    }
  }, [input]);

  const handleValidate = useCallback(() => {
    if (!input.trim()) {
      toast.error('Please enter some JSON to validate');
      return;
    }
    try {
      JSON.parse(input);
      setIsValid(true);
      setError(null);
      toast.success('JSON is valid!');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON';
      const pos = findErrorPosition(input, msg);
      setIsValid(false);
      setError({ message: msg, ...pos });
      toast.error('JSON is invalid');
    }
  }, [input]);

  const handleCopy = async () => {
    const textToCopy = output || input;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setIsValid(null);
    setError(null);
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_JSON);
    setOutput('');
    setIsValid(null);
    setError(null);
    toast.success('Sample JSON loaded');
  };

  const inputSize = new Blob([input]).size;
  const outputSize = new Blob([output]).size;

  const renderJsonTree = (data: unknown, depth = 0): string => {
    const indent = '  '.repeat(depth);
    if (data === null) return 'null';
    if (typeof data === 'boolean') return data ? 'true' : 'false';
    if (typeof data === 'number') return String(data);
    if (typeof data === 'string') return `"${data}"`;
    if (Array.isArray(data)) {
      if (data.length === 0) return '[]';
      const items = data.map((item) => indent + '  ' + renderJsonTree(item, depth + 1));
      return '[\n' + items.join(',\n') + '\n' + indent + ']';
    }
    if (typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      const entries = keys.map(
        (key) => indent + '  ' + `"${key}": ` + renderJsonTree(obj[key], depth + 1)
      );
      return '{\n' + entries.join(',\n') + '\n' + indent + '}';
    }
    return String(data);
  };

  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Format, validate, and beautify your JSON data instantly. Paste messy JSON and get clean, properly indented output. Detect syntax errors, validate structure, and convert between minified and formatted JSON — an essential tool for developers and API testers."
      icon={Braces}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium text-white">JSON Input</Label>
            <div className="flex items-center gap-3">
              {inputSize > 0 && (
                <span className="text-xs text-[#888888]">
                  {inputSize > 1024 ? `${(inputSize / 1024).toFixed(1)} KB` : `${inputSize} B`}
                </span>
              )}
              {isValid !== null && (
                <span className={`flex items-center gap-1 text-xs font-medium ${isValid ? 'text-green-400' : 'text-red-400'}`}>
                  {isValid ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  {isValid ? 'Valid' : 'Invalid'}
                </span>
              )}
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setIsValid(null); setError(null); }}
            placeholder='Paste your JSON here, e.g. {"key": "value"}'
            rows={10}
            spellCheck={false}
            className="w-full bg-black/40 border border-[#222222] rounded-xl p-3 text-white font-mono text-sm placeholder:text-[#555555] focus:border-[#8A2BE2]/50 focus:outline-none transition-colors resize-y"
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-red-400 font-medium">Validation Error</p>
                <p className="text-xs text-red-400/80 mt-1">{error.message}</p>
                {(error.line || error.column) && (
                  <p className="text-xs text-[#888888] mt-1">
                    {error.line && `Line ${error.line}`}{error.line && error.column && ', '}{error.column && `Column ${error.column}`}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleFormat} className="cta-primary" size="sm">
            <Play className="h-4 w-4 mr-1" />
            Format
          </Button>
          <Button
            onClick={handleMinify}
            variant="outline"
            size="sm"
            className="border-[#222222] text-white hover:border-[#8A2BE2]/50 hover:bg-[#8A2BE2]/10"
          >
            <Minus className="h-4 w-4 mr-1" />
            Minify
          </Button>
          <Button
            onClick={handleValidate}
            variant="outline"
            size="sm"
            className="border-[#222222] text-white hover:border-green-400/50 hover:bg-green-400/10"
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Validate
          </Button>
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="border-[#222222] text-white hover:border-[#8A2BE2]/50 hover:bg-[#8A2BE2]/10"
            disabled={!output && !input}
          >
            {copied ? <Check className="h-4 w-4 mr-1 text-green-400" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            onClick={handleLoadSample}
            variant="outline"
            size="sm"
            className="border-[#222222] text-white hover:border-[#8A2BE2]/50 hover:bg-[#8A2BE2]/10"
          >
            <FileJson className="h-4 w-4 mr-1" />
            Sample
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            size="sm"
            className="border-[#222222] text-white hover:border-red-400/50 hover:bg-red-400/10"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>

        {/* Tree View Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-[#1a1a1a]">
          <div>
            <Label className="text-sm font-medium text-white">Tree View</Label>
            <p className="text-xs text-[#888888] mt-0.5">Display formatted output as a collapsible tree</p>
          </div>
          <Switch checked={showTree} onCheckedChange={setShowTree} />
        </div>

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-white">Output</Label>
              {outputSize > 0 && (
                <span className="text-xs text-[#888888]">
                  {outputSize > 1024 ? `${(outputSize / 1024).toFixed(1)} KB` : `${outputSize} B`}
                </span>
              )}
            </div>
            <div className="max-h-[500px] overflow-y-auto rounded-xl bg-black/40 border border-[#222222] p-4">
              <pre className="text-sm font-mono text-white whitespace-pre-wrap break-words">
                {showTree
                  ? (() => {
                      try {
                        return renderJsonTree(JSON.parse(output));
                      } catch {
                        return output;
                      }
                    })()
                  : output}
              </pre>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
