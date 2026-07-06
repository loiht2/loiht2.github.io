# Personal Website Redesign — Design Spec

**Date:** 2026-07-06
**Owner:** Thanh-Loi Hoang
**Status:** Approved direction (Approach A+ / UI rebuild allowed); spec awaiting final user review

## 1. Goals & Audience

Build a personal site that positions Thanh-Loi at the **intersection of research and industry**: currently an MSc student & research assistant at DCNLab, Soongsil University; planning a PhD; targeting industry roles after graduation. The site must serve two audiences with one coherent identity:

- **Recruiters / industry:** production experience (OpenShift/VMware for banking clients via FPT IS), skills, CV download, LinkedIn, GitHub.
- **Academic collaborators:** research interests, publications, thesis, lab/advisor, Google Scholar/ORCID, conference presence.

**Positioning line (used verbatim in metadata, hero, CV, OG tags):**
> Thanh-Loi Hoang — MSc student & research assistant at DCNLab, Soongsil University, working on cloud-native infrastructure for AI/ML — Kubernetes, MLOps, and network performance.

## 2. Decisions already made (user-approved)

1. **UI rebuild permitted.** Keep all personal data/content; the UI may be rebuilt from scratch. Modern, animated, informed by a survey of current best personal sites.
2. **Hosting: Vercel** is the canonical deployment. GitHub Pages will be disabled or redirected; all metadata/canonical/sitemap/RSS URLs repoint to the Vercel URL.
3. **Email:** academic (`@dcn.ssu.ac.kr`) listed alongside Gmail.
4. **Git history rewrite:** purge the EXIF-laden `nui-coc-lake-2024.jpg` blob and `letmedownslowly090@gmail.com` author identity via `git filter-repo`, force-push, GitHub support cache purge. Future commits use the GitHub noreply address.
5. **Content cuts:** drop IELTS 5.5, drop Facebook, single X link (no duplicate Twitter card), photo marquee → static grid, remove typewriter headline.

## 3. Design direction: "Design engineer meets researcher"

Derived from a survey of current exemplars (brittanychiang.com — single-page anchored sections, experience list with hover-highlight, tech tags; emilkowal.ski — typography-led minimalism, restrained motion with high craft; leerob.com — curated highlights over exhaustive feeds, inline contextual links) and 2026 trend reporting (restraint-first micro-interactions, typography as the hero, dark-mode-first, performance as a design constraint).

**Principles:**
- **Typography is the interface.** Oversized name/headline, tight hierarchy, generous whitespace. Content over chrome.
- **Motion with intent.** Every animation either orients (entrance choreography, page transitions), confirms (hover/press feedback), or delights briefly (one easter-egg-level flourish max). Nothing loops forever; nothing tracks the pointer across the whole viewport.
- **Curated, not exhaustive.** Home shows selected work; archives live on subpages.
- **Two audiences, one door.** The hero addresses both; the News list and Publications teaser signal "active researcher"; the featured projects and CV CTA signal "ships production systems."

## 4. Information architecture

```
/            Home — single-page flow: hero → news → featured projects → selected publications → photos → contact
/research    Research interests, thesis (topic, advisor, lab link), full publications list, Scholar/ORCID
/projects    Project archive: all projects with evidence links, outcomes, tags
/writing     MDX-driven blog listing (generates RSS + sitemap entries)
/writing/[slug]  Individual posts (MDX)
/cv          Interactive CV (timeline) + public-safe PDF download; print-optimized
```

Nav: `Home · Research · Projects · Writing · CV` + theme toggle. Footer: contact links repeated + sign-off line.

**Page details:**

- **Home hero:** static name (no typewriter), the positioning line, affiliation linking to DCNLab, contact row in priority order: Email (both addresses) · GitHub · LinkedIn · Google Scholar · X. Primary CTA "View CV", secondary "Projects".
- **News:** 3–7 dated one-liners (reverse chronological), maintained as a small data file. The academic freshness signal.
- **Featured projects:** 2–3 cards (bento-style grid), each with evidence: repo link, outcome numbers, or honest scale description for confidential client work.
- **Selected publications:** 1–3 entries in citation format, link to /research. If none published yet, show thesis-in-progress entry — honest for a first-year MSc.
- **Photos:** static responsive grid (no marquee), captions kept — conference/campus photos prove community presence. All images EXIF-stripped.
- **Research page:** interests paragraph (3–4 sentences), thesis card (topic, advisor, expected graduation), publications list (venue, year, DOI/PDF links), Scholar/ORCID badges. Structure ships ready; user supplies data — **nothing is invented**.
- **Projects page:** all projects incl. Strava pipeline side project. Tags, links, architecture notes.
- **Writing:** MDX files with frontmatter are the single source of truth; listing page, RSS, and sitemap generate from them at build. Keep "Hello, world" or replace when first real post lands.
- **CV page:** keep the timeline concept (best surface of the old site) rebuilt in the new system. Corrected copy (fix "I experienced with…"), Publications section, TOEIC under Languages (IELTS dropped), Certifications reserved for professional certs, expected graduation date, working PDF download (public-safe: no phone/home address/DOB). **No scroll-triggered animation on this page**; print stylesheet ensures complete output.

## 5. Design system

