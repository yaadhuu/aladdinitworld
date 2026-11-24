import { SITE_CONFIG } from '@/config';

/** The page's one main action (opens WhatsApp), worded the same everywhere */
export const MAIN_ACTION = 'Contact';

/** A wa.me link, optionally with a prefilled message */
export function waLink(text?: string) {
  return text ? `${SITE_CONFIG.social.whatsapp}?text=${encodeURIComponent(text)}` : SITE_CONFIG.social.whatsapp;
}

export const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/** Opens the chat panel from anywhere (tab bar, buttons) */
export const openChat = () => window.dispatchEvent(new CustomEvent('open-chat'));
