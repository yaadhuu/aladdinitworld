import Link from 'next/link';
import type { Unit } from '@/config';
import { UnitImage } from '@/components/UnitImage';
import { formatINR, waLink } from '@/lib/whatsapp';
import { gradeName, unitMemory, unitName, unitSlug, warrantyShort } from '@/lib/unit-helpers';

/**
 * One MacBook: photo, name, the specs that matter, grade, price, enquiry.
 * Under 640px it becomes a store tile (two per row): smaller type.
 */
export function ProductCard({ unit: u, priority = false }: { unit: Unit; priority?: boolean }) {
  const href = `/products/${unitSlug(u)}`;
  const photo = u.photos[0];
  const name = unitName(u);

  return (
    <article className="card card--lift">
      <Link href={href} className="photo !rounded-none aspect-square sm:aspect-[4/3] !bg-[#f0f0f2] block relative" tabIndex={-1} aria-hidden="true">
        <UnitImage
          src={photo.src}
          width={photo.width}
          height={photo.height}
          alt=""
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="absolute inset-0 w-full h-full object-cover"
          priority={priority}
        />
        {u.status === 'reserved' && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-medium text-[var(--ink)] backdrop-blur">Reserved</span>
        )}
      </Link>

      <div className="flex flex-col gap-3 sm:gap-5 p-3.5 sm:p-6 flex-1">
        <div className="grid gap-1 sm:gap-1.5">
          <p className="label max-sm:!text-[12px]">{u.chip}</p>
          <h3 className="t-card max-sm:!text-[15px] max-sm:!leading-[1.3]">
            <Link href={href} className="hover:underline underline-offset-4">
              {name}
            </Link>
          </h3>
          {u.headline && <p className="text-[13px] sm:text-[14px] font-medium leading-[1.4]">{u.headline}</p>}
          <ul className="text-[13px] sm:text-[15px] leading-[1.5] text-[var(--ink-soft)]">
            <li>{unitMemory(u)}</li>
            {u.battery !== null && <li className="max-sm:hidden">Battery health {u.battery}%</li>}
          </ul>
        </div>

        <p className="text-[12px] sm:text-[14px] text-[var(--ink-soft)]">
          <span className="font-medium text-[var(--ink)]">{gradeName(u.grade)}</span> grade
        </p>

        <div className="mt-auto grid gap-3 pt-3 sm:pt-5 border-t border-[var(--line)]">
          <div className="flex max-sm:flex-col sm:items-baseline sm:justify-between gap-1 sm:gap-2">
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 leading-none tabular-nums">
              <span className="text-[18px] sm:text-[24px] font-semibold tracking-[-0.02em]">{formatINR(u.price)}</span>
              {u.originalPrice && (
                <span className="text-[13px] sm:text-[15px] text-[var(--muted)]">
                  <span className="sr-only">Was </span>
                  <del>{formatINR(u.originalPrice)}</del>
                </span>
              )}
            </p>
            <p className="text-[12px] sm:text-[13px] text-[var(--muted)] whitespace-nowrap">{warrantyShort(u.grade)} warranty</p>
          </div>
          <a
            href={waLink(`Hi, is the ${name} (${unitMemory(u)}, ${gradeName(u.grade)}, ${formatINR(u.price)}, ref ${u.id}) available? Please send live photos and the battery report.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--secondary btn--sm w-full"
          >
            Enquire
            <span className="sr-only"> about {name}</span>
          </a>
        </div>
      </div>
    </article>
  );
}