- **Color:** dark-first neutral (near-black `~#0a0a0a`, not navy) with one refined accent (blue `#3b82f6` family retained for brand continuity, used sparingly: links, active states, accent details). Full light theme; both AA-verified. Subtle static texture allowed (faint grid or noise) — no animated background layers.
- **Typography:** Geist Sans via `next/font` (variable, free, fits Vercel stack) with Geist Mono for dates/tags/metadata accents. Name/headline `clamp(40px, 7vw, 72px)`. Body 16–18px, line-height 1.6–1.7, measure ≤ 72ch.
- **Components:** cards with 1px borders + subtle elevation on hover (spring transform, no backdrop-filter stacks), pill tags in mono, hover-highlight list rows (experience/publications dim siblings on hover — brittanychiang pattern), animated underline links.
- **Dark/light:** `next-themes` with class strategy — eliminates the current first-visit flash and the dead `.light` CSS-module selectors by design.

## 6. Animation system

Implemented with **Motion** (`motion` package, successor to framer-motion) + CSS where cheaper. Global rules:

- Entrance: staggered fade+rise (12–16px, spring, ~0.5s) on first load; scroll reveals fire **once** (`whileInView`, `once: true`).
- Micro-interactions: link underline slide-in; card lift+scale on hover; press states; animated sun/moon morph on theme toggle; subtle magnetic effect on primary CTA only.
- Page transitions: soft cross-fade via View Transitions (progressive enhancement).
- Post pages: top scroll-progress bar.
- Constraints: transform/opacity only; no infinite loops; no viewport-wide blur/blend layers; no `aria-live` on decorative text; everything respects `prefers-reduced-motion` (reduce → content visible immediately, transitions ≤ 0.01s); content must be visible without JS (no `opacity: 0` initial states in server HTML — Motion initial states applied client-side or via CSS that no-JS overrides).

## 7. Tech stack

- **Next.js 16 App Router on Vercel-native build** — drop `output: "export"`; enable `next/image` optimization (remove `images.unoptimized`).
- **Tailwind CSS v4** for the rebuilt UI (replaces 1,390-line globals.css + modules; design tokens as CSS variables remain the theming backbone).
- **Motion** for animation; **next-themes** for theming; **MDX via `content-collections`** for writing (typed frontmatter, single source of truth for listing/RSS/sitemap); generated `sitemap.ts`/`rss` route handlers replace hand-maintained XML.
- Delete dead code/assets: `app/page.module.css`, starter SVGs, unused header dropdown + `GitHubIcon()`, `avatar-bg.svg`, unused photo, stale README/RUNNING sections (rewrite docs for Next 16 / Node ≥ 20.9 / Vercel).
- **Environment prerequisite:** build machine needs Node ≥ 20.9 (current machine has 18.19.1 — upgrade via nvm before implementation).

## 8. SEO & metadata

- All URLs/canonicals/OG point to the Vercel production URL (custom domain optional later — metadataBase makes it a one-line change).
- Per-page canonical + unique OG/Twitter cards; generated OG image (name + role, brand style).
- Generated sitemap + RSS from the content source (kills stale-date drift).
- `robots.txt`, `site.webmanifest` with proper 192/512 icons + apple-touch-icon.
- GitHub Pages: **disable** (user-side setting; instructions provided). If the user prefers to keep the github.io URL alive, fallback is a committed redirect page — but disabling is the default.

## 9. Accessibility (carried forward + fixed)

Keep: skip link, `aria-current` nav, alt text discipline, focus-visible styles (extended to all interactive elements), semantic landmarks (fix nested nav), correct heading order (fix h1→h3 skip). Fix: no `aria-live` decorative updates; photo grid replaces unpausable marquee; visible-without-JS content; print-complete CV. Verify contrast for both themes at implementation.

## 10. Privacy operations (sequenced first during implementation)

1. Strip EXIF from all `public/assets/images/*` (re-encode); add a lightweight check (script or lint step) so metadata-bearing images can't return.
2. `git filter-repo` to (a) replace the historical `nui-coc-lake-2024.jpg` blob everywhere with the cleaned version (or excise it), (b) rewrite `letmedownslowly090@gmail.com` author/committer identities to the GitHub noreply address.
3. Force-push rewritten history; user files GitHub support request to purge cached views/PRs (template will be provided); user enables "Block command line pushes that expose my email" and sets local git config to `126635820+loiht2@users.noreply.github.com`.
4. CV PDF checklist before publishing: no phone, no home address, no DOB, no ID numbers.

## 11. Out of scope

Custom domain purchase, analytics, comments, newsletter, CMS, i18n (Korean/Vietnamese versions), and design of individual future blog posts. The Vercel project settings (linking repo, env) are user-side actions we'll document, not automate.

## 12. Data needed from user (blocks content, not the build)

- Publications list (incl. any REV-ECIT 2023 paper), with venues/links
- MSc thesis topic + advisor name + DCNLab URL
- Google Scholar / ORCID profile URLs
- Expected MSc graduation date; PhD plans wording preference
- Professional certifications (CKA/RHCSA/etc.), if any
- Academic email address to display; public-safe CV PDF (or data to generate one)
- News items to seed the News section

Placeholder-free rule: sections whose data is missing at launch render an honest minimal state (e.g., publications shows the thesis-in-progress entry) rather than lorem ipsum or invented content.
