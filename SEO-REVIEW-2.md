# SEO follow-up: review report (round 2)

Branch `seo-fixes`, committed locally, **not pushed**. Builds on SEO-REVIEW.md. Part B items (warranty, grade, inspection, review count, sustainability, legal, returns/delivery/EMI wording, tracking IDs, geo, nav, hero/design) were not touched.

Two commits on the branch:
1. `c9ad4b5`: the round-1 SEO foundation, which had been left uncommitted in the working tree. Committed first so this round's diff is separate.
2. This round's changes (below).

## Checks

| Check | Result |
|---|---|
| `npx tsc --noEmit` | exit 0 |
| `next lint` | exit 0, one existing warning (`ScrollHero.tsx:284`, unused eslint-disable) |
| `npm run build` (SEO_INDEX unset) | exit 0, 26 pages |
| `npm run build` (SEO_INDEX=1) | exit 0 |
| `metadataBase` build warning | gone |

Routes: `/`, `/products`, `/reviews` revalidate every 60 s; `/b2b`, `/contact`, `/privacy`, `/terms`, `/warranty`, `/why-cpo`, `/robots.txt`, `/sitemap.xml`, `/icon`, `/opengraph-image` are static; `/products/[slug]` is SSG (7 pages); `/api/*` are dynamic. See "Side effects" below for a change in how often some static pages refresh.

## Files changed

| File | Change |
|---|---|
| `src/app/layout.tsx` (moved from `src/app/(site)/layout.tsx`) | Now the root layout. `metadataBase` is set once from `SITE_URL`; the `keywords` meta tag is removed; default Open Graph and Twitter image added. CSS import paths fixed for the new location. |
| `src/lib/seo.ts` | `pageMeta()` takes an optional photo and otherwise uses the site image; added `DEFAULT_OG_IMAGE`; hard-coded page dates removed. |
| `src/components/StructuredData.tsx` | `FAQPage` split into its own `FaqSchema`; `priceRange` removed; the business block no longer fetches FAQs. |
| `src/app/(site)/page.tsx` | Renders `FaqSchema` for the questions it shows (first 6). |
| `src/app/(site)/products/[slug]/page.tsx` | Unit metadata through `pageMeta()` with the new title format and the main photo as the social image; struck-through price removed; lead line now says grade, RAM and storage in words. |
| `src/lib/unit-helpers.ts` | New `unitTitle`, `unitSpecs`; `photoAlt` now always includes the photo number. |
| `src/components/ProductCard.tsx` | Shows grade, RAM and storage in words and the unit's condition note; struck-through price removed; image alt is name + specs + photo number. |
| `src/components/Navigation.tsx` | `Wordmark` takes an `alt`; the header logo is `alt="Aladdin IT World"`, the footer logo stays `alt=""`. |
| `src/components/home/FaqSearch.tsx` | The question text is an `<h3>` inside the summary, same look. |
| `src/app/sitemap.ts` | No hard-coded dates. Static pages have no `lastModified`; units use their Sanity `_updatedAt`; `/products` uses the newest unit's `_updatedAt`. |

## What was done, item by item

**A1 Structured data.** `FAQPage` JSON-LD is on `/` only, and lists the 6 questions the home page shows (not the 12 behind "Show all"), so the markup matches what is visible. `priceRange` removed. `geo` is still omitted (`SITE_CONFIG.showroom.geo` is empty).

**A2 Metadata.** `metadataBase` is set once in the root layout. There was no layout at `src/app/`: the layout lived inside the `(site)` route group, so routes outside the group (`/_not-found`, the icon and social-image routes) had no base and caused the build warning. Moving the layout up one level fixed it. `keywords` removed. Unit pages use `pageMeta()`, so the page title, description, canonical, `og:url` and `og:image` are all present. The social image is the unit's main photo cropped to 1200x630 by Sanity's image CDN. Unit title format: `{Model}, {RAM}GB/{Storage}, {Grade} | Aladdin IT World`; a missing part is left out, and nothing is invented.

**A3 Same-name units.** Names are unchanged. Each card now says, in words, `Certified grade · 16GB RAM · 512GB storage`, plus the unit's own condition note (the `cosmetic` field, "Outside condition") and battery % when they exist. No new data fields. Image alt is `name, specs, photo 1` (gallery images: `photo 1 of 3`).

**A4 Images and headings.** Header logo alt added; footer logo left empty. Home FAQ questions are real `h3` elements inside each summary (6 found in the page; same look).

**A5 Sitemap.** Hard-coded dates deleted. Eight `lastmod` values remain: `/products` plus the 7 units, all from Sanity.

**A6 Brand rule.** The struck-through "was" price is gone from cards and unit pages. The review marquee duplication is **intentional** (a seamless loop): the second copy was already `aria-hidden`, confirmed in the page (4 of 8 items hidden), so nothing was changed.

## Head output from curl (built with `SEO_INDEX=1`, served locally)

