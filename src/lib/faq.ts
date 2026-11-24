// Questions and answers for the website. Read from Sanity (cached about 60 seconds); the snapshot in config is used only if Sanity is unreachable.
import 'server-only';
import { SITE_CONFIG } from '@/config';
import { sanityFetch } from '@/sanity/client';
import { Q_FAQ } from '@/sanity/queries';

export type Faq = { question: string; answer: string };

export async function getFaqs(): Promise<Faq[]> {
  const rows = await sanityFetch<{ question?: unknown; answer?: unknown }[]>(Q_FAQ);
  if (!rows) return SITE_CONFIG.faqItems;
  return rows.flatMap((r) => {
    const question = typeof r.question === 'string' ? r.question.trim() : '';
    const answer = typeof r.answer === 'string' ? r.answer.trim() : '';
    return question && answer ? [{ question, answer }] : [];
  });
}
