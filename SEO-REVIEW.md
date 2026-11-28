# SEO foundation: review report

Review of the SEO foundation changes, made on 2026-11-28. Review only: no source changes were made while writing this report. Everything below is **uncommitted** on `main` (in sync with `origin/main`).

## 1. `git status` and `git diff --stat`

```
 M .env.example                      |  8 +++
 M next.config.ts                    | 31 ++++++--
 M src/app/(site)/b2b/page.tsx       |  7 ++
 M src/app/(site)/contact/page.tsx   |  7 ++
 M src/app/(site)/layout.tsx         |  7 +-
 M src/app/(site)/page.tsx           |  7 ++
 M src/app/(site)/privacy/page.tsx   |  7 ++
 M src/app/(site)/products/page.tsx  | 11 +--
 M src/app/(site)/reviews/page.tsx   |  7 ++
 M src/app/(site)/terms/page.tsx     |  7 ++
 M src/app/(site)/warranty/page.tsx  |  7 ++
 M src/app/(site)/why-cpo/page.tsx   |  7 ++
 M src/app/robots.ts                 | 12 +--
 M src/app/sitemap.ts                | 19 ++--
 M src/components/Footer.tsx         |  2 +
 M src/components/ProductCard.tsx    |  4 +-
 M src/components/StructuredData.tsx | 70 ++++++-----
 M src/config/index.ts               |  5 +
 M src/styles/site.css               | 10 +
?? src/components/Analytics.tsx      (new)
?? src/lib/seo.ts                    (new)

19 files changed, 180 insertions(+), 55 deletions(-), plus 2 new files
```

## 2. What changed in each file, and why

| File | Change | Why |
|---|---|---|
| `src/lib/seo.ts` (new) | `SITE_URL` (from `SITE_CONFIG.url`), `INDEXABLE` flag (`SEO_INDEX=1`), `pageMeta()` helper (title, description, canonical, Open Graph, Twitter), real page-modified dates | One canonical host and one place for page metadata |
| `src/components/Analytics.tsx` (new) | Consent banner, GA4 and Meta Pixel loading after Accept, Contact event on WhatsApp clicks (with `event_id`), `Ref` code in the prefilled message, "Cookie settings" link | Tracking, off unless an ID is set |
| 9 page files (home, products, why-cpo, warranty, reviews, b2b, contact, privacy, terms) | Import plus a `pageMeta()` metadata block; products replaces its old metadata. No body changes | Each page gets its own title, description and canonical |
| `(site)/layout.tsx` | Robots meta follows `SEO_INDEX`; `siteName` added to Open Graph; mounts `<Analytics />` | Noindex off-production; tracking mount |
| `sitemap.ts` | Uses `SITE_URL` and real dates; `/products` and home follow the newest MacBook change; a MacBook with no change date gets none instead of today's | Real `lastModified` values |
| `robots.ts` | Sitemap line only when `SEO_INDEX=1`; crawling stays open | Search engines must be able to read the `noindex` |
| `StructuredData.tsx` | Removed `aggregateRating`, `review` and the sitewide reviews fetch. Added `@id`, `logo`, `image`, opening hours (from `BUSINESS_HOURS`), `areaServed`; `geo` only when set. Product schema gets `sku` (unit id). Address region read from config | Only real, visible facts in the markup |
| `config/index.ts` | New `areaServed: "India"` and an empty `showroom.geo` (TODO(owner)) | Source for the structured data without inventing values |
| `ProductCard.tsx` | Image alt changed from empty to product name and specs, e.g. `MacBook Pro Intel i7 16", 16GB · 512GB` | Descriptive alt text |
| `Footer.tsx` | Adds the Cookie settings link (renders nothing while tracking is off) | Lets visitors change their choice |
| `next.config.ts` | Conditional CSP domains; `X-Robots-Tag: noindex` headers | Tracking domains only when needed; noindex off-production |
| `site.css` | Cookie banner styles | Consent UI |
| `.env.example` | Documents the three new variables | Setup guidance |

## 3. Content-Security-Policy

With none of the tracking IDs set, the CSP is **unchanged** from before:

```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https://cdn.sanity.io; font-src 'self' data:; media-src 'self';
connect-src 'self'; frame-src https://www.google.com; object-src 'none'; base-uri 'self';
form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
```

With both IDs set, only three directives grow (verified in a test-ID build):

```
script-src  'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net
img-src     'self' data: blob: https://cdn.sanity.io https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com
connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com https://connect.facebook.net
```

