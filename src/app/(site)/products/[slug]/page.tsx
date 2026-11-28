import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRightIcon } from '@/components/Icons';
import { BreadcrumbSchema, UnitSchema } from '@/components/StructuredData';
import { ProductCard } from '@/components/ProductCard';
import { UnitGallery } from '@/components/shop/UnitGallery';
import { getUnit, getUnits, getUnitSlugs, gradeName, photoAlt, unitMemory, unitName, unitSlug, unitSpecs, unitTitle, warrantyShort } from '@/lib/products';
import { pageMeta } from '@/lib/seo';
import { formatINR, waLink } from '@/lib/whatsapp';

// Static, rebuilt in the background about every 60 seconds. A unit that is sold or unpublished returns a 404.
export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getUnitSlugs()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const unit = await getUnit((await params).slug);
  if (!unit) return { title: 'MacBook not found | Aladdin IT World', robots: { index: false } };
  const name = unitName(unit);
  const photo = unit.photos[0];
  return pageMeta({
    title: `${unitTitle(unit)} | Aladdin IT World`,
    // same wording as before
    description: `${gradeName(unit.grade)} certified pre-owned ${name} with ${unitMemory(unit)}. ${warrantyShort(unit.grade)} warranty and our 5-year service plan.`,
    path: `/products/${unitSlug(unit)}`,
    // the main photo, cropped to the 1200x630 social size by Sanity's image CDN
    image: { url: `${photo.src}?w=1200&h=630&fit=crop&q=80&fm=jpg`, width: 1200, height: 630, alt: photoAlt(unit, 1, unit.photos.length) },
  });
}

export default async function UnitPage({ params }: Props) {
  const unit = await getUnit((await params).slug);
  if (!unit) notFound();

  const name = unitName(unit);
  // up to four other MacBooks at the nearest prices, so every MacBook page links on to more
  const more = (await getUnits()).units
    .filter((u) => u.id !== unit.id)
    .sort((a, b) => Math.abs(a.price - unit.price) - Math.abs(b.price - unit.price))
    .slice(0, 4);
  const rows: [string, string | null][] = [
    ['Model', unit.model],
    ['Screen', `${unit.screen}-inch`],
    ['Chip', unit.chip],
    ['Memory', `${unit.ram}GB`],
    ['Storage', unit.storage],
    ['Year', unit.year ? String(unit.year) : null],
    ['Battery health', unit.battery !== null ? `${unit.battery}%` : null],
    ['Outside condition', unit.cosmetic],
    ['In the box', unit.included.length ? unit.included.join(', ') : null],
  ];

  return (
    <>
      <UnitSchema unit={unit} />
      <BreadcrumbSchema items={[{ name: 'Home', path: '' }, { name: 'MacBooks', path: '/products' }, { name, path: `/products/${unitSlug(unit)}` }]} />
      <section className="pt-6 sm:pt-12 pb-16 sm:pb-28">
        <nav aria-label="Breadcrumb" className="wrap mb-4 sm:mb-6">
          <ol className="flex flex-wrap items-center gap-x-2 text-[14px] text-[var(--ink-soft)]">
            <li><Link href="/" className="link !min-h-0 py-2">Home</Link></li>
            <li aria-hidden="true"><ArrowRightIcon className="w-3 h-3 text-[var(--muted)]" /></li>
            <li><Link href="/products" className="link !min-h-0 py-2">MacBooks</Link></li>
            <li aria-hidden="true"><ArrowRightIcon className="w-3 h-3 text-[var(--muted)]" /></li>
            <li aria-current="page" className="text-[var(--ink)] truncate max-w-[60vw]">{name}</li>
          </ol>
        </nav>
        <div className="wrap grid gap-8 lg:gap-14 lg:grid-cols-2 lg:items-start">
          <UnitGallery photos={unit.photos} label={`${name}, ${unitMemory(unit)}`} />

          <div className="grid gap-8">
            <div className="grid gap-3 justify-items-start">
              <p className="label">{unit.chip}{unit.status === 'reserved' ? ' · Reserved' : ''}</p>
              <h1 className="t-h1 !text-[clamp(30px,2.4vw+20px,52px)]">{name}</h1>
              {unit.headline && <p className="text-[17px] sm:text-[19px] font-medium">{unit.headline}</p>}
              <p className="lead">{gradeName(unit.grade)} grade. {unitSpecs(unit)}.</p>
            </div>

            <div className="grid gap-4 pt-6 border-t border-[var(--line)]">
              <div className="flex items-baseline justify-between gap-4">
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 leading-none tabular-nums">
                  <span className="text-[32px] sm:text-[40px] font-semibold tracking-[-0.02em]">{formatINR(unit.price)}</span>
                </p>
                <p className="text-[14px] text-[var(--muted)]">{warrantyShort(unit.grade)} warranty</p>
              </div>
              <a
                href={waLink(`Hi, is the ${name} (${unitMemory(unit)}, ${gradeName(unit.grade)}, ${formatINR(unit.price)}, ref ${unit.id}) available? Please send live photos and the battery report.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
              >
                {unit.status === 'reserved' ? 'Ask if it is still free' : 'Enquire about this MacBook'}
              </a>
              <p className="text-[14px] leading-[1.6] text-[var(--ink-soft)]">
                Includes our 5-year service plan.
              </p>
            </div>

            {unit.description && (
              <p className="text-[17px] leading-[1.65] text-[var(--ink-soft)] whitespace-pre-line max-w-[60ch]">{unit.description}</p>
            )}

            <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 pt-6 border-t border-[var(--line)] text-[15px]">
              {rows.filter((r): r is [string, string] => r[1] !== null).map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-[var(--ink-soft)]">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>

            <Link href="/why-cpo" className="link link--static justify-self-start">
              What {gradeName(unit.grade)} grade means
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section aria-labelledby="more-title" className="pb-16 sm:pb-24">
          <div className="wrap grid gap-6 sm:gap-8">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <h2 id="more-title" className="t-h3">More MacBooks</h2>
              <Link href="/products" className="link">
                See all MacBooks
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
              {more.map((m) => <li key={m.id}><ProductCard unit={m} /></li>)}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
