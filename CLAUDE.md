# Portfolio site — CLAUDE.md

Personal portfolio for a freelance web developer (sites, web apps, business automation) targeting small businesses in Slovakia/Czechia and international clients. Goal of every page: turn a visitor into a project inquiry.

The owner talks to you in Russian. Site content is Slovak (default) and English. Brand, contacts, colors, cases and prices live in `docs/brief.md` — read it before writing any copy.

## Stack

- Astro (static output) + TypeScript strict
- Tailwind CSS (added via `npx astro add tailwind`), design tokens in `src/styles/global.css`
- Content Collections + MDX for projects and services (schemas in `src/content.config.ts`, zod)
- Astro built-in i18n routing: `sk` default without prefix, `en` under `/en/`
- `astro:assets` `<Image>` for all raster images; astro-icon + Lucide for icons
- @astrojs/sitemap, JSON-LD, hreflang
- Vanilla JS in component `<script>` tags. No React/Vue/Svelte unless I explicitly approve it.
- Contact form posts JSON to a Cloudflare Pages Function (`functions/api/contact.ts` → `/api/contact`, same origin, site stays static). The function checks the honeypot and validates the data, verifies the Cloudflare Turnstile token on the server (`TURNSTILE_SECRET_KEY`) and sends two emails through the Resend REST API (`RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`): a notification to the owner and an auto-reply to the visitor. Only the Turnstile site key is public (`PUBLIC_TURNSTILE_SITE_KEY`). Details in `docs/contact-form.md`.
- Hosting: Cloudflare Pages (`npm run build` → `dist`, `functions/` deployed alongside). Local full stack: `npm run dev:full`.

Install the latest stable versions via official CLIs. Don't pin versions from memory; if an API seems to have changed, check the installed package's docs/types instead of guessing.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build (must pass before you say a task is done)
- `npx astro check` — type check (must pass)
- `npm run preview` — serve the build
- `npx prettier --write .` — format

## Structure

```
src/
  assets/            images (projects/<slug>/, me.jpg, og-default.png)
  components/        UI (Button, Section, Container, Card, Header, Footer, LangSwitch, ...)
  components/home/   homepage sections
  content/
    projects/sk/*.mdx
    projects/en/*.mdx
    services/sk/*.md
    services/en/*.md
  i18n/ui.ts         UI strings + t() helper + route map
  layouts/BaseLayout.astro
  pages/             sk pages at root, en pages under pages/en/
  styles/global.css
docs/
  brief.md           owner's brand, contacts, cases, prices (source of truth for copy)
  contact-form.md    contact form: Pages Function + Resend, secrets, testing
```

## Routes (sk / en)

| Page | SK | EN |
| --- | --- | --- |
| Home | `/` | `/en/` |
| Projects | `/projekty` | `/en/projects` |
| Case | `/projekty/[slug]` | `/en/projects/[slug]` |
| Services | `/sluzby` | `/en/services` |
| About | `/o-mne` | `/en/about` |
| Contact | `/kontakt` | `/en/contact` |
| Privacy | `/ochrana-udajov` | `/en/privacy` |
| Thank you | `/dakujem` | `/en/thank-you` (noindex) |

The language switch must link to the equivalent page, not to the home page. A case exists in both languages with the same `slug`.

## Content schema

`projects`:
- `title`, `summary` (≤ 160 chars), `type`: `"website" | "webapp" | "automation" | "mobile"`
- `client` (optional, omit if no permission), `year`, `stack: string[]`
- `problem`, `solution` (short strings; long text goes in the MDX body)
- `results: { value: string; label: string }[]` (only real numbers from the brief)
- `cover` (image), `gallery` (images, optional)
- `demoUrl`, `repoUrl` (optional), `featured: boolean`, `order: number`, `draft: boolean`

`services`: `title`, `priceFrom` (EUR, number), `duration`, `includes: string[]`, `order`.

`draft: true` entries never appear in production builds.

## Rules

- **No invented facts.** Never make up testimonials, client names, logos, metrics or prices. If data is missing in `docs/brief.md`, hide the section or leave a clearly marked `[TODO: ...]` and tell me.
- Every user-facing string exists in both `sk` and `en`. Slovak must sound natural (not translated from English), use formal "vy" with clients.
- Copy style: short sentences, client benefit first, no tech jargon on marketing pages.
- Mobile-first. Test layouts at 360px. No horizontal scroll.
- Performance budget: no client JS on a page unless needed; total JS per page < 20 KB; fonts self-hosted, `font-display: swap`, max 2 families. Lighthouse mobile ≥ 95 in all categories.
- Accessibility: semantic HTML, one `h1` per page, visible focus states, labels on all form fields, WCAG AA contrast, respect `prefers-reduced-motion`.
- SEO: unique title/description per page and language, canonical + hreflang (incl. `x-default` → sk), JSON-LD where relevant.
- No cookies/trackers that require consent. Analytics only cookieless (Cloudflare Web Analytics or Plausible).
- Secrets only in `.env` / `.dev.vars` (gitignored) and in Cloudflare Pages settings; keep `.env.example` and `.dev.vars.example` up to date. Only `PUBLIC_*` vars may reach the client.
- Reuse components; don't duplicate markup between sk and en pages — pages are thin wrappers that pass `lang` to shared components.
- Keep changes scoped to the task. Don't refactor unrelated code without asking.

## Definition of done

1. `npm run build` and `npx astro check` pass with no errors or warnings you introduced.
2. Both languages updated.
3. Checked at mobile and desktop width (describe what you checked).
4. Short summary of what changed and anything I must do manually (env vars, secrets, DNS).
