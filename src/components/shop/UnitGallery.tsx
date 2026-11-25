'use client';

import { useState } from 'react';
import type { UnitPhoto } from '@/config';
import { UnitImage } from '@/components/UnitImage';

/** The photos of one MacBook: a large picture and a row of thumbnails you can tap or tab to */
export function UnitGallery({ photos, label }: { photos: UnitPhoto[]; label: string }) {
  const [active, setActive] = useState(0);
  const main = photos[Math.min(active, photos.length - 1)];

  return (
    <div className="grid gap-3">
      <div className="photo aspect-[4/3] !bg-[#f0f0f2] relative">
        <UnitImage
          key={main.src}
          src={main.src}
          lqip={main.lqip}
          width={main.width}
          height={main.height}
          alt={`${label}, photo ${active + 1} of ${photos.length}`}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="absolute inset-0 w-full h-full object-cover"
          priority
        />
      </div>
      {photos.length > 1 && (
        <ul className="grid grid-cols-4 sm:grid-cols-6 gap-2" aria-label="Photos">
          {photos.map((p, i) => (
            <li key={p.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                aria-label={`Show photo ${i + 1} of ${photos.length}`}
                className={`photo aspect-square w-full relative overflow-hidden transition-opacity ${i === active ? 'ring-2 ring-[var(--ink)]' : 'opacity-70 hover:opacity-100'}`}
              >
                <UnitImage src={p.src} width={160} height={160} alt="" sizes="96px" className="absolute inset-0 w-full h-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
