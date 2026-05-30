'use client';

import { useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  pageTitle?: string;
}

export default function FAQSection({ items, pageTitle }: FAQSectionProps) {
  useEffect(() => {
    // Inject JSON-LD schema for FAQ
    if (items.length > 0 && typeof document !== 'undefined') {
      const existingScript = document.getElementById('faq-schema');
      if (existingScript) existingScript.remove();

      const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'faq-schema';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);

      return () => {
        const s = document.getElementById('faq-schema');
        if (s) s.remove();
      };
    }
  }, [items]);

  return (
    <section className="py-4">
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="border-[#1a1a1a] border-b last:border-b-0"
          >
            <AccordionTrigger className="text-left text-sm font-semibold text-white hover:text-[#8A2BE2] hover:no-underline py-5 transition-colors duration-300">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-[#AAAAAA] leading-relaxed pb-5">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
