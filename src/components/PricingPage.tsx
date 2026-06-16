'use client';

import {
  Check,
  X,
  Zap,
  Crown,
  Building2,
  Star,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Clock,
  Headphones,
  Lock,
  BadgeCheck,
  FileText,
  ImagePlus,
  Code2,
} from 'lucide-react';
import { useState } from 'react';

interface PricingPageProps {
  onNavigate: (hash: string) => void;
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with essential tools at no cost. Perfect for casual users who need quick, reliable online utilities without any commitment.',
    icon: Zap,
    color: 'text-[#AAAAAA]',
    bg: 'bg-white/5',
    border: 'border-[#222222]',
    popular: false,
    features: [
      { text: 'Access to all 15 basic tools', included: true },
      { text: 'Up to 5 files at once (batch)', included: true },
      { text: 'Standard processing speed', included: true },
      { text: 'Basic QR code customization', included: true },
      { text: '50MB max file size', included: true },
      { text: 'Ad-supported experience', included: true },
      { text: 'Ad-free experience', included: false },
      { text: 'Priority processing', included: false },
      { text: 'HD export quality', included: false },
      { text: 'API access', included: false },
    ],
    cta: 'Current Plan',
    ctaStyle: 'bg-white/5 text-[#AAAAAA] border border-[#222222] cursor-default',
    ctaAction: 'none' as const,
  },
  {
    name: 'Pro',
    price: '$4.99',
    period: '/month',
    yearlyPrice: '$49.99',
    yearlyPeriod: '/year',
    yearlySavings: 'Save 17%',
    description: 'Unlock the full power of ToolBox Pro with advanced features, no ads, and priority processing. Designed for power users and professionals.',
    icon: Crown,
    color: 'text-[#8A2BE2]',
    bg: 'bg-[#8A2BE2]/10',
    border: 'border-[#8A2BE2]/30',
    popular: true,
    features: [
      { text: 'All 15 tools + Pro exclusives', included: true },
      { text: 'Up to 50 files at once (batch)', included: true },
      { text: 'Priority processing speed 3x', included: true },
      { text: 'Full QR code customization + logos', included: true },
      { text: '500MB max file size', included: true },
      { text: 'Completely ad-free', included: true },
      { text: 'HD export quality (up to 4K)', included: true },
      { text: 'PDF merge up to 50 files', included: true },
      { text: 'Custom watermark removal', included: true },
      { text: 'Priority email support', included: true },
      { text: 'API access', included: false },
      { text: 'White-label output', included: false },
    ],
    cta: 'Upgrade to Pro',
    ctaStyle: 'cta-primary text-white',
    ctaAction: 'pro' as const,
  },
  {
    name: 'Enterprise',
    price: '$19.99',
    period: '/month',
    yearlyPrice: '$199.99',
    yearlyPeriod: '/year',
    yearlySavings: 'Save 17%',
    description: 'Full-scale solution for teams and businesses. Get API access, unlimited usage, white-label branding, and dedicated support with SLA guarantees.',
    icon: Building2,
    color: 'text-[#00FFFF]',
    bg: 'bg-[#00FFFF]/10',
    border: 'border-[#00FFFF]/30',
    popular: false,
    features: [
      { text: 'Everything in Pro plan', included: true },
      { text: 'Unlimited batch processing', included: true },
      { text: 'Maximum processing speed 10x', included: true },
      { text: 'Unlimited file size', included: true },
      { text: 'Full REST API access', included: true },
      { text: 'White-label output branding', included: true },
      { text: 'Team collaboration (up to 25)', included: true },
      { text: 'Custom tool configurations', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: '99.9% uptime SLA', included: true },
      { text: 'SSO & advanced security', included: true },
      { text: 'Custom integration support', included: true },
    ],
    cta: 'Contact Sales',
    ctaStyle: 'bg-[#00FFFF]/10 text-[#00FFFF] border border-[#00FFFF]/30 hover:bg-[#00FFFF]/20 transition-all duration-300',
    ctaAction: 'enterprise' as const,
  },
];

const proExclusiveTools = [
  { name: 'Batch PDF Processor', icon: FileText, desc: 'Process up to 50 PDF files simultaneously with advanced options' },
  { name: 'HD Image Exporter', icon: ImagePlus, desc: 'Export images in 4K resolution with lossless quality settings' },
  { name: 'Advanced QR Studio', icon: Star, desc: 'Custom colors, logos, gradients and branded QR code designs' },
  { name: 'Code Beautifier Pro', icon: Code2, desc: 'Format, lint, minify and convert between JSON, YAML, XML, CSV' },
];

