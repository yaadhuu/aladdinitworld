import { FaqSearch } from '@/components/home/FaqSearch';
import { waLink } from '@/lib/whatsapp';

const FAQ = [
  { question: 'What does the base warranty cover?', answer: 'Manufacturing defects and functional hardware faults present at the time of sale: display, battery, ports, keyboard. Its length follows the grade: 1 month Refurbished, 3 months Certified, 6 months Pristine.' },
  { question: 'What is the 5-year service plan?', answer: 'Every purchase, in every grade, includes 5 years of free service charges and up to 50% off spare parts. It runs alongside the base warranty and lasts much longer.' },
  { question: 'Does a part replacement extend my warranty?', answer: 'No. A replaced part does not extend or renew the warranty; it runs from your original invoice date.' },
  { question: 'What is not covered?', answer: 'Physical, liquid or burn damage, breakage, software issues or data loss, misuse or unauthorised repairs, and consumables such as batteries, chargers and cables unless agreed in writing.' },
  { question: 'How do I claim warranty or service?', answer: 'Message us on WhatsApp with your invoice and the problem. The unit is inspected at our service location and we repair or replace the faulty part.' },
  { question: 'What parts are used in service repairs?', answer: 'Original used or refurbished parts, subject to availability, so small cosmetic differences are possible.' },
  { question: 'Does the warranty transfer if I resell?', answer: 'No. The warranty and service plan belong to the original purchase and invoice.' },
];

/** The warranty page's close: its questions, then a claim, in place of the footer's "Need help choosing?" */
export function WarrantyFaq() {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-6 pb-10 sm:pb-16 mb-10 sm:mb-14 border-b border-[var(--line)]">
      <div className="lg:col-span-4 grid gap-4 content-start justify-items-start">
        <h2 className="t-h2">Warranty questions</h2>
        <p className="lead">Something not answered here? Send us your invoice number and we will help.</p>
        <a href={waLink('Hi, I have a warranty question. Invoice number: ')} target="_blank" rel="noopener noreferrer" className="btn btn--primary mt-1">
          Ask about my warranty
        </a>
      </div>
      <div className="lg:col-span-7 lg:col-start-6"><FaqSearch items={FAQ} /></div>
    </div>
  );
}
