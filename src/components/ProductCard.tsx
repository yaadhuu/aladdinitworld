import Link from 'next/link';
import type { Unit } from '@/config';
import { UnitImage } from '@/components/UnitImage';
import { formatINR, waLink } from '@/lib/whatsapp';
import { gradeName, photoAlt, unitMemory, unitName, unitSlug, warrantyShort } from '@/lib/unit-helpers';

/**
 * One MacBook as a store listing: the photo on its own tile, then the facts in a quiet column
 * (chip and grade, name, memory and battery, price and warranty) and one enquiry button.
 */
export function ProductCard({ unit: u, priority = false }: { unit: Unit; priority?: boolean }) {
  const href = `/products/${unitSlug(u)}`;
  const photo = u.photos[0];
  const name = unitName(u);
  const facts = [unitMemory(u), u.battery !== null ? `Battery ${u.battery}%` : null].filter(Boolean).join(' · ');

  return (
    <article className="pcard flex h-full flex-col">
      <Link href={href} className="photo block relative aspect-[4/3] !rounded-[var(--r-md)] !bg-[#f0f0f2]" tabIndex={-1} aria-hidden="true">
        <UnitImage
          src={photo.src}
          lqip={photo.lqip}
          width={photo.width}
          height={photo.height}
          alt={photoAlt(u, 1, 1)}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="absolute inset-0 w-full h-full object-cover"
          priority={priority}
        />
        {u.status === 'reserved' && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-medium text-[var(--ink)]">Reserved</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-3 sm:pt-4">
        <p className="text-[12px] sm:text-[13px] text-[var(--muted)]">{u.chip} · {gradeName(u.grade)}</p>
        <h3 className="mt-1 text-[15px] sm:text-[16px] font-semibold leading-snug tracking-[-0.01em]">
          <Link href={href} className="pcard__name">{name}</Link>
        </h3>
        {u.headline && <p className="mt-1 text-[12px] sm:text-[13px] font-medium text-[var(--ink)]">{u.headline}</p>}
        <p className="mt-1 text-[13px] sm:text-[14px] leading-snug text-[var(--ink-soft)]">{facts}</p>

        <div className="mt-auto pt-3">
          <p className="flex flex-wrap items-baseline gap-x-2 tabular-nums">
            <span className="text-[17px] sm:text-[19px] font-semibold tracking-[-0.015em]">{formatINR(u.price)}</span>
            {u.originalPrice && (
              <span className="text-[12px] sm:text-[13px] text-[var(--muted)]">
                <span className="sr-only">Was </span>
                <del>{formatINR(u.originalPrice)}</del>
              </span>
            )}
          </p>
          <p className="mt-0.5 text-[12px] sm:text-[13px] text-[var(--muted)]">{warrantyShort(u.grade)} warranty</p>
          <a
            href={waLink(`Hi, is the ${name} (${unitMemory(u)}, ${gradeName(u.grade)}, ${formatINR(u.price)}, ref ${u.id}) available? Please send live photos and the battery report.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--secondary btn--sm w-full mt-3"
          >
            Enquire
            <span className="sr-only"> about {name} on WhatsApp (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </article>
  );
}