const faqs = [
  {
    question: 'Can I try Pro features before paying?',
    answer: 'Yes! When you sign up for Pro, you get a 7-day free trial with full access to all Pro features. No credit card required to start — you only pay if you decide to continue after the trial period ends.',
  },
  {
    question: 'How does billing work?',
    answer: 'We offer monthly and yearly billing options. Yearly plans save you 17% compared to monthly billing. All payments are processed securely through Stripe. You can cancel anytime from your account settings, and you will retain access until the end of your current billing period.',
  },
  {
    question: 'Can I switch between plans?',
    answer: 'Absolutely. You can upgrade or downgrade your plan at any time. When upgrading, you get immediate access to new features and the price difference is prorated. When downgrading, the change takes effect at the end of your current billing cycle.',
  },
  {
    question: 'Is my data safe with ToolBox Pro?',
    answer: 'Your privacy is our top priority. All file processing happens locally in your browser using client-side technologies. Your files are never uploaded to our servers. Even Pro and Enterprise plan features follow this same privacy-first architecture wherever possible.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, PayPal, and UPI for Indian customers. Enterprise customers can also pay via wire transfer or purchase orders with net-30 terms.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee on all plans. If you are not satisfied with ToolBox Pro for any reason, simply contact our support team within 30 days of purchase for a full refund — no questions asked.',
  },
];

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function PricingPage({ onNavigate }: PricingPageProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleCTA = (action: 'none' | 'pro' | 'enterprise') => {
    if (action === 'none') return;
    if (action === 'enterprise') {
      onNavigate('/contact');
      return;
    }
    if (action === 'pro') {
      setShowCheckout(true);
      return;
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#8A2BE2]/8 blur-[200px] animate-orb" />
        <div className="absolute top-20 -right-40 w-[500px] h-[500px] rounded-full bg-[#00FFFF]/5 blur-[180px] animate-orb-reverse" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#8A2BE2]/3 blur-[250px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ═══════════════════ HERO ═══════════════════ */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 mb-6 animate-fade-in-up">
            <Sparkles className="h-3.5 w-3.5 text-[#8A2BE2]" />
            <span className="text-xs font-medium text-[#8A2BE2]">Premium Plans</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05] animate-fade-in-up">
            <span className="text-white">Choose Your</span>
            <br />
            <span className="gradient-text">Perfect Plan</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#AAAAAA] max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            Start free, upgrade when you need more power. No hidden fees, cancel anytime.
            Every plan includes our core privacy-first architecture.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1.5 rounded-full bg-[#111111] border border-[#1a1a1a] animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !isYearly ? 'bg-[#8A2BE2] text-white shadow-lg shadow-[#8A2BE2]/30' : 'text-[#888888] hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                isYearly ? 'bg-[#8A2BE2] text-white shadow-lg shadow-[#8A2BE2]/30' : 'text-[#888888] hover:text-white'
              }`}
            >
              Yearly
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00FFFF]/10 text-[#00FFFF] border border-[#00FFFF]/20">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* ═══════════════════ PRICING CARDS ═══════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 transition-all duration-500 ${
                plan.popular
                  ? 'bg-[#0a0a0a] border-2 border-[#8A2BE2]/50 shadow-2xl shadow-[#8A2BE2]/10 scale-[1.02] md:scale-105'
                  : 'bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#222222]'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#8A2BE2] to-[#6B21A8] text-white text-xs font-bold shadow-lg shadow-[#8A2BE2]/30">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${plan.bg} border ${plan.border} mb-4`}>
                  <plan.icon className={`h-6 w-6 ${plan.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-[#666666] leading-relaxed">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-white">
                    {isYearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price}
                  </span>
                  <span className="text-sm text-[#666666] font-medium">
                    {isYearly && plan.yearlyPeriod ? plan.yearlyPeriod : plan.period}
                  </span>
                </div>
                {isYearly && plan.yearlySavings && (
                  <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-[#00FFFF]">
                    <Sparkles className="h-3 w-3" />
                    {plan.yearlySavings}
                  </span>
                )}
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 mb-8 ${plan.ctaStyle}`}
                onClick={() => handleCTA(plan.ctaAction)}
              >
                {plan.cta}
              </button>

              {/* Features List */}
              <div className="space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#444444] mb-4">What&apos;s included</p>
                {plan.features.map((feature) => (
                  <div key={feature.text} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${plan.color}`} />
                    ) : (
                      <X className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#333333]" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-[#CCCCCC]' : 'text-[#444444]'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════════ PRO EXCLUSIVE TOOLS ═══════════════════ */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 mb-5">
              <Crown className="h-7 w-7 text-[#8A2BE2]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
              Pro Exclusive <span className="gradient-text">Features</span>
            </h2>
            <p className="text-[#AAAAAA] text-base max-w-lg mx-auto">
              Unlock these powerful tools and capabilities when you upgrade to Pro
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {proExclusiveTools.map((tool) => (
              <div
                key={tool.name}
                className="relative group p-6 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#8A2BE2]/30 transition-all duration-500 overflow-hidden"
              >
                {/* Premium badge */}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 text-[10px] font-bold text-[#8A2BE2]">
                    <Crown className="h-2.5 w-2.5" />
                    PRO
                  </span>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#8A2BE2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 mb-4">
                    <tool.icon className="h-6 w-6 text-[#8A2BE2]" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{tool.name}</h3>
                  <p className="text-sm text-[#888888] leading-relaxed">{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════ COMPARISON TABLE ═══════════════════ */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
              Feature <span className="gradient-text-reverse">Comparison</span>
            </h2>
            <p className="text-[#AAAAAA] text-base max-w-lg mx-auto">
              See exactly what you get with each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[700px] bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-0 border-b border-[#1a1a1a]">
                <div className="p-5">
                  <span className="text-sm font-semibold text-[#888888]">Feature</span>
                </div>
                <div className="p-5 text-center border-l border-[#1a1a1a]">
                  <span className="text-sm font-semibold text-[#AAAAAA]">Free</span>
                </div>
                <div className="p-5 text-center border-l border-[#8A2BE2]/20 bg-[#8A2BE2]/5">
                  <span className="text-sm font-semibold text-[#8A2BE2]">Pro</span>
                </div>
                <div className="p-5 text-center border-l border-[#1a1a1a]">
                  <span className="text-sm font-semibold text-[#00FFFF]">Enterprise</span>
                </div>
              </div>

              {/* Rows */}
              {[
                { feature: 'Number of tools', free: '15 basic', pro: '15 + 4 exclusive', enterprise: 'All + custom' },
                { feature: 'Batch processing', free: '5 files', pro: '50 files', enterprise: 'Unlimited' },
                { feature: 'Max file size', free: '50MB', pro: '500MB', enterprise: 'Unlimited' },
                { feature: 'Processing speed', free: 'Standard', pro: '3x faster', enterprise: '10x faster' },
                { feature: 'Export quality', free: 'Standard', pro: 'HD (up to 4K)', enterprise: 'Ultra HD' },
                { feature: 'Ad experience', free: 'With ads', pro: 'Ad-free', enterprise: 'Ad-free' },
                { feature: 'API access', free: '—', pro: '—', enterprise: 'Full REST API' },
                { feature: 'Team members', free: '1', pro: '1', enterprise: 'Up to 25' },
                { feature: 'Support', free: 'Community', pro: 'Priority email', enterprise: 'Dedicated manager' },
                { feature: 'White-label output', free: '—', pro: '—', enterprise: 'Included' },
                { feature: 'SLA guarantee', free: '—', pro: '—', enterprise: '99.9% uptime' },
                { feature: 'Custom integrations', free: '—', pro: '—', enterprise: 'Included' },
              ].map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-4 gap-0 border-b border-[#1a1a1a] last:border-b-0 ${
                    i % 2 === 0 ? 'bg-[#0d0d0d]' : ''
                  }`}
                >
                  <div className="p-4 flex items-center gap-2">
                    <span className="text-sm text-[#CCCCCC]">{row.feature}</span>
                  </div>
                  <div className="p-4 text-center border-l border-[#1a1a1a] flex items-center justify-center">
                    <span className="text-sm text-[#888888]">{row.free}</span>
                  </div>
                  <div className="p-4 text-center border-l border-[#8A2BE2]/20 bg-[#8A2BE2]/3 flex items-center justify-center">
                    <span className="text-sm text-[#CCCCCC]">{row.pro}</span>
                  </div>
                  <div className="p-4 text-center border-l border-[#1a1a1a] flex items-center justify-center">
                    <span className="text-sm text-[#CCCCCC]">{row.enterprise}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════ TRUST BADGES ═══════════════════ */}
        <div className="mb-24">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-3xl p-10 sm:p-14 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#8A2BE2]/5 blur-[200px] pointer-events-none" />
            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                { icon: ShieldCheck, label: '7-Day Free Trial', desc: 'Try Pro risk-free' },
                { icon: Lock, label: 'Secure Payments', desc: 'SSL encrypted via Stripe' },
                { icon: Clock, label: 'Cancel Anytime', desc: 'No contracts, no hassle' },
                { icon: BadgeCheck, label: '30-Day Refund', desc: 'Money-back guarantee' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 mb-4">
                    <item.icon className="h-6 w-6 text-[#8A2BE2]" />
                  </div>
                  <p className="text-sm font-bold text-white mb-1">{item.label}</p>
                  <p className="text-xs text-[#666666]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════ FAQ ═══════════════════ */}
        <div className="mb-24 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-[#AAAAAA] text-base max-w-lg mx-auto">
              Everything you need to know about our plans
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#222222]"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-semibold text-white pr-4">{faq.question}</span>
                  <ChevronIcon className={`h-4 w-4 text-[#666666] flex-shrink-0 transition-transform duration-300 ${
                    openFAQ === index ? 'rotate-180' : ''
                  }`} />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFAQ === index ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-5 pb-5 text-sm text-[#888888] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════ FINAL CTA ═══════════════════ */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-[#8A2BE2]/10 to-[#00FFFF]/5 border border-[#8A2BE2]/20 rounded-3xl p-10 sm:p-16 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#8A2BE2]/10 blur-[150px] pointer-events-none" />

            <div className="relative">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8A2BE2]/20 border border-[#8A2BE2]/30 mb-6">
                <Sparkles className="h-7 w-7 text-[#8A2BE2]" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
                Ready to <span className="gradient-text">Upgrade</span>?
              </h2>
              <p className="text-[#AAAAAA] text-base max-w-lg mx-auto mb-8 leading-relaxed">
                Join thousands of professionals who use ToolBox Pro to save time and get more done. Start your free trial today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setShowCheckout(true)}
                  className="cta-primary inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white font-semibold text-sm animate-btn-glow"
                >
                  <span>Start 7-Day Free Trial</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl border border-[#222222] text-white font-semibold text-sm hover:border-[#8A2BE2]/50 hover:bg-white/5 transition-all duration-300"
                >
                  <Headphones className="h-4 w-4" />
                  Talk to Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ CHECKOUT MODAL ═══════════════════ */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCheckout(false)}
          />
          <div className="relative w-full max-w-md bg-[#0a0a0a] border border-[#8A2BE2]/30 rounded-2xl overflow-hidden shadow-2xl shadow-[#8A2BE2]/20 animate-fade-in-up">
            {/* Top gradient line */}
            <div className="h-1 bg-gradient-to-r from-[#8A2BE2] via-[#00FFFF] to-[#8A2BE2]" />

            <div className="p-8">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/30 flex items-center justify-center">
                    <Crown className="h-8 w-8 text-[#8A2BE2]" />
                  </div>
                  <div className="absolute -inset-3 rounded-3xl bg-[#8A2BE2]/5 blur-xl pointer-events-none" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Upgrade to Pro</h3>
                <p className="text-sm text-[#888888] leading-relaxed">
                  Payment integration coming soon! We are setting up Stripe for secure payments. For now, contact us to get early Pro access.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-8">
                {[
                  'All 15 tools + 4 Pro exclusives',
                  'Ad-free experience forever',
                  '3x faster processing speed',
                  'HD export up to 4K quality',
                  'Batch processing up to 50 files',
                  'Priority email support',
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-[#8A2BE2] flex-shrink-0" />
                    <span className="text-sm text-[#CCCCCC]">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Price display */}
              <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-4 mb-6 text-center">
                <span className="text-sm text-[#666666]">Pro Plan</span>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                  <span className="text-3xl font-black text-white">{isYearly ? '$49.99' : '$4.99'}</span>
                  <span className="text-sm text-[#666666]">{isYearly ? '/year' : '/month'}</span>
                </div>
                {isYearly && (
                  <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-[#00FFFF]">
                    <Sparkles className="h-3 w-3" /> Save 17%
                  </span>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowCheckout(false);
                    onNavigate('/contact');
                  }}
                  className="w-full cta-primary py-3.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Contact Us for Early Access
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="w-full py-3 rounded-xl text-[#666666] text-sm font-medium hover:text-[#888888] transition-colors"
                >
                  Maybe later
                </button>
              </div>

              {/* Trust note */}
              <p className="text-center text-[10px] text-[#444444] mt-4">
                Cancel anytime &middot; 30-day money-back guarantee &middot; Secure payments via Stripe
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
