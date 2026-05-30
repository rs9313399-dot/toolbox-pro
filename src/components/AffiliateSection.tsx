'use client';

import { ExternalLink, Sparkles, Palette, Shield, Server, Lock, Globe, Code } from 'lucide-react';

const affiliates = [
  {
    name: 'Hostinger',
    description:
      'Affordable web hosting starting at ₹149/mo. Free domain, SSL, and one-click WordPress install. Perfect for launching your website or blog.',
    badge: 'Hosting',
    icon: Server,
    url: 'https://www.hostinger.in/',
  },
  {
    name: 'Canva Pro',
    description:
      'Design stunning graphics, presentations, and social media posts with ease. Professional templates and AI-powered design tools for every creator.',
    badge: 'Design Tool',
    icon: Palette,
    url: 'https://www.canva.com/',
  },
  {
    name: 'NordVPN',
    description:
      'Protect your online privacy with military-grade encryption. Browse securely on any device, anywhere. Fast servers in 60+ countries worldwide.',
    badge: 'VPN',
    icon: Shield,
    url: 'https://nordvpn.com/',
  },
  {
    name: 'LastPass',
    description:
      'Secure password manager that auto-fills logins across all your devices. Generate, store, and share passwords safely. Never forget a password again.',
    badge: 'Password Manager',
    icon: Lock,
    url: 'https://www.lastpass.com/',
  },
  {
    name: 'Namecheap',
    description:
      'Register domains starting at ₹499/yr. Free WhoisGuard privacy protection, free SSL, and reliable DNS hosting. Trusted by millions worldwide.',
    badge: 'Domain',
    icon: Globe,
    url: 'https://www.namecheap.com/',
  },
  {
    name: 'GitHub Copilot',
    description:
      'AI-powered code completion that helps you write code faster. Suggests entire lines and functions based on context. Works with all major IDEs.',
    badge: 'Developer',
    icon: Code,
    url: 'https://github.com/features/copilot',
  },
];

export default function AffiliateSection() {
  return (
    <section>
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FFFF]/10 border border-[#00FFFF]/20 mb-5">
          <Sparkles className="h-3 w-3 text-[#00FFFF]" />
          <span className="text-xs font-medium text-[#00FFFF]">Sponsored</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
          Recommended <span className="gradient-text-reverse">Tools & Services</span>
        </h2>
        <p className="text-[#AAAAAA] text-base max-w-lg mx-auto">
          Handpicked services we trust and recommend for creators and professionals
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {affiliates.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="tool-card p-6 group block"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                  <item.icon className="h-5 w-5 text-[#00FFFF]" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#8A2BE2] transition-colors duration-300">
                  {item.name}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#00FFFF]/10 text-[#00FFFF] border border-[#00FFFF]/20">
                {item.badge}
              </span>
            </div>
            <p className="text-sm text-[#888888] mb-5 leading-relaxed">
              {item.description}
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8A2BE2] group-hover:text-[#9B3FEF] transition-colors duration-300">
              Learn More
              <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
