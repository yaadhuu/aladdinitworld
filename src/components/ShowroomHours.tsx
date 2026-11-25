'use client';

import { useEffect, useState } from 'react';
import { BUSINESS_HOURS } from '@/config';

const DAYS = Object.keys(BUSINESS_HOURS) as (keyof typeof BUSINESS_HOURS)[]; // monday first
const fmt = (h: string) => h.replace(/:00/g, '').replace(/AM/g, 'am').replace(/PM/g, 'pm');

// "9:00 AM – 9:00 PM" -> [540, 1260] minutes; "Closed" -> null
function range(h: string): [number, number] | null {
  const m = [...h.matchAll(/(\d{1,2}):(\d{2})\s*(AM|PM)/g)].map(([, hh, mm, ap]) => ((+hh % 12) + (ap === 'PM' ? 12 : 0)) * 60 + +mm);
  return m.length === 2 ? [m[0], m[1]] : null;
}

// The showroom's local time (India), whatever the visitor's clock says
function nowInIndia() {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const get = (t: string) => p.find((x) => x.type === t)?.value ?? '';
  return { day: get('weekday').toLowerCase() as (typeof DAYS)[number], min: +get('hour') * 60 + +get('minute') };
}

function status(day: (typeof DAYS)[number], min: number) {
  const r = range(BUSINESS_HOURS[day]);
  if (r && min >= r[0] && min < r[1]) return { open: true, text: `Open now · closes ${fmt(BUSINESS_HOURS[day].split('–')[1].trim())}` };
  const i = DAYS.indexOf(day);
  for (let k = r && min < r[0] ? 0 : 1; k <= 7; k++) {
    const d = DAYS[(i + k) % 7];
    const next = BUSINESS_HOURS[d];
    if (range(next)) {
      const when = k === 0 ? 'today' : k === 1 ? 'tomorrow' : d.charAt(0).toUpperCase() + d.slice(1);
      return { open: false, text: `Closed · opens ${when} at ${fmt(next.split('–')[0].trim())}` };
    }
  }
  return { open: false, text: 'Closed' };
}

/** Opening hours with today marked and a live open or closed line. Before hydration it shows the plain table. */
export function ShowroomHours() {
  const [now, setNow] = useState<ReturnType<typeof nowInIndia> | null>(null);
  useEffect(() => {
    setNow(nowInIndia());
    const t = setInterval(() => setNow(nowInIndia()), 60_000);
    return () => clearInterval(t);
  }, []);
  const s = now ? status(now.day, now.min) : null;

  return (
    <div className="grid gap-4">
      <p className="flex items-center gap-2.5 min-h-[24px] text-[15px] font-medium" aria-live="polite">
        {s && (
          <>
            <span className={`live-dot ${s.open ? 'live-dot--open' : ''}`} aria-hidden="true" />
            {s.text}
          </>
        )}
      </p>
      <dl className="grid">
        {DAYS.map((d) => {
          const today = now?.day === d;
          return (
            <div key={d} className={`flex justify-between gap-6 px-3 -mx-3 py-2 sm:py-2.5 rounded-[10px] text-[14px] sm:text-[15px] transition-colors ${today ? 'bg-white font-medium' : ''}`}>
              <dt className="capitalize">{d}{today && <span className="sr-only"> (today)</span>}</dt>
              <dd className={`tabular-nums ${today ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)]'}`}>{fmt(BUSINESS_HOURS[d])}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
