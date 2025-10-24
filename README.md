# Thanh-Loi Hoang — Personal Site (Next.js)

Modern rewrite of the personal site using Next.js App Router. The project compiles to a static bundle (`out/`) that can be deployed on GitHub Pages or any static host.

## Tech Stack
- [Next.js 15](https://nextjs.org) with the App Router
- React 19 server + client components
- Static export (`next.config.mjs` uses `output: "export"`) with unoptimised images for GitHub Pages compatibility

## Structure Highlights
- `app/` — route segments (`/`, `/blog`, `/projects`, `/cv`, `/posts/hello-world`)
- `components/` — shared layout pieces (header, footer, theme logic, typewriter role)
- `public/` — static assets, RSS feed, sitemap, manifest
- `legacy-site/` — snapshot of the original hand-coded HTML site kept for reference

## Local Development
```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to browse the site. Edits to files in `app/` hot-reload automatically.

## Build & Export
```bash
npm run build
```

Because the configuration uses `output: "export"`, the build step places the static site in `./out`. You can preview it locally with any static file server, for example:
```bash
npx serve@latest out
```

Deploy the `out` directory to GitHub Pages (repository name `loiht2.github.io`) or another static host.
