# Handover checklist: running the website

For the owner or CEO. The sales team's day-to-day steps are in `SALES-GUIDE.md`.

## Who can change what

| Change | Where | Who |
|---|---|---|
| MacBooks, prices, photos, offers, home page picks, questions, reviews | Studio (the admin address) | Sales team and CEO |
| Delete things, automatic clean-up settings | Studio | Administrators |
| Layout, wording of pages, new features, legal text (terms, privacy, warranty) | The code, through the developer | Developer only |
| Business hours, phone, address, impact figures | The code (`src/config/index.ts`) | Developer only, for now |

## Accounts and access

- [ ] The Sanity project is owned by a **company** login (CEO), not a personal one.
- [ ] Everyone has their **own** login. No shared passwords.
- [ ] **Two-step verification** is on for every account (Google or GitHub account settings).
- [ ] The Free plan has only Administrator and Viewer roles, so sales staff with edit rights are Administrators. Tell them: mark MacBooks **Sold**, do not delete.
- [ ] When someone leaves: remove them under sanity.io/manage, Members, **the same day**.
- [ ] Every 3 months: read the member list and remove anyone who should no longer have access.

## Backups

- Sanity keeps a history of each change (use **Review changes** in a document to go back).
- A weekly backup of everything (content and photos) runs from the Studio repo (`.github/workflows/backup.yml`) and is kept 90 days. It needs the `SANITY_WRITE_TOKEN` secret in the private GitHub repo.
- Also keep one backup yourself before big changes: in the Studio folder, run `npx sanity datasets export production backup.tar.gz`.
- To restore: `npx sanity datasets import backup.tar.gz --dataset production`.

## Secrets (never share, never commit)

| Name | Where it lives | What it does |
|---|---|---|
| `ANTHROPIC_API_KEY` | Website host, server only | The AI shop assistant (this is billed) |
| `SANITY_API_READ_TOKEN` | Website host, server only | Preview before publish (Viewer token); also needed if the dataset becomes private |
| `SANITY_WRITE_TOKEN` | Private GitHub repo secret | Nightly clean-up and weekly backup |

The Sanity project ID and dataset name are not secret.

## Before going live

- [ ] Replace the 5 stand-in photos on the old MacBooks with real photos, and check every price and grade.
- [ ] The CEO confirms the claims on the site: warranty length per grade, the 100-point inspection, the 5-year service plan, the impact figures, and "42+ Google reviews".
- [ ] Add the real Google reviews link (see the TODO in `src/app/(site)/reviews/page.tsx`).
- [ ] Create a **Viewer** API token (sanity.io/manage, API, Tokens) and set it as `SANITY_API_READ_TOKEN` on the host, so **Preview on website** works.
- [ ] Set the environment variables on the host, and `STUDIO_URL` so `/admin` forwards to the Studio.
- [ ] Add the Studio address in the Sanity project's CORS list, with credentials. The public website needs no CORS entry.
- [ ] Open the live site on a phone: home, shop, one MacBook page, the questions, the chat.
- [ ] Set a spend limit on the Anthropic account.

## Known limits

- Changes appear on the website within about a minute, not instantly.
- The AI assistant still answers from the built-in questions and MacBook list, not from the Studio, until it is connected.
- Free plan: 100 GB of photo storage and 100 GB of traffic a month. Deleting a MacBook does not free its photos; the clean-up does.