```
### /
title:      Certified Pre-Owned MacBooks in Kerala | Aladdin IT World
canonical:  https://aladdinitworld.com
og:title:   Certified Pre-Owned MacBooks in Kerala | Aladdin IT World
og:url:     https://aladdinitworld.com
og:image:   https://aladdinitworld.com/opengraph-image [count=1]
robots:     index, follow
keywords:   0
x-robots:   (none)
json-ld:    ElectronicsStore, FAQPage
### /products
title:      Shop Certified Pre-Owned MacBooks | Aladdin IT World
canonical:  https://aladdinitworld.com/products
og:title:   Shop Certified Pre-Owned MacBooks | Aladdin IT World
og:url:     https://aladdinitworld.com/products
og:image:   https://aladdinitworld.com/opengraph-image [count=1]
robots:     index, follow
keywords:   0
x-robots:   (none)
json-ld:    ElectronicsStore
### /warranty
title:      Warranty and 5-Year Service Plan | Aladdin IT World
canonical:  https://aladdinitworld.com/warranty
og:title:   Warranty and 5-Year Service Plan | Aladdin IT World
og:url:     https://aladdinitworld.com/warranty
og:image:   https://aladdinitworld.com/opengraph-image [count=1]
robots:     index, follow
keywords:   0
x-robots:   (none)
json-ld:    ElectronicsStore
### /contact
title:      Visit Us or Get in Touch | Aladdin IT World
canonical:  https://aladdinitworld.com/contact
og:title:   Visit Us or Get in Touch | Aladdin IT World
og:url:     https://aladdinitworld.com/contact
og:image:   https://aladdinitworld.com/opengraph-image [count=1]
robots:     index, follow
keywords:   0
x-robots:   (none)
json-ld:    ElectronicsStore
### /products/macbook-pro-m1-pro-14-inch-16gb-512gb-26e90711
title:      MacBook Pro, 16GB/512GB, Certified | Aladdin IT World
canonical:  https://aladdinitworld.com/products/macbook-pro-m1-pro-14-inch-16gb-512gb-26e90711
og:title:   MacBook Pro, 16GB/512GB, Certified | Aladdin IT World
og:url:     https://aladdinitworld.com/products/macbook-pro-m1-pro-14-inch-16gb-512gb-26e90711
og:image:   https://cdn.sanity.io/images/xixk9gcs/production/0504c8fe0b55478a84e7aa2ea8f4268659847455-2400x1800.jpg?w=1200&h=630&fit=crop&q=80&fm=jpg
robots:     index, follow
keywords:   0
x-robots:   (none)
json-ld:    ElectronicsStore, Product
```

`robots.txt` in this build ends with `Sitemap: https://aladdinitworld.com/sitemap.xml`.

## Same pages with `SEO_INDEX` unset

All five pages: `<meta name="robots" content="noindex, follow">` and the header `X-Robots-Tag: noindex, nofollow`. `robots.txt` has **no** Sitemap line (0 matches). A request with the host `aladdinitworld.vercel.app` also gets `X-Robots-Tag: noindex, nofollow`.

## Found missing for unit pages (live Sanity data, 7 published units)

| Field | Missing on |
|---|---|
| battery | all 7 |
| cosmetic (condition note) | all 7 |
| headline | all 7 |
| year | 6 of 7 |
| description | 6 of 7 |
| included (what is in the box) | 6 of 7 |
| model, screen, chip, RAM, storage, grade, price, photos | none missing |

Result today: no card shows a condition note or battery, because no unit has them filled in. The code shows them as soon as staff fill them in.

## Problems found, and things that could not be done

1. **The requested unit title format creates duplicate titles.** Four units are all titled `MacBook Pro, 16GB/512GB, Certified | Aladdin IT World` (ids ending `26e90711`, `f9bc69c2`, `98aca296`, `c3af61dd`): they differ only in chip and screen size, which the format leaves out. Search engines will see four identical titles. I followed the format exactly. Adding the chip or screen (for example `MacBook Pro 14" M1 Pro, 16GB/512GB, Certified`) would fix it; that needs your decision.
2. **Cards of same-name units are only distinguishable by what staff enter.** With no condition note or battery filled in, two same-name, same-grade, same-spec units still look the same. The fields exist; the data is empty.
3. **`best price` and `lowest price` wording remains** in two places that are not cards or unit pages, so I left them (they are grade wording, which is Part B): the grade FAQ fallback in `src/config/index.ts` ("fully tested, best price") and the Refurbished grade description ("at the lowest price"). The chat assistant also still recognises "best price" in a visitor's question; that is not shown to anyone.
4. **The "Price before offer" field still exists** in the Studio and in the site's data code. The site now ignores it. Staff may still fill it in expecting it to show. Remove it from the Studio when that is approved.
5. **Pages with no Sanity data became fully static.** `/b2b`, `/contact`, `/privacy`, `/terms`, `/warranty` and `/why-cpo` used to refresh every minute only because the old layout fetched Sanity data. The layout no longer fetches, so these pages update on redeploy only. None of them shows CMS content, so nothing visible changes.
6. **Round 1 had a gap, fixed here.** Pages using `pageMeta()` had no `og:image` at all (their own Open Graph block replaced the site-wide one). Every page now has exactly one.
7. **Not verified:** the live Vercel deployment, Google's Rich Results Test and a social-preview debugger. I checked only the locally built site. `geo` stays empty until coordinates are provided.
8. **Before pushing:** the site is still `noindex` until `SEO_INDEX=1` is set on Production (see SEO-REVIEW.md).