Only the GA4 ID adds just the Google domains; only the Pixel ID adds just the Meta ones.

## 4. New environment variables (names only)

| Variable | What it does |
|---|---|
| `SEO_INDEX` | Set to `1` to let search engines index. Unset, every build sends `noindex`, the sitemap is dropped from `robots.txt`, and the meta robots tag says noindex. `*.vercel.app` is always `noindex` regardless. |
| `NEXT_PUBLIC_GA4_ID` | GA4 measurement ID, format-checked before use. Loads GA4 after consent and adds the Google CSP domains. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID, digits only. Loads the Pixel after consent and adds the Meta CSP domains. |

With either tracking ID set, the cookie banner and the `Ref` code in WhatsApp messages also switch on.

## 5. Checks

- **`npx tsc --noEmit`:** exit 0, no errors.
- **`next lint`:** exit 0, one existing warning (unused eslint-disable at `src/components/ScrollHero.tsx:284`). `next lint` is deprecated in Next 16.
- **`npm run build`:** exit 0, "Compiled successfully", 26 pages generated.

| Type | Routes |
|---|---|
| Static (○) | `/`, `/b2b`, `/contact`, `/privacy`, `/products`, `/reviews`, `/terms`, `/warranty`, `/why-cpo`, `/robots.txt`, `/sitemap.xml`, `/icon`, `/opengraph-image`, `/_not-found` |
| SSG (●) | `/products/[slug]`: 7 pages |
| Dynamic (ƒ) | `/api/chat`, `/api/draft-mode/enable`, `/api/draft-mode/disable` |

Static pages revalidate every minute. No page became dynamic because of these changes.

The build prints a `metadataBase property in metadata export is not set` warning twice. I did not check whether it appeared before these changes; it probably comes from pages outside the `(site)` layout.

## 6. Not done, not verified, and risks

**Asked for but not fully done**
- `geo` is not in the structured data: `SITE_CONFIG` has no coordinates and none may be invented. Fill in `showroom.geo`.

**Not verified**
- Meta `Contact` events reaching Meta, and GA4 `contact` appearing in reports (fake IDs only; confirmed the call fires with the right `event_id` and the scripts load without CSP errors).
- Google's Rich Results Test, Search Console behaviour, and the banner on a real phone (seen only in the preview browser at phone size).
- `/opengraph-image` returns 200 locally; not confirmed that Google accepts it as the business `image`.
- The `vercel.app` noindex header, tested locally with a faked Host header, not on the live URL.

**Risky or wrong, in order of importance**
1. **Pushing as-is turns the live site `noindex`.** `SEO_INDEX` is not set on Vercel and `aladdinitworld.com` may not serve the site yet. Set `SEO_INDEX=1` on Production at the same time the domain goes live.
2. **The privacy policy does not mention cookies or analytics.** Legal text was not edited. Update it before tracking goes on.
3. **`Ref` code is sent before consent.** With either ID set it is added to every WhatsApp message, even if the visitor declined. It is page and click data only, no personal data, but it is a decision for the owner.
4. **Sitemap dates are fixed values in `seo.ts`** and go stale when a page is edited.
5. **Existing issues left alone:** `priceRange: "₹₹"` has no data behind it; FAQ structured data is on every page but the FAQ is visible only on the home page; unit pages set their own Open Graph block, which drops the page title and description from it.
6. **Open Graph:** the home, products and unit pages used to inherit the layout's Open Graph description; each page now sets its own full block.

## 7. Claim wording

- **Page body text:** no warranty, inspection, review or sustainability wording was changed on any page. Each page diff is only the import and the metadata block.
- **Structured data:** the machine-readable `aggregateRating` and `review` entries were removed. The visible reviews and rating line on the home page are unchanged. No sustainability text was touched.
- **New metadata text** that mentions those topics, restating what the pages already say. Please review:
  - Home description: "each inspected and covered by a warranty"
  - Products description: "each inspected, graded and warranted" (existing wording kept; "chip" replaced by "processor" to match the filter)
  - Warranty title and description: "Base warranty by grade (1, 3 or 6 months), the 5-year service plan on every MacBook…"
  - Grades description: "inspected and graded Refurbished, Certified or Pristine, with the checks, criteria and warranty for each grade"
  - Reviews title and description: "Reviews from MacBook Buyers" (the page's own h1) and "What buyers say about their MacBook…"
  - Terms description: "including warranty and service terms". This phrasing is new; confirm it matches the Terms page.
