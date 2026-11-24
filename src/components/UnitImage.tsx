'use client';

import Image, { type ImageLoaderProps, type ImageProps } from 'next/image';

// Remote photos are resized by their own CDN (Sanity, Cloudinary), so the site needs no image server of its own.
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
  if (src.startsWith('https://res.cloudinary.com/')) return src.replace('/image/upload/', `/image/upload/c_limit,w_${width},q_${q},f_auto/`);
  return src;
}

export function UnitImage(props: ImageProps) {
  const remote = typeof props.src === 'string' && props.src.startsWith('https://');
  // eslint-disable-next-line jsx-a11y/alt-text -- alt always comes in through props
  return <Image {...props} loader={remote ? cdnLoader : undefined} />;
}
