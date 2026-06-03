'use client';

import { FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 mb-5">
            <FileText className="h-7 w-7 text-[#8A2BE2]" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-[#AAAAAA] text-sm">Last updated: May 29, 2026</p>
        </div>

        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 sm:p-8 space-y-8">
          {/* Acceptance */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p className="text-[#AAAAAA] leading-relaxed text-sm">
              By accessing and using ToolBox Pro (the &quot;Service&quot;), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this Service. These Terms of Service apply to all visitors, users, and others who access or use the Service. We reserve the right to update or change our Terms of Service at any time, and it is your responsibility to check these Terms periodically for changes.
            </p>
          </section>

          {/* Description */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Description of Service</h2>
            <p className="text-[#AAAAAA] leading-relaxed text-sm">
              ToolBox Pro provides free, browser-based online tools including but not limited to: password generators, word counters, image compressors, image resizers, background removers, image-to-PDF converters, PDF-to-image converters, QR code generators, URL shorteners, text-to-speech converters, speech-to-text tools, JSON formatters, Base64 encoders/decoders, YouTube thumbnail downloaders, and Instagram reel downloaders. All tools process data locally in your browser. We do not store, transmit, or have access to any data you input into our tools.
            </p>
          </section>

          {/* Use of Service */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Use of Service</h2>
            <p className="text-[#AAAAAA] leading-relaxed text-sm mb-3">
              You agree to use ToolBox Pro only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else&apos;s use and enjoyment of the Service. Prohibited behavior includes:
            </p>
            <ul className="space-y-2 text-[#AAAAAA] text-sm ml-4">
              <li className="flex gap-2"><span className="text-[#8A2BE2]">&#8226;</span><span>Using the Service for any illegal or unauthorized purpose</span></li>
              <li className="flex gap-2"><span className="text-[#8A2BE2]">&#8226;</span><span>Attempting to interfere with or disrupt the Service or servers connected to the Service</span></li>
              <li className="flex gap-2"><span className="text-[#8A2BE2]">&#8226;</span><span>Using automated tools (bots, scrapers) to access the Service without permission</span></li>
              <li className="flex gap-2"><span className="text-[#8A2BE2]">&#8226;</span><span>Using the Service to generate content that violates copyright or intellectual property rights</span></li>
              <li className="flex gap-2"><span className="text-[#8A2BE2]">&#8226;</span><span>Attempting to reverse engineer, decompile, or disassemble any part of the Service</span></li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Intellectual Property</h2>
            <p className="text-[#AAAAAA] leading-relaxed text-sm">
              The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of ToolBox Pro and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of ToolBox Pro. You retain all rights to content you create using our tools.
            </p>
          </section>

          {/* No Warranty */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Disclaimer of Warranties</h2>
            <p className="text-[#AAAAAA] leading-relaxed text-sm">
              The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. ToolBox Pro makes no warranties, expressed or implied, and hereby disclaims all warranties, including without limitation, implied warranties of merchantability, fitness for a particular purpose, and non-infringement. ToolBox Pro does not warrant that the Service will function uninterrupted, secure, or error-free, that defects will be corrected, or that the Service or the server that makes it available are free of viruses or other harmful components. We do not guarantee the accuracy, completeness, or usefulness of any information provided through the Service.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Limitation of Liability</h2>
            <p className="text-[#AAAAAA] leading-relaxed text-sm">
              In no event shall ToolBox Pro, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service; any conduct or content of any third party on the Service; any content obtained from the Service; or unauthorized access, use, or alteration of your transmissions or content.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Third-Party Links</h2>
            <p className="text-[#AAAAAA] leading-relaxed text-sm">
              Our Service may contain links to third-party websites or services that are not owned or controlled by ToolBox Pro. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that ToolBox Pro shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Changes to Terms</h2>
            <p className="text-[#AAAAAA] leading-relaxed text-sm">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Contact Us</h2>
            <p className="text-[#AAAAAA] leading-relaxed text-sm">
              If you have any questions about these Terms, please contact us at: <strong className="text-white">hello@toolboxpro.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
