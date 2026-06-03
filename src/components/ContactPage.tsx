'use client';

import { useState, FormEvent } from 'react';
import { Mail, Send, MessageSquare, Bug, Handshake, Lightbulb, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import FAQSection from './FAQSection';

const faqItems = [
  {
    question: 'How can I contact you?',
    answer:
      'You can reach us through the contact form on this page. Fill in your name, email, subject, and message, and we\'ll get back to you as soon as possible. You can also email us directly at hello@toolboxpro.com.',
  },
  {
    question: 'Do you offer partnership opportunities?',
    answer:
      'Yes! We\'re always open to partnerships with tool developers, content creators, and tech companies. Select "Partnership" as the subject in the contact form, and our team will review your proposal.',
  },
  {
    question: 'How quickly do you respond?',
    answer:
      'We aim to respond to all inquiries within 24-48 hours during business days. Partnership proposals and feature requests may take slightly longer as they require review from multiple team members.',
  },
];

const subjects = [
  { value: 'general', label: 'General Inquiry', icon: MessageSquare },
  { value: 'bug', label: 'Bug Report', icon: Bug },
  { value: 'partnership', label: 'Partnership', icon: Handshake },
  { value: 'feature', label: 'Feature Request', icon: Lightbulb },
  { value: 'other', label: 'Other', icon: HelpCircle },
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !subject || !message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 mb-5">
            <Mail className="h-7 w-7 text-[#8A2BE2]" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-[#AAAAAA] max-w-lg mx-auto text-base">
            Have a question, suggestion, or partnership opportunity? We&apos;d love
            to hear from you.
          </p>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 sm:p-8 mb-12 relative overflow-hidden"
        >
          {/* Top glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8A2BE2]/30 to-transparent" />

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-white mb-2 block">
                  Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-black/50 border-[#222222] h-11 text-white placeholder:text-[#555555] focus:border-[#8A2BE2] transition-colors"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-white mb-2 block">
                  Email <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-black/50 border-[#222222] h-11 text-white placeholder:text-[#555555] focus:border-[#8A2BE2] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-white mb-2 block">
                Subject <span className="text-red-400">*</span>
              </Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="bg-black/50 border-[#222222] h-11 text-white">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((sub) => (
                    <SelectItem key={sub.value} value={sub.value}>
                      <span className="flex items-center gap-2">
                        <sub.icon className="h-3.5 w-3.5" />
                        {sub.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium text-white mb-2 block">
                Message <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
                className="bg-black/50 border-[#222222] min-h-[150px] resize-y text-white placeholder:text-[#555555] focus:border-[#8A2BE2] transition-colors"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base font-semibold cta-primary"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  <span>Send Message</span>
                </>
              )}
            </Button>
          </div>
        </form>

        {/* FAQ */}
        <FAQSection items={faqItems} />
      </div>
    </main>
  );
}
