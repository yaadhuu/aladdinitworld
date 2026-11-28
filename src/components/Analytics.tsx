'use client';

import Script from 'next/script';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { SITE_CONFIG } from '@/config';
import { idFromSlug } from '@/lib/unit-helpers';

/*
  Tracking, off unless an ID is set (then GA4 and/or Meta Pixel load, and only after the visitor accepts):
    NEXT_PUBLIC_GA4_ID          e.g. G-XXXXXXXXXX
    NEXT_PUBLIC_META_PIXEL_ID   the numeric Pixel ID
  Every click on a WhatsApp link fires a Contact event (GA4: "contact", Meta: "Contact") with one shared
  event_id, and the same short code goes into the prefilled WhatsApp message as "Ref <page.place>-<id>" so a
  conversation can be matched to the page and the click. The IDs are format-checked before they reach any script.
  The domains these need are added to the CSP in next.config.ts, only when the ID is set.
*/
const GA4 = /^G-[A-Z0-9]{4,20}$/.test(process.env.NEXT_PUBLIC_GA4_ID ?? '') ? (process.env.NEXT_PUBLIC_GA4_ID as string) : '';
const PIXEL = /^[0-9]{5,20}$/.test(process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '') ? (process.env.NEXT_PUBLIC_META_PIXEL_ID as string) : '';
export const TRACKING = Boolean(GA4 || PIXEL);

const KEY = 'aladdin-consent';
type Consent = 'granted' | 'denied';
type W = Window & { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void; dataLayer?: unknown[] };

const readConsent = (): Consent | null => {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
};

// Where on the site a click came from: "<page>.<place>"
function sourceCode(a: Element, path: string) {
  const [first = '', second = ''] = path.split('/').filter(Boolean);
  const page = !first ? 'home' : first === 'products' ? (second ? `unit-${idFromSlug(second) ?? 'x'}` : 'shop') : path.slice(1).replace(/\//g, '-');
  const place = a.closest('[data-wa-source]')?.getAttribute('data-wa-source')
    ?? (a.closest('header') ? 'nav' : a.closest('footer') ? 'footer' : a.closest('#chat-panel') ? 'ozy' : a.closest('article') ? 'card' : 'page');
  return `${page}.${place}`;
}

const newId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`);

function clearCookies() {
  const host = location.hostname;
  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0].trim();
    if (!/^(_ga|_gid|_gat|_fbp|_fbc)/.test(name)) continue;
    for (const domain of ['', `; domain=${host}`, `; domain=.${host}`]) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
  }
}

export function Analytics() {
  const path = usePathname();
  const [consent, setConsent] = useState<Consent | null>(null);
  const [asking, setAsking] = useState(false);
  const consentRef = useRef<Consent | null>(null);
  const firstPage = useRef(true);

  useEffect(() => {
    if (!TRACKING) return;
    const c = readConsent();
    consentRef.current = c;
    setConsent(c);
    setAsking(c === null);
    const reopen = () => setAsking(true);
    window.addEventListener('open-consent', reopen);
    return () => window.removeEventListener('open-consent', reopen);
  }, []);

  const choose = (c: Consent) => {
    try { localStorage.setItem(KEY, c); } catch { /* private mode: the choice lasts for this visit only */ }
    consentRef.current = c;
    setAsking(false);
    if (c === 'denied' && consent === 'granted') {
      // already loaded: remove its cookies and reload so nothing keeps running
      clearCookies();
      location.reload();
      return;
    }
    setConsent(c);
  };

  // Meta does not follow client-side page changes by itself (GA4 does, through its history-change measurement)
  useEffect(() => {
    if (firstPage.current) { firstPage.current = false; return; }
    if (consent === 'granted') (window as W).fbq?.('track', 'PageView');
  }, [path, consent]);

  // WhatsApp links: put a source code in the message and, with consent, fire the Contact event
  useEffect(() => {
    if (!TRACKING) return;
    const wa = SITE_CONFIG.social.whatsapp;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const original = a.dataset.waHref ?? a.href;
      if (!original.startsWith(wa)) return;
      a.dataset.waHref = original; // a second click starts from the original again, so the code is never added twice
      const id = newId();
      const source = sourceCode(a, path);
      const [base, query = ''] = original.split('?');
      const text = new URLSearchParams(query).get('text');
      a.href = `${base}?text=${encodeURIComponent(`${text ? `${text}\n\n` : ''}Ref ${source}-${id.slice(0, 8)}`)}`;
      if (consentRef.current !== 'granted') return;
      const w = window as W;
      w.gtag?.('event', 'contact', { method: 'whatsapp', source, event_id: id });
      w.fbq?.('track', 'Contact', { source }, { eventID: id });
    };
    document.addEventListener('click', onClick, true);
    document.addEventListener('auxclick', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('auxclick', onClick, true);
    };
  }, [path]);

  if (!TRACKING) return null;
  return (
    <>
      {consent === 'granted' && GA4 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA4}',{allow_google_signals:false,allow_ad_personalization_signals:false});`}
          </Script>
        </>
      )}
      {consent === 'granted' && PIXEL && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL}');fbq('track','PageView');`}
        </Script>
      )}
      {asking && (
        <div className="consent" role="dialog" aria-modal="false" aria-labelledby="consent-title">
          <p id="consent-title" className="consent__title">Cookies</p>
          <p className="consent__text">
            With your OK we measure visits and WhatsApp enquiries using {[GA4 && 'Google Analytics', PIXEL && 'Meta Pixel'].filter(Boolean).join(' and ')}.
            Nothing is loaded until you choose. <Link href="/privacy" className="link link--static !min-h-0">Privacy</Link>
          </p>
          <div className="consent__buttons">
            <button type="button" className="btn btn--secondary btn--sm" onClick={() => choose('denied')}>Decline</button>
            <button type="button" className="btn btn--secondary btn--sm" onClick={() => choose('granted')}>Accept</button>
          </div>
        </div>
      )}
    </>
  );
}

/** Footer link that reopens the choice; nothing is shown while tracking is off */
export function CookieSettings() {
  if (!TRACKING) return null;
  return (
    <button type="button" className="link" onClick={() => window.dispatchEvent(new Event('open-consent'))}>Cookie settings</button>
  );
}
