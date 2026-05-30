'use client';

import { Shield, Lock, Eye, Cookie, Globe, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 mb-5">
            <Shield className="h-7 w-7 text-[#8A2BE2]" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-[#AAAAAA] text-sm">Last updated: May 29, 2026</p>
        </div>

        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 sm:p-8 space-y-8">
          {/* Intro */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">Introduction</h2>
            <p className="text-[#AAAAAA] leading-relaxed text-sm">
              At ToolBox Pro, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website toolboxpro.com (the &quot;Site&quot;). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Site. We are committed to ensuring that your personal information is protected. All tools on ToolBox Pro run entirely in your browser — your files, text, and data never leave your device unless you explicitly choose to share them.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-5 w-5 text-[#00FFFF]" />
              <h2 className="text-xl font-bold text-white">Information We Collect</h2>
            </div>
            <p className="text-[#AAAAAA] leading-relaxed text-sm mb-3">
              We want to be transparent about the data we collect. Since all our tools run client-side in your browser, we do not process or store your files, images, text, or any content you input into our tools on our servers. However, we may collect certain information automatically when you visit our Site:
            </p>
            <ul className="space-y-2 text-[#AAAAAA] text-sm ml-4">
              <li className="flex gap-2"><span className="text-[#8A2BE2]">&#8226;</span><span><strong className="text-white">Device Information:</strong> We collect information about your device, including your IP address, browser type, operating system, and device identifiers.</span></li>
              <li className="flex gap-2"><span className="text-[#8A2BE2]">&#8226;</span><span><strong className="text-white">Usage Data:</strong> We collect information about how you interact with our Site, including pages visited, time spent on pages, links clicked, and navigation patterns.</span></li>
              <li className="flex gap-2"><span className="text-[#8A2BE2]">&#8226;</span><span><strong className="text-white">Cookies and Tracking:</strong> We use cookies and similar tracking technologies to track activity on our Site and hold certain information.</span></li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-5 w-5 text-[#00FFFF]" />
              <h2 className="text-xl font-bold text-white">How We Use Your Information</h2>
            </div>
            <p className="text-[#AAAAAA] leading-relaxed text-sm mb-3">
              We use the information we collect for the following purposes:
            </p>
            <ul className="space-y-2 text-[#AAAAAA] text-sm ml-4">
              <li className="flex gap-2"><span className="text-[#8A2BE2]">&#8226;</span><span>To provide, maintain, and improve our tools and services</span></li>
              <li className="flex gap-2"><span className="text-[#8A2BE2]">&#8226;</span><span>To understand and analyze how you use our Site</span></li>
              <li className="flex gap-2"><span className="text-[#8A2BE2]">&#8226;</span><span>To develop new products, services, features, and functionality</span></li>
              <li className="flex gap-2"><span className="text-[#8A2BE2]">&#8226;</span><span>To communicate with you, if necessary, regarding your use of our Site</span></li>
              <li className="flex gap-2"><span className="text-[#8A2BE2]">&#8226;</span><span>To detect and prevent fraud or technical issues</span></li>
              <li className="flex gap-2"><span className="text-[#8A2BE2]">&#8226;</span><span>To display advertisements through Google AdSense</span></li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Cookie className="h-5 w-5 text-[#00FFFF]" />
              <h2 className="text-xl font-bold text-white">Cookies and Tracking Technologies</h2>
            </div>
            <p className="text-[#AAAAAA] leading-relaxed text-sm">
              We use cookies and similar tracking technologies to track activity on our Site. Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Site. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site. We use Google AdSense to display advertisements, which uses cookies to serve ads based on your prior visits to our Site or other websites.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-5 w-5 text-[#00FFFF]" />
              <h2 className="text-xl font-bold text-white">Third-Party Services</h2>
            </div>
            <p className="text-[#AAAAAA] leading-relaxed text-sm">
              We may employ third-party companies and individuals to facilitate our Site, provide the Service on our behalf, perform Site-related services, or assist us in analyzing how our Site is used. These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose. We use the following third-party services: Google AdSense for displaying advertisements, Google Analytics for website traffic analysis, and Vercel for website hosting. Each of these services has their own privacy policies which we encourage you to review.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">Data Security</h2>
            <p className="text-[#AAAAAA] leading-relaxed text-sm">
              The security of your data is important to us. All of our tools process data locally in your browser using client-side technologies such as the HTML5 Canvas API, Web Speech API, and Web Crypto API. Your files, images, text, passwords, and other content never leave your device. However, remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">Children&apos;s Privacy</h2>
            <p className="text-[#AAAAAA] leading-relaxed text-sm">
              Our Site is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13 without verification of parental consent, we will take steps to remove that information from our servers. If you are a parent or guardian and you believe that your child has provided us with personal information, please contact us.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">Changes to This Privacy Policy</h2>
            <p className="text-[#AAAAAA] leading-relaxed text-sm">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          {/* Contact */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Mail className="h-5 w-5 text-[#00FFFF]" />
              <h2 className="text-xl font-bold text-white">Contact Us</h2>
            </div>
            <p className="text-[#AAAAAA] leading-relaxed text-sm">
              If you have any questions about this Privacy Policy, please contact us at: <strong className="text-white">hello@toolboxpro.com</strong>. We will respond to your inquiry within 48 business hours.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
