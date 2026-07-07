# Thanh-Loi Hoang — Personal Site

Personal website of Thanh-Loi Hoang: research, projects, writing, and CV.
Live at https://loiht2.vercel.app.

## Stack

- Next.js 16 (App Router) + React 19, deployed on Vercel
- Tailwind CSS v4, Geist fonts, next-themes (dark/light)
- CSS-first animation (scroll-driven reveals, view transitions)
- Writing: MDX in `content/posts/`, rendered with next-mdx-remote
- All personal data in `content/*.js` — fields marked `FILL_ME` are optional
  and hidden until filled

## Develop

Requires Node >= 20.9.

    npm install
    npm run dev          # http://localhost:3000
    npm test             # posts lib tests
    npm run lint
    npm run check:privacy  # fails if any image carries EXIF/XMP/IPTC

## Deploy

Pushes to `master` deploy automatically via Vercel. `npm run build` locally to
verify before pushing.

## Privacy

Images must be metadata-free (`npm run check:privacy`; strip with
`python3 scripts/strip_exif.py <files>`). Commit with the GitHub noreply
email. See `docs/privacy-remediation.md`.
