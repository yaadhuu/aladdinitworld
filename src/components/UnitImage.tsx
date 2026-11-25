'use client';

import Image, { type ImageLoaderProps, type ImageProps } from 'next/image';

// Photos come from Sanity and are resized by Sanity's own CDN, so the site needs no image server for them.
// Local files keep Next's default handling.
function cdnLoader({ src, width, quality }: ImageLoaderProps) {
  const q = quality ?? 75;
  if (src.startsWith('https://cdn.sanity.io/')) {
    const u = new URL(src);
    u.searchParams.set('w', String(width));
    u.searchParams.set('q', String(q));
    u.searchParams.set('fit', 'max');
    u.searchParams.set('auto', 'format');
    return u.toString();
  }
  return src;
}

/** A Sanity photo; pass `lqip` (Sanity's blurred preview) to show it while the photo loads */
export function UnitImage({ lqip, ...props }: ImageProps & { lqip?: string }) {
  const remote = typeof props.src === 'string' && props.src.startsWith('https://');
  const blur = lqip ? { placeholder: 'blur' as const, blurDataURL: lqip } : {};
  // eslint-disable-next-line jsx-a11y/alt-text -- alt always comes in through props
  return <Image {...props} {...blur} loader={remote ? cdnLoader : undefined} />;
}
