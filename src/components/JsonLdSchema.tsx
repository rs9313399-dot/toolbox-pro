'use client';

import { useEffect } from 'react';

export default function JsonLdSchema() {
  useEffect(() => {
    const id = 'website-schema';

    // Remove existing if any
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ToolBox Pro",
      url: "https://toolbox-pro.vercel.app",
      description: "Free online tools for everyone. No signup required.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://toolbox-pro.vercel.app/#/tools",
        "query-input": "required name=search_term_string",
      },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const s = document.getElementById(id);
      if (s) s.remove();
    };
  }, []);

  return null;
}
