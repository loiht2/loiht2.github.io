# Personal Website — loiht2.github.io

A fast, accessible, no-build static site with light/dark theme, responsive layout, and a simple structure you can extend.

## Structure
- `index.html`: Home with hero, projects, contact anchors
- `about.html`: Bio and highlights
- `blog.html`: Placeholder blog index
- `cv.html`: Simple CV page
- `assets/styles.css`: Theme, layout, components
- `assets/main.js`: Theme toggle, mobile nav, active nav link, footer year
- `404.html`: GitHub Pages fallback for unknown paths
- `robots.txt` and `sitemap.xml`: Basic SEO

## Customize
- Text and metadata: update titles and descriptions in each page `<head>`
- Avatar: replace `https://github.com/loiht2.png` with your image URL or local asset
- Projects: edit the “Projects” section in `index.html` and details in `about.html`/`cv.html`
- Social links: update GitHub/LinkedIn/etc. links in nav and footer
- Colors: tweak CSS variables at the top of `assets/styles.css`

## Local Preview
Open `index.html` directly, or serve the folder:

- Python: `python3 -m http.server -d . 8080`
- Node (if installed): `npx serve .`

Then visit `http://localhost:8080/`.

## Deploy (GitHub Pages)
1. Initialize a Git repo in this folder and push to `github.com/loiht2/loiht2.github.io`
2. Ensure Pages is enabled in the repository settings (root branch, no build)
3. Changes to `main` are live at `https://loiht2.github.io/`

## Notes
- Nav highlights the current page via `aria-current="page"`
- Theme preference is saved to `localStorage`
- Mobile menu uses a simple toggle; consider a more robust layout if your nav grows

MIT-like usage: feel free to copy and adapt.
