import type { NextConfig } from 'next';

const dev = process.env.NODE_ENV !== 'production';

// The Studio runs as its own site. /admin only forwards there, and only when STUDIO_URL is set (read at build time).
const studioUrl = process.env.STUDIO_URL;

// Public site: strict. Scripts need 'unsafe-inline' because Next adds inline scripts to static pages;
// a per-request nonce would make every page dynamic and lose the speed for ad traffic.
const publicCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self'",
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
  headers: async () => [{ source: '/(.*)', headers: [...common, { key: 'Content-Security-Policy', value: publicCsp }] }],
};

export default nextConfig;
