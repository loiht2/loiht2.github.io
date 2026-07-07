# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commit messages

Do not add a `Co-Authored-By: Claude ...` trailer to commit messages in this repository.

## Commands

```bash
npm run dev            # start dev server at http://localhost:3000
npm run build           # production build (Vercel-native, no static export)
npm start                # serve the production build
npm run lint             # ESLint (flat config, next/core-web-vitals)
npm test                 # node --test — runs tests/*.test.mjs
npm run check:privacy    # fails if any image under public/assets/images carries EXIF/XMP/IPTC metadata
```

To run a single test file: `node --test tests/posts.test.mjs`.

Node >= 20.9 is required (see `engines` in package.json).

## Architecture

This is a Next.js 16 App Router site with **no CMS and no database** — all content is authored as plain JS data modules and MDX files, and the site is deployed to Vercel (not GitHub Pages; `output: "export"` was intentionally removed).

**Content is data, not markup.** Every page's content lives in `content/*.js` (profile, experience, education, skills, projects, publications, news, photos) and is imported directly by the page components in `app/`. Fields the site owner hasn't supplied yet are `null` with a `// FILL_ME:` comment rather than placeholder text — components must conditionally render around `null`/empty values instead of assuming data is present. When adding a new content field, add it to the relevant `content/*.js` file first, then wire it into the consuming page/component.

**Writing is MDX-driven.** Blog posts are `.mdx` files in `content/posts/`, read via `lib/posts.js` (`getAllPosts()` / `getPost(slug)`) using `gray-matter` for frontmatter and rendered with `next-mdx-remote/rsc`. `app/writing/page.js` (listing), `app/sitemap.js`, and `app/rss.xml/route.js` all derive from `getAllPosts()` — adding a post is just adding an `.mdx` file; nothing else needs updating.

**SEO surfaces are generated, not static files.** `app/sitemap.js`, `app/robots.js`, `app/manifest.js`, `app/rss.xml/route.js`, `app/opengraph-image.js`, `app/icon.js`, and `app/apple-icon.js` are Next.js route/metadata handlers, not files under `public/`. They all read the canonical site URL from `lib/site.js` (`SITE_URL`, `SITE_NAME`) — that's the one place to change if the production domain changes.

**Animation is CSS-only by design** (see `app/globals.css`): entrance choreography (`.anim`), scroll-driven reveals (`.anim-view`, using `animation-timeline: view()` behind `@supports`), and a scroll-progress bar for posts (`animation-timeline: scroll()`), plus `next-view-transitions` for page crossfades. There is no JS animation library in this project — do not introduce one; extend the CSS patterns in `globals.css` instead. Every animation must degrade to fully visible, static content under `prefers-reduced-motion` and in `@media print` (see the corresponding blocks at the bottom of `globals.css`) — the CV page in particular must render complete and unanimated for printing/PDF export.

**Theming** uses `next-themes` with `attribute="class"` and Tailwind's `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css` — components needing theme-aware behavior at runtime (not just CSS) must guard on a `mounted` state (see `components/theme-toggle.jsx`) to avoid SSR/client hydration mismatches.

**Privacy tooling is part of the build discipline, not incidental.** `scripts/check_exif.py` / `scripts/strip_exif.py` exist because this is a public personal site with real photos — any new image added under `public/assets/images/` must pass `npm run check:privacy` before committing. See `docs/privacy-remediation.md` for the history of what was previously scrubbed and why.
