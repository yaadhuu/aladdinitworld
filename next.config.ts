import type { NextConfig } from 'next';

const dev = process.env.NODE_ENV !== 'production';

// The Studio runs as its own site. /admin only forwards there, and only when STUDIO_URL is set (read at build time).
const studioUrl = process.env.STUDIO_URL;

// Tracking (GA4, Meta Pixel) is off unless its ID is set; its domains are added to the CSP only then.
// The ID patterns match components/Analytics.tsx.
const GA4 = /^G-[A-Z0-9]{4,20}$/.test(process.env.NEXT_PUBLIC_GA4_ID ?? '');
const PIXEL = /^[0-9]{5,20}$/.test(process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '');
const TRACK = {
  script: [...(GA4 ? ['https://www.googletagmanager.com'] : []), ...(PIXEL ? ['https://connect.facebook.net'] : [])],
  connect: [
    ...(GA4 ? ['https://www.google-analytics.com', 'https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://www.googletagmanager.com'] : []),
    ...(PIXEL ? ['https://www.facebook.com', 'https://connect.facebook.net'] : []),
  ],
  img: [
    ...(GA4 ? ['https://www.google-analytics.com', 'https://www.googletagmanager.com'] : []),
    ...(PIXEL ? ['https://www.facebook.com'] : []),
  ],
};
const add = (base: string, extra: string[]) => [base, ...extra].join(' ');

// Public site: strict. Scripts need 'unsafe-inline' because Next adds inline scripts to static pages;
// a per-request nonce would make every page dynamic and lose the speed for ad traffic.
const publicCsp = [
  "default-src 'self'",
  add(`script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`, TRACK.script),
  "style-src 'self' 'unsafe-inline'",
  add("img-src 'self' data: blob: https://cdn.sanity.io", TRACK.img),
  "font-src 'self' data:",
  "media-src 'self'",
  add("connect-src 'self'", TRACK.connect),
  "frame-src https://www.google.com", // the showroom map on /contact only
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const common = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // The optimizer only fetches from these hosts. Remote photos are resized by their own CDN (see UnitImage).
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  redirects: async () => (studioUrl ? [{ source: '/admin/:path*', destination: studioUrl, permanent: false }] : []),
  headers: async () => [
    { source: '/(.*)', headers: [...common, { key: 'Content-Security-Policy', value: publicCsp }] },
    // Not meant to be found: every build without SEO_INDEX=1 (previews), and the vercel.app address
    // whatever the build, so only the real domain is indexed (canonical: SITE_CONFIG.url)
    ...(process.env.SEO_INDEX === '1' ? [] : [{ source: '/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]),
    { source: '/(.*)', has: [{ type: 'host' as const, value: '(.*)[.]vercel[.]app' }], headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
  ],
};

export default nextConfig;
