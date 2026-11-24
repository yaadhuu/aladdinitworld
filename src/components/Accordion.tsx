'use client';

import { useId, useState } from 'react';
import { ChevronDownIcon } from '@/components/Icons';

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <div key={index} className="glass border border-accent/20 rounded-lg overflow-hidden">
            <h3>
              <button
                type="button"
                id={buttonId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 hover:bg-accent/5 transition-colors text-left"
              >
                <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                  {item.question}
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`collapse ${isOpen ? 'is-open' : ''}`}
            >
              <div className="collapse-inner">
                <div className="px-4 sm:px-6 py-4 sm:py-5 bg-accent/5 border-t border-accent/10">
                  <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
