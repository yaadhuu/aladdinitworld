# Aladdin IT World

Next.js 15 site for certified pre-owned MacBooks. Stock is edited in a Sanity Studio that is a **separate project** (`../studio-aladdinitworld`). The site only reads the content, and contains no admin code.

## Run the site

```powershell
npm install
npm run dev          # http://localhost:3000
npm run type-check   # tsc
npm run lint
npm run build
```

With no Sanity project configured, the shop shows "no MacBooks yet" (see "How the fallback works").

## Environment variables

Copy `.env.example` to `.env.local`. Names only live in the repo; `.env*` is git-ignored except `.env.example`.

| Name | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | public | Identifies the Sanity project |
| `NEXT_PUBLIC_SANITY_DATASET` | public | `production` or `staging` |
| `SANITY_API_READ_TOKEN` | server only, optional | Read-only token. Not needed for a public dataset. Never put it in a `NEXT_PUBLIC_` variable |
| `ANTHROPIC_API_KEY` | server only | AI assistant |
| `TRUSTED_PROXY` | server only | Set to `1` only behind your own proxy that overwrites `x-forwarded-for` |

No Sanity write token exists anywhere in the site code.

## The Studio (separate project)

The Studio lives in its own folder and its own private git repo, next to this one: `../studio-aladdinitworld`. It holds the schema, the Stock menu, roles and validation. This app only reads published content.

1. Run it locally: in `studio-aladdinitworld`, run `npm install`, then `npm run dev` (http://localhost:3333). It needs Node 22.22+, 24.15+ or 26+.
2. Sanity project settings (sanity.io/manage), API, CORS origins, each with **Allow credentials** ticked: `http://localhost:3333` and the final Studio address. This app needs no entry because it reads on the server. Never add `*`.
3. Host it, either way, once its repo is ready:
   - `npm run deploy` hosts it free at `<name>.sanity.studio`.
   - `npm run build` makes a static site in `dist/` that any static host can serve on your own subdomain (for example `admin.aladdinitworld.com`). Every path must fall back to `index.html`.
4. Set `STUDIO_URL` in this app's environment. `/admin` on the site then forwards there (read at build time). Without it, `/admin` is a 404.

Roles are set in the Sanity project (Members): CEO as Administrator, sales as Editors. Sales staff see only Stock and Home page featured. Administrators also see Vision and everything else, and are the only ones who can delete. Turn on two-step verification for everyone.

## Add a unit

Stock, All MacBooks, **+**. Fill in the five tabs, add 1 to 6 photos, Publish. Full steps for staff: [docs/SALES-GUIDE.md](docs/SALES-GUIDE.md).

Dropdown lists (chips, memory, sizes, in-the-box items) live in the Studio, in `../studio-aladdinitworld/schemaTypes/options.ts`. Add a line there to add a choice.

Not stored in Sanity, because the Free dataset is public: serial numbers, purchase source, cost price, internal notes.

## How data flows

```
Studio (separate repo) -> Sanity dataset -> src/sanity/queries.ts -> src/lib/products.ts -> pages
```

Pages call only `src/lib/products.ts` (`getUnits`, `getFeatured`, `getUnit`, `getUnitSlugs`, `getCount`). Swap the CMS or host by changing that layer.

- One document type, `unit`: one per physical MacBook. Title, URL and warranty are generated from the fields and the grade.
- Shown on the site: status Available or Reserved, with a price, a grade and at least one photo. Sold units return a 404.
- Home: up to 6 featured available units, newest first. Shop: up to 60 units, filtered in the browser. Every query has a limit and asks only for the fields it shows.
- Reads are cached for about 60 seconds (`revalidate`), so a sold unit disappears within a minute or two. No webhook is used.

| Page | Rendering |
|---|---|
| `/`, `/products` | Static, refreshed about every 60 s |
| `/products/[slug]` | Static for listed units, others built on first visit, refreshed about every 60 s, 404 if sold or missing |
| `/sitemap.xml` | Refreshed about every 5 minutes |
| `/api/chat` | Dynamic |

## How the fallback works

There is no local copy of the MacBooks. Every MacBook and photo lives in Sanity. If Sanity cannot be reached while a page refreshes, the page fails and the last good version keeps being shown (a build with Sanity down stops). With no Sanity settings at all (a fresh local run), the shop shows "no MacBooks yet".

## Security

- `next.config.ts` sets HSTS, nosniff, Referrer-Policy, Permissions-Policy, frame protection and a Content-Security-Policy on every route.
- The public CSP allows inline scripts because Next adds them to static pages. A nonce would make every page dynamic.
- The site has no Studio code or Studio packages. `/admin` only redirects to `STUDIO_URL`, and is disallowed in `robots.txt`.
- CMS text is rendered as plain React text. The one `dangerouslySetInnerHTML` use is JSON-LD built only from numbers and dropdown values, with `<` escaped.
- Photos come from `cdn.sanity.io` only. The one local photo is the exchange picture on the home page.

## Deploying on Cloudflare Workers (OpenNext) later

- The Studio is not part of the site bundle, so it adds nothing to the Worker size.
- `UnitImage` resizes Sanity and Cloudinary photos through their own CDNs, so the Next image server (`sharp`) is not needed for them.
- Page refresh needs an OpenNext incremental cache binding (R2 or KV).
- `/api/chat` keeps its rate limit in memory per instance. On Workers that is not a real limit: use a shared store and set a spend limit in the Anthropic console.

## Known dependency notes

The Studio runs current Sanity (6.x) on its own, so it no longer depends on this app's React or Next version. `npm audit` still lists a copy of `postcss` inside Next 15, which only a move to Next 16 fixes. It processes this repo's own CSS, not visitor input.

## Questions and answers

The home page questions come from the Studio (`faq` documents, newest edits within about a minute) through `src/lib/faq.ts`. If Sanity cannot be reached, `SITE_CONFIG.faqItems` in `src/config/index.ts` is shown. The FAQ structured data on every page is built from the same list, with `<`, `>`, `&` and line separators escaped. The chatbot and the chat panel still read the built-in list until they are connected.

## Reviews

Customer reviews come from the Studio (`review` documents) through `src/lib/reviews.ts`, with the same fallback to `SITE_CONFIG.customerReviews` if Sanity is unreachable. The star rating and review count in the page header and in the search-engine data (`SITE_CONFIG.stats`) are still typed in `src/config/index.ts`.

See `docs/HANDOVER.md` for the owner checklist: roles, backups, secrets and what to check before going live.

## Preview before publish

The Studio has a **Preview on website** action (in `studio-aladdinitworld/actions/previewAction.tsx`). It opens `/api/draft-mode/enable` on this site with a short-lived secret (valid for one hour) made from the editor's login. The route asks Sanity to confirm the secret (`@sanity/preview-url-secret`), then switches on Next.js draft mode for that browser only. While it is on, reads use the drafts view with the read token and are never cached, and a black "Preview" bar shows at the bottom. Visitors never see drafts.

It needs `SANITY_API_READ_TOKEN` (a Viewer token, server only). Without it, the preview route answers 501 and the rest of the site works as before. The pages stay static with the token set. In the Studio, set `SANITY_STUDIO_PREVIEW_URL` to the live site address when building the hosted Studio (it defaults to http://localhost:3000).
