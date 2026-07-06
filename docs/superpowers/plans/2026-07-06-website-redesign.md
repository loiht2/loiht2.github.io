# Personal Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild loiht2's personal site per `docs/superpowers/specs/2026-07-06-website-redesign-design.md` — privacy-first history rewrite, then a full UI rebuild (Tailwind v4, CSS-first animation, MDX writing pipeline), deployed Vercel-native.

**Architecture:** Next.js 16 App Router on Vercel (no static export). All personal data lives in `content/*.js` data modules (fields the user hasn't supplied yet are `null` with `FILL_ME` comments; components render nothing for null fields — never placeholder text). Pages are server components; the only client components are the header, theme toggle. Animation is pure CSS (entrance keyframes, scroll-driven reveals behind `@supports`) + `next-view-transitions` for page crossfades — server HTML never hides content.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4 (`@tailwindcss/postcss`), `geist` (fonts), `next-themes`, `next-view-transitions`, `next-mdx-remote` + `gray-matter` (writing), `node --test` (lib tests), Python stdlib (EXIF tooling), `git-filter-repo` (history rewrite).

**Environment facts:** repo `/home/ubuntu/loiht2/loiht2.github.io`, remote `https://github.com/loiht2/loiht2.github.io.git`, machine Node is 18.19.1 (too old — Task 0 fixes), production URL `https://loiht2.vercel.app`, GitHub noreply email `126635820+loiht2@users.noreply.github.com` (already set in repo git config).

**Verification model:** this is a static-content site with two units of real logic (`lib/posts.js`, `scripts/check_exif.py`) — those get real tests (TDD). UI tasks are verified by `npm run build` + `curl` content checks at defined checkpoints (builds stay green at every commit).

---

## Phase 0 — Environment

### Task 0: Node ≥ 20.9 and baseline

**Files:** none (environment only)

- [ ] **Step 0.1: Install/activate Node 22 via nvm**

```bash
export NVM_DIR="$HOME/.nvm"
if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
fi
. "$NVM_DIR/nvm.sh"
nvm install 22 && nvm alias default 22 && nvm use 22
node -v
```

Expected: `v22.x.x`. **Every later `npm`/`node`/`npx` command in this plan assumes `. "$NVM_DIR/nvm.sh" && nvm use 22` has been run in that shell.**

- [ ] **Step 0.2: Clean install and baseline build**

```bash
cd /home/ubuntu/loiht2/loiht2.github.io && npm ci && npm run build
```

Expected: build succeeds (static export to `out/`). If it fails only inside `experimental.optimizeCss`/critters, note it and continue — Task 5 removes that config.

---

## Phase 1 — Privacy operations (before any new work is stacked on doomed history)

### Task 1: EXIF tooling (TDD) + strip all images

**Files:**
- Create: `scripts/check_exif.py`
- Create: `scripts/strip_exif.py`

- [ ] **Step 1.1: Write the checker first — it is the failing test**

`scripts/check_exif.py`:

```python
#!/usr/bin/env python3
"""Fail (exit 1) if any JPEG under the given dirs contains EXIF/XMP/IPTC metadata.

Usage: python3 scripts/check_exif.py public/assets/images
"""
import sys
from pathlib import Path

MARKERS = (b"Exif\x00\x00", b"http://ns.adobe.com/xap/1.0/", b"Photoshop 3.0")

def dirty_segments(data: bytes) -> list[str]:
    found = []
    for m in MARKERS:
        if m in data:
            found.append(m.split(b"/")[-1].decode("latin1").strip("\x00"))
    return found

def main(dirs: list[str]) -> int:
    bad = 0
    for d in dirs:
        for p in sorted(Path(d).rglob("*.jp*g")):
            hits = dirty_segments(p.read_bytes())
            if hits:
                print(f"DIRTY  {p}  ->  {', '.join(hits)}")
                bad += 1
            else:
                print(f"clean  {p}")
    return 1 if bad else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:] or ["public/assets/images"]))
```

- [ ] **Step 1.2: Run it — verify it FAILS on the current tree**

```bash
python3 scripts/check_exif.py public/assets/images; echo "exit=$?"
```

Expected: `DIRTY  public/assets/images/nui-coc-lake-2024.jpg -> ...` and `exit=1`. (Audit found EXIF+XMP there; busan/soongsil carry Photoshop 8BIM digests — they may also flag; stripping them too is correct and harmless.)

- [ ] **Step 1.3: Write the stripper**

`scripts/strip_exif.py`:

```python
#!/usr/bin/env python3
"""Losslessly remove metadata segments from JPEGs (no pixel re-encode).

Drops APP1 (EXIF/XMP), APP3-APP13 (incl. Photoshop/IPTC), APP15, COM.
Keeps APP0 (JFIF), APP2 (ICC color profile), APP14 (Adobe color transform).

Usage: python3 scripts/strip_exif.py public/assets/images/*.jpg
"""
import sys
from pathlib import Path

DROP = {0xE1, 0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA, 0xEB, 0xEC, 0xED, 0xEF, 0xFE}

def strip(path: Path) -> None:
    data = path.read_bytes()
    if data[:2] != b"\xff\xd8":
        raise SystemExit(f"{path}: not a JPEG")
    out = bytearray(b"\xff\xd8")
    i = 2
    while i < len(data) - 1:
        if data[i] != 0xFF:
            raise SystemExit(f"{path}: corrupt segment at byte {i}; re-export the image manually")
        marker = data[i + 1]
        if marker == 0xDA:          # start-of-scan: copy the rest verbatim
            out += data[i:]
            break
        if marker == 0xFF:          # fill byte
            i += 1
            continue
        seglen = int.from_bytes(data[i + 2 : i + 4], "big")
        if marker not in DROP:
            out += data[i : i + 2 + seglen]
        i += 2 + seglen
    path.write_bytes(bytes(out))
    print(f"stripped {path.name}: {len(data)} -> {len(out)} bytes")

if __name__ == "__main__":
    for arg in sys.argv[1:]:
        strip(Path(arg))
```

- [ ] **Step 1.4: Strip, then verify the checker PASSES**

```bash
python3 scripts/strip_exif.py public/assets/images/*.jpg
python3 scripts/check_exif.py public/assets/images; echo "exit=$?"
```

Expected: all `clean`, `exit=0`.

- [ ] **Step 1.5: Visually sanity-check one stripped image renders**

```bash
python3 - <<'EOF'
from pathlib import Path
d = Path("public/assets/images/nui-coc-lake-2024.jpg").read_bytes()
assert d[:2] == b"\xff\xd8" and d[-2:] == b"\xff\xd9", "JPEG structure broken"
print("JPEG structure OK", len(d), "bytes")
EOF
```

Expected: `JPEG structure OK`.

- [ ] **Step 1.6: Commit**

```bash
git add scripts/check_exif.py scripts/strip_exif.py public/assets/images
git commit -m "fix(privacy): strip EXIF/XMP/IPTC metadata from all photos, add guard scripts

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 2: Privacy remediation doc (support template + user checklist)

**Files:**
- Create: `docs/privacy-remediation.md`

- [ ] **Step 2.1: Write the doc**

```markdown
# Privacy Remediation — Record & Owner Checklist

**Date:** 2026-07-06

## What was rewritten and why

1. `public/assets/images/nui-coc-lake-2024.jpg` contained EXIF GPS coordinates,
   minute-level capture timestamp, device identifiers (iPhone 11), and Apple
   face-detection regions. The clean (stripped) file replaced it in the working
   tree, and the original blob was purged from all git history.
2. Commits `71e5b27`, `dfa5100`, `d0483e1` were authored as
   `letmedownslowly090@gmail.com` — a private address never published on the
   site. History was rewritten to the GitHub noreply identity.

History was rewritten with `git filter-repo` and force-pushed on 2026-07-06.
Old commit objects may remain in GitHub's caches until support purges them.

## Owner actions (do these once)

- [ ] File a GitHub support request at https://support.github.com/contact
      (subject: "Purge cached commits after history rewrite"), message:

      > I force-pushed a rewritten history to my public repository
      > loiht2/loiht2.github.io to remove personal data (EXIF GPS metadata in
      > an image blob, and a private email address in commit author metadata).
      > Please remove the old, now-unreachable commits from cached views, the
      > API, and any forks/PR references so the previous objects are no longer
      > accessible. Thank you.

- [ ] GitHub → Settings → Emails: enable **"Block command line pushes that
      expose my email"** and **"Keep my email addresses private"**.
- [ ] On every machine you commit from:
      `git config --global user.email "126635820+loiht2@users.noreply.github.com"`
- [ ] Treat `letmedownslowly090@gmail.com` as publicly known: enable 2FA,
      don't reuse its password anywhere.
- [ ] When adding a CV PDF to the site later: confirm it contains **no phone
      number, home address, date of birth, or ID numbers** before committing.
```

- [ ] **Step 2.2: Commit**

```bash
git add docs/privacy-remediation.md
git commit -m "docs: record privacy remediation and owner checklist

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 3: History rewrite (filter-repo) and force-push

**Pre-authorized by the user (2026-07-06): purge the EXIF blob + `letmedownslowly090@gmail.com`, force-push, support purge.** Destructive to history — follow exactly.

**Files:** none in-tree (operates on `.git`)

- [ ] **Step 3.1: Install git-filter-repo and snapshot a safety backup**

```bash
pip3 install --user git-filter-repo && export PATH="$HOME/.local/bin:$PATH"
git filter-repo --version
cd /home/ubuntu/loiht2 && git clone --mirror loiht2.github.io /home/ubuntu/loiht2/site-backup-pre-rewrite.git
```

Expected: a version hash prints; backup mirror exists. Keep the backup until the live site is verified post-push.

- [ ] **Step 3.2: Identify every historical blob of the dirty image (all paths it ever lived at)**

```bash
cd /home/ubuntu/loiht2/loiht2.github.io
CLEAN_BLOB=$(git hash-object public/assets/images/nui-coc-lake-2024.jpg)
git rev-list --objects --all | grep -i 'nui-coc' | awk -v c="$CLEAN_BLOB" '$1 != c {print $1}' | sort -u > /tmp/dirty-blobs.txt
cat /tmp/dirty-blobs.txt && wc -l /tmp/dirty-blobs.txt
```

Expected: ≥1 blob id (audit: the same dirty blob `3637447…` appears at `assets/images/`, `legacy-site/assets/images/`, and `public/assets/images/`). The clean blob committed in Task 1 must NOT be in the list (the awk filter guarantees this).

- [ ] **Step 3.3: Write the mailmap**

```bash
cat > /tmp/rewrite-mailmap <<'EOF'
Hoang Thanh Loi <126635820+loiht2@users.noreply.github.com> <letmedownslowly090@gmail.com>
EOF
```

- [ ] **Step 3.4: Run filter-repo**

```bash
git filter-repo --force --strip-blobs-with-ids /tmp/dirty-blobs.txt --mailmap /tmp/rewrite-mailmap
```

Expected: completes with "Rewrote the whole history" style output. Note: filter-repo **removes the `origin` remote** on purpose.

- [ ] **Step 3.5: Verify the rewrite locally**

```bash
git log --all --format='%ae' | sort -u                 # must NOT contain letmedownslowly090
git rev-list --objects --all | grep -i 'nui-coc'        # must show ONLY the clean blob hash
python3 scripts/check_exif.py public/assets/images      # still clean, exit 0
```

Expected: noreply/gmail/ssu addresses only; single clean blob; exit 0.

- [ ] **Step 3.6: Re-add remote and force-push (needs the user's GitHub credentials)**

```bash
git remote add origin https://github.com/loiht2/loiht2.github.io.git
git push --force origin master
git push origin --delete vercel/react-server-components-cve-vu-lu1ajb  # stale bot branch pinning old history
```

Expected: both pushes succeed. **If authentication fails, stop and hand the user these exact three commands to run themselves.** The force-push also triggers a Vercel redeploy — expected and fine.

- [ ] **Step 3.7: Remind the user of the four checklist items in `docs/privacy-remediation.md`** (support ticket, email-privacy settings, global git config, 2FA). These are user-side; do not attempt them.

---

## Phase 2 — Foundation (new branch; builds stay green at every commit)

### Task 4: Branch + dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 4.1: Create the feature branch**

```bash
git switch -c feat/redesign-2026
```

- [ ] **Step 4.2: Install new deps, remove dead ones**

```bash
npm uninstall critters
npm install geist next-themes next-view-transitions next-mdx-remote gray-matter
npm install -D tailwindcss @tailwindcss/postcss
```

If `next-mdx-remote` raises a React 19 peer conflict: `npm install next-mdx-remote --legacy-peer-deps` (its `/rsc` entry works with React 19; if runtime errors appear later in Task 10, swap to `next-mdx-remote-client` with the same API surface).

- [ ] **Step 4.3: Add engines + scripts to `package.json`** (merge into existing JSON):

```json
{
  "engines": { "node": ">=20.9" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "node --test tests/",
    "check:privacy": "python3 scripts/check_exif.py public/assets/images"
  }
}
```

- [ ] **Step 4.4: Commit**

```bash
git add package.json package-lock.json
git commit -m "build: add tailwind v4, geist, next-themes, mdx pipeline; drop critters

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 5: Next config (Vercel-native, security headers, redirects) + PostCSS

**Files:**
- Rewrite: `next.config.mjs`
- Create: `postcss.config.mjs`

- [ ] **Step 5.1: Rewrite `next.config.mjs`** (drops `output: "export"`, `images.unoptimized`, critters; adds security headers per the "security" requirement, and permanent redirects that preserve old URLs' SEO):

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/blog", destination: "/writing", permanent: true },
      { source: "/posts/hello-world", destination: "/writing/hello-world", permanent: true },
      { source: "/posts/:path*", destination: "/writing/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 5.2: Create `postcss.config.mjs`**

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

- [ ] **Step 5.3: Build check** — `npm run build`. Expected: succeeds (old pages still compile; Tailwind not yet imported). Note: with export mode gone there is no `out/`; output is `.next/`.

- [ ] **Step 5.4: Commit**

```bash
git add next.config.mjs postcss.config.mjs
git commit -m "feat: vercel-native config with security headers and legacy redirects

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 6: Design system — new `globals.css`

**Files:**
- Rewrite: `app/globals.css` (replaces all 1,390 lines)

- [ ] **Step 6.1: Write the new `app/globals.css`**

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-bg: var(--bg);
  --color-fg: var(--fg);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-line: var(--line);
  --color-card: var(--card);
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, "SF Mono", monospace;
}

/* ---------- tokens (light default, .dark override; AA-verified pairs) ---------- */
:root {
  --bg: #ffffff;
  --fg: #18181b;
  --muted: #52525b;   /* 7.6:1 on #fff */
  --accent: #2563eb;  /* 5.2:1 on #fff */
  --line: #e4e4e7;
  --card: #fafafa;
}
.dark {
  --bg: #0a0a0a;
  --fg: #ededed;
  --muted: #a1a1aa;   /* 7.4:1 on #0a0a0a */
  --accent: #3b82f6;  /* 5.4:1 on #0a0a0a */
  --line: #26262a;
  --card: #111113;
  color-scheme: dark;
}

::selection { background: color-mix(in srgb, var(--accent) 30%, transparent); }

/* ---------- a11y ---------- */
.skip-link {
  position: absolute; left: -9999px; top: 0; z-index: 100;
  background: var(--accent); color: #fff; padding: 8px 14px;
  border-radius: 0 0 8px 0; font-size: 14px;
}
.skip-link:focus { left: 0; }

:where(a, button, summary, [tabindex]):focus-visible {
  outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px;
}

/* ---------- entrance choreography: pure CSS, ends visible, no-JS safe ---------- */
@keyframes rise { from { opacity: 0; transform: translateY(14px); } }
.anim { animation: rise 0.7s cubic-bezier(0.21, 0.47, 0.32, 0.98) both; animation-delay: var(--d, 0ms); }

/* scroll-scrubbed reveal for below-the-fold sections — progressive enhancement */
@supports (animation-timeline: view()) {
  .anim-view {
    animation: rise linear both;
    animation-timeline: view();
    animation-range: entry 10% entry 45%;
  }
}

/* reading progress bar for posts — CSS scroll timeline, hidden if unsupported */
.progress-bar { display: none; }
@supports (animation-timeline: scroll()) {
  .progress-bar {
    display: block; position: fixed; inset: 0 0 auto 0; height: 2px; z-index: 50;
    background: var(--accent); transform-origin: 0 50%; transform: scaleX(0);
    animation: progress-grow linear both; animation-timeline: scroll(root);
  }
  @keyframes progress-grow { to { transform: scaleX(1); } }
}

/* ---------- signature patterns ---------- */
/* hover-dim: hovering one row softly dims its siblings (experience, publications) */
.dim-list > * { transition: opacity 0.25s ease; }
.dim-list:hover > :not(:hover) { opacity: 0.5; }

/* faint hero grid texture, static */
.bg-grid {
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent 75%);
}

/* animated underline links */
.u-link {
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 0% 1px; background-position: 0 100%; background-repeat: no-repeat;
  transition: background-size 0.3s ease;
}
.u-link:hover { background-size: 100% 1px; }

/* buttons */
.btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  height: 2.75rem; padding: 0 1.25rem; border-radius: 0.75rem;
  font-size: 0.9375rem; font-weight: 500;
  transition: transform 0.15s ease, background-color 0.2s ease, border-color 0.2s ease;
}
.btn:active { transform: scale(0.97); }
.btn-primary { background: var(--fg); color: var(--bg); }
.btn-primary:hover { background: color-mix(in srgb, var(--fg) 85%, var(--bg)); }
.btn-ghost { border: 1px solid var(--line); }
.btn-ghost:hover { border-color: var(--muted); }

/* cards */
.card {
  border: 1px solid var(--line); border-radius: 1rem; background: var(--card);
  transition: transform 0.25s cubic-bezier(0.21, 0.47, 0.32, 0.98), border-color 0.25s ease, box-shadow 0.25s ease;
}
.card:hover {
  transform: translateY(-3px); border-color: color-mix(in srgb, var(--accent) 40%, var(--line));
  box-shadow: 0 12px 32px -16px color-mix(in srgb, var(--accent) 25%, transparent);
}

/* page crossfade timing */
::view-transition-old(root), ::view-transition-new(root) { animation-duration: 0.22s; }

/* prose for MDX posts */
.prose { line-height: 1.75; }
.prose h2 { font-size: 1.375rem; font-weight: 600; margin: 2rem 0 0.75rem; letter-spacing: -0.01em; }
.prose p { margin: 1rem 0; }
.prose a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
.prose code { font-family: var(--font-mono); font-size: 0.875em; background: var(--card); border: 1px solid var(--line); border-radius: 6px; padding: 0.1em 0.35em; }
.prose pre { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 1rem; overflow-x: auto; }
.prose pre code { border: 0; background: none; padding: 0; }
.prose ul { list-style: disc; padding-left: 1.5rem; margin: 1rem 0; }

/* ---------- reduced motion: content immediately visible, motion off ---------- */
@media (prefers-reduced-motion: reduce) {
  .anim, .anim-view, .progress-bar { animation: none !important; }
  *, ::before, ::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
  ::view-transition-old(root), ::view-transition-new(root) { animation: none !important; }
}

/* ---------- print (CV must print complete) ---------- */
@media print {
  header, footer, .print-hidden, .progress-bar { display: none !important; }
  :root { --bg: #fff; --fg: #000; --muted: #333; --line: #bbb; --card: #fff; }
  .anim, .anim-view { animation: none !important; opacity: 1 !important; transform: none !important; }
  a { color: inherit; text-decoration: none; }
  .card, .card:hover { box-shadow: none; transform: none; }
}
```

- [ ] **Step 6.2: Commit** (build still green — old CSS modules coexist until each page is swapped):

```bash
npm run build && git add app/globals.css && git commit -m "feat: tailwind v4 design system — tokens, animation, a11y, print

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 7: Data layer — all content as data modules (user blanks = `null` + `FILL_ME`)

**Files:**
- Create: `lib/site.js`, `content/profile.js`, `content/news.js`, `content/experience.js`, `content/projects.js`, `content/education.js`, `content/skills.js`, `content/publications.js`, `content/photos.js`

**Rule:** every field the user hasn't supplied is `null` (or `[]`) with a `// FILL_ME:` comment. Components must skip null fields — no placeholder text ever renders.

- [ ] **Step 7.1: `lib/site.js`**

```js
export const SITE_URL = "https://loiht2.vercel.app";
export const SITE_NAME = "Thanh-Loi Hoang";
```

- [ ] **Step 7.2: `content/profile.js`**

```js
export const PROFILE = {
  name: "Thanh-Loi Hoang",
  role: "MSc Student & Research Assistant",
  location: "Seoul, South Korea",
  positioning:
    "MSc student & research assistant at DCNLab, Soongsil University, working on cloud-native infrastructure for AI/ML — Kubernetes, MLOps, and network performance.",
  affiliation: {
    lab: "DCNLab",
    university: "Soongsil University",
    labUrl: null, // FILL_ME: DCNLab homepage URL
  },
  emails: {
    personal: "loi.hoangthanh.24@gmail.com",
    academic: null, // FILL_ME: academic address, e.g. "loiht2@dcn.ssu.ac.kr"
  },
  links: {
    github: "https://github.com/loiht2",
    linkedin: "https://www.linkedin.com/in/thanh-loi-hoang/",
    x: "https://x.com/ThanhLoiHoang02",
    scholar: null, // FILL_ME: Google Scholar profile URL
    orcid: null, // FILL_ME: ORCID URL, e.g. "https://orcid.org/0000-...."
  },
  cvPdf: null, // FILL_ME: public-safe PDF path in /public, e.g. "/loiht2-cv.pdf" (no phone/home address/DOB inside!)
  bio: [
    "I work on cloud-native infrastructure at DCNLab, Soongsil University, where I design and optimize Kubernetes clusters for AI/ML workloads at scale.",
    "Before graduate school I was a system engineer at FPT IS, deploying OpenShift and VMware virtualization for banking clients, and a student researcher evaluating SDN-integrated OpenStack performance.",
  ],
  researchInterests: null, // FILL_ME: 3–4 sentence research-interests paragraph for /research
  goal: "Aiming for a PhD and a career bridging research and industry practice in cloud-native systems.",
};
```

- [ ] **Step 7.3: `content/news.js`**

```js
// Newest first. date is "YYYY-MM".
export const NEWS = [
  // FILL_ME: add items like { date: "2026-06", text: "Submitted a paper to ..." },
  {
    date: "2025-03",
    text: "Joined DCNLab at Soongsil University as a Research Assistant, working on Kubernetes clusters for AI/ML workloads.",
  },
  {
    date: "2025-03",
    text: "Started the MSc program in Information and Telecommunication Engineering at Soongsil University.",
  },
];
```

- [ ] **Step 7.4: `content/experience.js`** (copy corrected — no "I experienced with"):

```js
export const EXPERIENCE = [
  {
    title: "Research Assistant",
    org: "Soongsil University",
    location: "Seoul, South Korea",
    period: "Mar 2025 — Present",
    bullets: [
      "Design and optimize Kubernetes clusters for deploying and managing AI/ML workloads at scale.",
      "Survey academic literature and distill key insights to support research publications.",
    ],
  },
  {
    title: "System Engineer",
    org: "FPT Information System",
    location: "Hanoi, Vietnam",
    period: "Jun 2024 — Feb 2025",
    bullets: [
      "Deployed VMware virtualization for external organizations: server and storage setup, and migration of physical/virtual servers onto new infrastructure.",
      "Deployed Red Hat OpenShift clusters for banking clients.",
    ],
  },
  {
    title: "DevOps Engineer Intern",
    org: "Viettel Networks",
    location: "Hanoi, Vietnam",
    period: "Oct 2023 — Dec 2023",
    bullets: [
      "Built an end-to-end pipeline extracting personal Strava activities into a database and rendering them on a web dashboard, deployed with Docker.",
    ],
  },
  {
    title: "Student Researcher",
    org: "VNU University of Engineering and Technology",
    location: "Hanoi, Vietnam",
    period: "Oct 2022 — Sep 2023",
    bullets: [
      "Implemented software-defined networking on a physical small-scale testbed.",
      "Deployed SDN controllers (OpenDaylight, Tungsten Fabric) into a private OpenStack cloud and evaluated system-wide and VM-to-VM network performance.",
    ],
  },
];
```

- [ ] **Step 7.5: `content/projects.js`**

```js
export const PROJECTS = [
  {
    title: "ML Platform",
    org: "DCNLab, Soongsil University",
    period: "2025 — Present",
    description: "Kubeflow-based MLOps stack for AI/ML research workflows on lab Kubernetes clusters.",
    tags: ["Kubernetes", "Kubeflow", "MLOps"],
    href: null, // FILL_ME: repo/case-study URL if one becomes public
    featured: true,
  },
  {
    title: "OpenShift Platform for Banking",
    org: "TPBank via FPT IS",
    period: "2025",
    description: "Production Red Hat OpenShift foundation for containerized banking applications.",
    tags: ["OpenShift", "Kubernetes"],
    href: null, // client work — no public link
    featured: true,
  },
  {
    title: "Banking Virtualization",
    org: "Vietcombank via FPT IS",
    period: "2024",
    description: "VMware virtualization for core banking workloads across nationwide branches.",
    tags: ["VMware", "Infrastructure"],
    href: null, // client work — no public link
    featured: false,
  },
  {
    title: "Strava Activity Pipeline",
    org: "Personal project @ Viettel internship",
    period: "2023",
    description: "Automated extraction of Strava activities into a database with a web dashboard, containerized with Docker.",
    tags: ["Docker", "Python", "Automation"],
    href: null, // FILL_ME: GitHub repo URL if public
    featured: false,
  },
];
```

- [ ] **Step 7.6: `content/education.js`**

```js
export const EDUCATION = [
  {
    degree: "MSc",
    field: "Information and Telecommunication Engineering",
    school: "School of Electronic Engineering, Soongsil University",
    location: "Seoul, South Korea",
    period: "2025 — Present",
    expectedGraduation: null, // FILL_ME: e.g. "Feb 2027"
    thesis: null, // FILL_ME: thesis topic (shows "In progress" until set)
    advisor: null, // FILL_ME: advisor name
    focus: ["Cloud Computing", "Cloud-Native Architecture", "Containerization"],
  },
  {
    degree: "BSc",
    field: "Electronics and Communication Engineering Technology",
    school: "University of Engineering and Technology, Vietnam National University",
    location: "Hanoi, Vietnam",
    period: "2020 — 2024",
    honors: "Honors Program",
    thesis: "Enhancing Performance of Cloud Computing Using Tungsten Fabric Controller (9.2/10)",
    gpa: "8.15/10",
    focus: ["Computer Networks", "Operating Systems", "Virtualization"],
  },
];
```

- [ ] **Step 7.7: `content/skills.js`**

```js
export const SKILLS = [
  { group: "Cloud & Infrastructure", items: ["Kubernetes", "OpenShift", "VMware vSphere", "Docker", "Helm"] },
  { group: "MLOps & DevOps", items: ["Kubeflow", "GitOps", "ArgoCD", "Jenkins", "Ansible"] },
  { group: "Languages & Tools", items: ["Python", "Go", "Bash", "C/C++", "JavaScript", "SQL"] },
  { group: "Observability", items: ["Prometheus", "Grafana", "Zabbix"] },
];

export const CERTIFICATIONS = [
  // FILL_ME: professional certs only, e.g. { name: "CKA", issuer: "CNCF", year: 2026 }
];

export const LANGUAGES = [
  { name: "Vietnamese", level: "Native" },
  { name: "English", level: "Professional working proficiency (TOEIC 835)" },
  { name: "Korean", level: "Beginner" },
];
```

- [ ] **Step 7.8: `content/publications.js`**

```js
// Papers in citation form. Empty until the user provides them — the UI then
// shows only the theses below, which is an honest state for a first-year MSc.
export const PUBLICATIONS = [
  // FILL_ME: { authors: "T.-L. Hoang, ...", title: "...", venue: "REV-ECIT 2023", year: 2023, links: { pdf: null, doi: null } },
];

export const THESES = [
  {
    degree: "MSc thesis",
    title: null, // FILL_ME: topic — renders as "In progress" until set
    institution: "Soongsil University",
    year: "In progress",
  },
  {
    degree: "BSc thesis",
    title: "Enhancing Performance of Cloud Computing Using Tungsten Fabric Controller",
    institution: "VNU University of Engineering and Technology",
    year: "2024",
  },
];
```

- [ ] **Step 7.9: `content/photos.js`** (all 6 EXIF-clean photos, incl. previously unused Buon Ma Thuot):

```js
export const PHOTOS = [
  { src: "/assets/images/busan-Aug-2025.jpg", caption: "Busan Station, Busan, South Korea", date: "Aug 2025" },
  { src: "/assets/images/soongsil-university-March-2025.jpg", caption: "Soongsil University, Seoul, South Korea", date: "Mar 2025" },
  { src: "/assets/images/nui-coc-lake-2024.jpg", caption: "Nui Coc Lake, Thai Nguyen, Viet Nam", date: "Oct 2024" },
  { src: "/assets/images/vnu-uet-2024.jpg", caption: "VNU University of Engineering and Technology, Hanoi", date: "Jul 2024" },
  { src: "/assets/images/buon-ma-thuot-2024.jpg", caption: "Buon Ma Thuot, Viet Nam", date: "2024" },
  { src: "/assets/images/rev-ecit-2023.jpg", caption: "REV-ECIT 2023 national conference, Hanoi", date: "Dec 2023" },
];
```

- [ ] **Step 7.10: Commit**

```bash
git add lib/site.js content/
git commit -m "feat: single-source content data layer with FILL_ME markers

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 8: Root layout, theme, header, footer, shared components

**Files:**
- Rewrite: `app/layout.js`
- Create: `components/theme-provider.jsx` (replaces old implementation), `components/theme-toggle.jsx`, `components/site-header.jsx`, `components/site-footer.jsx`, `components/section.jsx`, `components/contact-links.jsx`
- Delete (after layout stops importing them): `components/theme-script.jsx`, `components/ambient-background.jsx`, `components/header.jsx`, `components/footer.jsx`

- [ ] **Step 8.1: `components/theme-provider.jsx`** (overwrite the old file):

```jsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ThemeProvider({ children }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 8.2: `components/theme-toggle.jsx`**

```jsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      aria-label={mounted ? (dark ? "Switch to light theme" : "Switch to dark theme") : "Toggle theme"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-md text-muted transition-colors hover:text-fg"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="hidden dark:block" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:hidden" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    </button>
  );
}
```

- [ ] **Step 8.3: `components/site-header.jsx`**

```jsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import ThemeToggle from "./theme-toggle";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/cv", label: "CV" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const linkClass = (href) =>
    `rounded-md px-3 py-2 text-sm transition-colors ${
      isActive(href) ? "font-medium text-fg" : "text-muted hover:text-fg"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-md print:hidden">
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          Thanh-Loi Hoang
        </Link>
        <div className="hidden items-center gap-1 sm:flex">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-md border border-line"
          >
            <span className="sr-only">Menu</span>
            <span className={`h-px w-4 bg-fg transition-transform duration-300 ${open ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`h-px w-4 bg-fg transition-transform duration-300 ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>
      <div
        id="mobile-nav"
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out sm:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <div className="flex flex-col gap-1 border-t border-line/70 px-4 pb-4 pt-2">
            {NAV.map((l) => (
              <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={`${linkClass(l.href)} py-3`}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 8.4: `components/contact-links.jsx`** (server component; renders only non-null links — LinkedIn finally reachable, single X, no Facebook):

```jsx
import { PROFILE } from "@/content/profile";

const ICONS = {
  email: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M8 .2a8 8 0 0 0-2.53 15.6c.4.07.55-.17.55-.38v-1.34c-2.25.49-2.73-1.08-2.73-1.08-.36-.91-.89-1.15-.89-1.15-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.71 1.22 1.86.86 2.31.66.07-.52.28-.87.5-1.07-1.8-.2-3.7-.9-3.7-4.03 0-.89.32-1.62.84-2.2-.08-.21-.37-1.06.08-2.2 0 0 .7-.22 2.3.84a7.9 7.9 0 0 1 4.18 0c1.6-1.06 2.3-.84 2.3-.84.45 1.14.16 1.99.08 2.2.52.58.84 1.31.84 2.2 0 3.14-1.9 3.83-3.72 4.03.29.25.54.74.54 1.5v2.22c0 .21.14.46.55.38A8 8 0 0 0 8 .2Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM4 9h4v12H4zM10 9h3.8v1.7h.05c.53-1 1.82-2.05 3.75-2.05C20.2 8.65 22 10 22 13.24V21h-4v-6.8c0-1.62-.58-2.72-2.04-2.72-1.11 0-1.77.75-2.06 1.47-.11.27-.14.64-.14 1.01V21h-4z" />
    </svg>
  ),
  scholar: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12 3 1 9l4 2.18v4.32L12 19l7-3.5v-4.32l2-1.09V15h2V9L12 3Zm0 2.28L18.94 9 12 12.72 5.06 9 12 5.28ZM17 14.26l-5 2.5-5-2.5v-1.9l5 2.72 5-2.72v1.9Z" />
    </svg>
  ),
  orcid: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM7.9 7.4a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8ZM8.65 17H7.15V8.7h1.5V17Zm2.1-8.3h3.1c2.95 0 4.25 2.1 4.25 4.15 0 2.13-1.66 4.15-4.24 4.15h-3.11V8.7Zm1.5 1.35v5.6h1.55c2.6 0 3.2-1.98 3.2-2.8 0-1.52-.97-2.8-3.26-2.8h-1.49Z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M4 3h4.5l3.18 4.62L15.47 3H20l-6.35 7.44L20.5 21H16l-3.54-5.18L8.58 21H4.05l6.62-7.76z" />
    </svg>
  ),
};

export default function ContactLinks() {
  const { emails, links } = PROFILE;
  const items = [
    { label: "Email", href: `mailto:${emails.personal}`, icon: ICONS.email },
    emails.academic && { label: "Academic email", href: `mailto:${emails.academic}`, icon: ICONS.email },
    { label: "GitHub", href: links.github, icon: ICONS.github },
    { label: "LinkedIn", href: links.linkedin, icon: ICONS.linkedin },
    links.scholar && { label: "Google Scholar", href: links.scholar, icon: ICONS.scholar },
    links.orcid && { label: "ORCID", href: links.orcid, icon: ICONS.orcid },
    { label: "X", href: links.x, icon: ICONS.x },
  ].filter(Boolean);

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map(({ label, href, icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm text-muted transition-colors hover:border-muted hover:text-fg"
          >
            {icon}
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 8.5: `components/site-footer.jsx`**

```jsx
import { PROFILE } from "@/content/profile";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line/70 print:hidden">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} {PROFILE.name}</p>
        <p className="font-mono text-xs">Crafted with Next.js and an obsession for dependable systems.</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 8.6: `components/section.jsx`** (shared section shell with scroll-reveal class):

```jsx
import { Link } from "next-view-transitions";

export default function Section({ title, moreHref, moreLabel, children }) {
  return (
    <section className="anim-view border-t border-line/70 py-12">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {moreHref ? (
          <Link href={moreHref} className="u-link font-mono text-xs text-muted hover:text-fg">
            {moreLabel ?? "See all →"}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
```

- [ ] **Step 8.7: Rewrite `app/layout.js`** (no hardcoded theme class; no root canonical — pages own their canonicals):

```jsx
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ViewTransitions } from "next-view-transitions";
import ThemeProvider from "@/components/theme-provider";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { PROFILE } from "@/content/profile";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — Cloud-Native Infrastructure`, template: `%s — ${SITE_NAME}` },
  description: PROFILE.positioning,
  openGraph: { siteName: SITE_NAME, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <body className="flex min-h-svh flex-col bg-bg font-sans text-fg antialiased">
          <ThemeProvider>
            <a href="#main" className="skip-link">Skip to content</a>
            <SiteHeader />
            <main id="main" className="flex-1">{children}</main>
            <SiteFooter />
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
```

- [ ] **Step 8.8: Delete replaced components** (old pages still import `reveal-on-scroll`/`typewriter-role` — those die in Tasks 9–13, so only delete what nothing references after this step):

```bash
git rm components/theme-script.jsx components/ambient-background.jsx components/header.jsx components/footer.jsx
```

- [ ] **Step 8.9: Build + commit**

```bash
npm run build
```

Expected: green (old pages compile — they import `reveal-on-scroll`, `typewriter-role`, and their CSS modules, all still present).

```bash
git add app/layout.js components/
git commit -m "feat: new shell — layout, header, footer, theme, contact links

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Phase 3 — Pages

### Task 9: Home page

**Files:**
- Rewrite: `app/page.js`
- Create: `components/project-card.jsx`, `components/news-list.jsx`, `components/publication-list.jsx`, `components/photo-grid.jsx`
- Delete: `app/home.module.css`, `app/page.module.css`

- [ ] **Step 9.1: `components/project-card.jsx`**

```jsx
export default function ProjectCard({ project }) {
  const Tag = project.href ? "a" : "div";
  const linkProps = project.href
    ? { href: project.href, target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <Tag {...linkProps} className="card block p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-semibold tracking-tight">{project.title}</h3>
        <span className="shrink-0 font-mono text-xs text-muted">{project.period}</span>
      </div>
      <p className="mt-0.5 text-sm text-accent">{project.org}</p>
      <p className="mt-2 text-sm text-muted">{project.description}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <li key={t} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted">{t}</li>
        ))}
      </ul>
    </Tag>
  );
}
```

- [ ] **Step 9.2: `components/news-list.jsx`**

```jsx
export default function NewsList({ items }) {
  if (!items.length) return null;
  return (
    <ul className="dim-list space-y-3">
      {items.map((n, i) => (
        <li key={`${n.date}-${i}`} className="flex gap-4">
          <span className="w-20 shrink-0 pt-0.5 font-mono text-xs text-muted">{n.date}</span>
          <span className="text-sm">{n.text}</span>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 9.3: `components/publication-list.jsx`** (shared by home + research; renders papers, then theses; skips null titles gracefully):

```jsx
import { PUBLICATIONS, THESES } from "@/content/publications";

export default function PublicationList({ limit }) {
  const papers = limit ? PUBLICATIONS.slice(0, limit) : PUBLICATIONS;
  return (
    <div className="space-y-6">
      {papers.length > 0 && (
        <ol className="dim-list space-y-4">
          {papers.map((p) => (
            <li key={p.title} className="rounded-lg border border-line p-4">
              <p className="text-sm font-medium">{p.title}</p>
              <p className="mt-1 text-sm text-muted">{p.authors}</p>
              <p className="mt-1 font-mono text-xs text-muted">{p.venue} · {p.year}</p>
              {(p.links?.pdf || p.links?.doi) && (
                <p className="mt-2 flex gap-3 font-mono text-xs">
                  {p.links.pdf && <a className="text-accent underline underline-offset-2" href={p.links.pdf} target="_blank" rel="noopener noreferrer">PDF</a>}
                  {p.links.doi && <a className="text-accent underline underline-offset-2" href={p.links.doi} target="_blank" rel="noopener noreferrer">DOI</a>}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
      <ul className="dim-list space-y-3">
        {THESES.map((t) => (
          <li key={t.degree} className="flex flex-col gap-0.5">
            <span className="text-sm">
              <span className="font-medium">{t.degree}:</span>{" "}
              {t.title ?? <span className="text-muted">In progress</span>}
            </span>
            <span className="font-mono text-xs text-muted">{t.institution} · {t.year}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 9.4: `components/photo-grid.jsx`** (static responsive grid — replaces the marquee):

```jsx
import Image from "next/image";
import { PHOTOS } from "@/content/photos";

export default function PhotoGrid() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {PHOTOS.map((p) => (
        <li key={p.src} className="group relative overflow-hidden rounded-xl border border-line">
          <Image
            src={p.src}
            alt={p.caption}
            width={480}
            height={360}
            sizes="(max-width: 640px) 50vw, 33vw"
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 pt-6 text-[11px] leading-tight text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {p.caption} · {p.date}
          </figcaption>
        </li>
      ))}
    </ul>
  );
}
```

(Note: `figcaption` inside `li` without `figure` is invalid — wrap: use `<figure className="relative …">` inside the `li` and put the image + figcaption in it. Implement it that way.)

- [ ] **Step 9.5: Rewrite `app/page.js`**

```jsx
import Image from "next/image";
import { Link } from "next-view-transitions";
import Section from "@/components/section";
import ContactLinks from "@/components/contact-links";
import NewsList from "@/components/news-list";
import ProjectCard from "@/components/project-card";
import PublicationList from "@/components/publication-list";
import PhotoGrid from "@/components/photo-grid";
import { PROFILE } from "@/content/profile";
import { NEWS } from "@/content/news";
import { PROJECTS } from "@/content/projects";

export const metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  const featured = PROJECTS.filter((p) => p.featured);
  const lab = PROFILE.affiliation;
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <section className="relative pb-14 pt-16 sm:pt-24">
        <div className="bg-grid absolute inset-x-0 -top-14 -z-10 h-80" aria-hidden="true" />
        <div className="anim flex items-center gap-5">
          <Image
            src="/assets/images/loiht2-avatar.png"
            alt="Portrait of Thanh-Loi Hoang"
            width={88}
            height={88}
            priority
            className="rounded-full border border-line"
          />
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{PROFILE.name}</h1>
            <p className="mt-1.5 font-mono text-sm text-muted">{PROFILE.role} · {PROFILE.location}</p>
          </div>
        </div>
        <p className="anim mt-6 max-w-prose text-pretty text-lg leading-relaxed text-muted" style={{ "--d": "90ms" }}>
          I work on cloud-native infrastructure for AI/ML — Kubernetes, MLOps, and network performance — at{" "}
          {lab.labUrl ? (
            <a href={lab.labUrl} target="_blank" rel="noopener noreferrer" className="u-link text-fg">{lab.lab}, {lab.university}</a>
          ) : (
            <span className="text-fg">{lab.lab}, {lab.university}</span>
          )}
          . {PROFILE.goal}
        </p>
        <div className="anim mt-8 flex flex-wrap gap-3" style={{ "--d": "180ms" }}>
          <Link href="/cv" className="btn btn-primary">View CV</Link>
          <Link href="/projects" className="btn btn-ghost">Projects</Link>
        </div>
        <div className="anim mt-8" style={{ "--d": "270ms" }}>
          <ContactLinks />
        </div>
      </section>

      <Section title="News">
        <NewsList items={NEWS.slice(0, 5)} />
      </Section>

      <Section title="Featured projects" moreHref="/projects" moreLabel="All projects →">
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((p) => <ProjectCard key={p.title} project={p} />)}
        </div>
      </Section>

      <Section title="Publications" moreHref="/research" moreLabel="Research →">
        <PublicationList limit={3} />
      </Section>

      <Section title="Photos">
        <p className="mb-5 -mt-2 text-sm text-muted">Conferences, campuses, and places in between.</p>
        <PhotoGrid />
      </Section>
    </div>
  );
}
```

- [ ] **Step 9.6: Delete dead CSS, build, verify content, commit**

```bash
git rm app/home.module.css app/page.module.css
npm run build
npm run dev & sleep 6
curl -s http://localhost:3000/ | grep -o "Thanh-Loi Hoang" | head -1
curl -s http://localhost:3000/ | grep -c "linkedin.com/in/thanh-loi-hoang"   # expected: >=1 — LinkedIn finally rendered
curl -s http://localhost:3000/ | grep -c "facebook"                          # expected: 0
kill %1
git add -A && git commit -m "feat: new home — hero, news, featured work, publications, photo grid

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 10: Research page (new)

**Files:**
- Create: `app/research/page.js`

- [ ] **Step 10.1: Write the page** (renders only what exists; honest fallbacks, no lorem ipsum):

```jsx
import Section from "@/components/section";
import PublicationList from "@/components/publication-list";
import { PROFILE } from "@/content/profile";
import { EDUCATION } from "@/content/education";

export const metadata = {
  title: "Research",
  description: "Research interests, thesis work, and publications of Thanh-Loi Hoang.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  const msc = EDUCATION.find((e) => e.degree === "MSc");
  const { links } = PROFILE;
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <header className="pb-4 pt-16">
        <h1 className="anim text-3xl font-semibold tracking-tight sm:text-4xl">Research</h1>
        <p className="anim mt-4 max-w-prose leading-relaxed text-muted" style={{ "--d": "90ms" }}>
          {PROFILE.researchInterests ??
            "I study cloud-native infrastructure for AI/ML at DCNLab, Soongsil University — a full research statement is coming soon."}
        </p>
        {(links.scholar || links.orcid) && (
          <p className="anim mt-4 flex gap-4 font-mono text-sm" style={{ "--d": "180ms" }}>
            {links.scholar && <a className="u-link text-accent" href={links.scholar} target="_blank" rel="noopener noreferrer">Google Scholar</a>}
            {links.orcid && <a className="u-link text-accent" href={links.orcid} target="_blank" rel="noopener noreferrer">ORCID</a>}
          </p>
        )}
      </header>

      <Section title="Thesis">
        <div className="card p-5">
          <p className="text-sm">
            <span className="font-medium">MSc thesis:</span>{" "}
            {msc.thesis ?? <span className="text-muted">Topic to be announced — in progress</span>}
          </p>
          <p className="mt-2 font-mono text-xs text-muted">
            {msc.school}
            {msc.advisor ? ` · Advisor: ${msc.advisor}` : ""}
            {msc.expectedGraduation ? ` · Expected ${msc.expectedGraduation}` : ""}
          </p>
        </div>
      </Section>

      <Section title="Publications">
        <PublicationList />
      </Section>
    </div>
  );
}
```

- [ ] **Step 10.2: Build check + commit**

```bash
npm run build
git add app/research && git commit -m "feat: research page — interests, thesis, publications

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 11: Projects page

**Files:**
- Rewrite: `app/projects/page.js`
- Delete: `app/projects/projects.module.css`

- [ ] **Step 11.1: Rewrite `app/projects/page.js`**

```jsx
import Section from "@/components/section";
import ProjectCard from "@/components/project-card";
import { PROJECTS } from "@/content/projects";

export const metadata = {
  title: "Projects",
  description: "Cloud infrastructure, Kubernetes, and MLOps work by Thanh-Loi Hoang.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <header className="pb-4 pt-16">
        <h1 className="anim text-3xl font-semibold tracking-tight sm:text-4xl">Projects</h1>
        <p className="anim mt-4 max-w-prose text-muted" style={{ "--d": "90ms" }}>
          Platform work across research and industry — lab MLOps stacks and production banking infrastructure.
        </p>
      </header>
      <div className="anim grid gap-4 py-8 sm:grid-cols-2" style={{ "--d": "180ms" }}>
        {PROJECTS.map((p) => <ProjectCard key={p.title} project={p} />)}
      </div>
    </div>
  );
}
```

- [ ] **Step 11.2: Delete module CSS, build, commit**

```bash
git rm app/projects/projects.module.css
npm run build
git add -A && git commit -m "feat: projects page on shared card system

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 12: Writing pipeline (MDX) — lib with tests, listing, post page

**Files:**
- Create: `lib/posts.js`, `tests/posts.test.mjs`, `content/posts/hello-world.mdx`, `app/writing/page.js`, `app/writing/[slug]/page.js`, `components/mdx-components.jsx`
- Delete: `app/blog/page.js` (dir), `app/posts/hello-world/page.js` (dir) — redirects from Task 5 preserve the old URLs

- [ ] **Step 12.1: Migrate the post — `content/posts/hello-world.mdx`**

```mdx
---
title: "Hello, world"
description: "A welcome note outlining upcoming essays on Kubernetes, MLOps, and running calm cloud platforms."
date: "2025-08-30"
---

Welcome! I'm assembling a series of deep dives on the craft of running
resilient cloud platforms for ML teams — covering everything from Kubernetes
operations to the people practices that keep systems calm.

In the meantime, explore the [projects](/projects) or
[get in touch](mailto:loi.hoangthanh.24@gmail.com) to compare notes. New
essays are on the way soon.
```

(Note: this also fixes the old "orget in touch" missing-space bug.)

- [ ] **Step 12.2: Write the failing test — `tests/posts.test.mjs`**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { getAllPosts, getPost } from "../lib/posts.js";

test("getAllPosts returns hello-world with full frontmatter", () => {
  const posts = getAllPosts();
  assert.ok(posts.length >= 1);
  const hw = posts.find((p) => p.slug === "hello-world");
  assert.ok(hw, "hello-world post missing");
  assert.equal(hw.title, "Hello, world");
  assert.equal(hw.date, "2025-08-30");
  assert.ok(hw.description.length > 10);
  assert.ok(hw.content.includes("resilient cloud platforms"));
});

test("posts are sorted newest first", () => {
  const dates = getAllPosts().map((p) => p.date);
  const sorted = [...dates].sort().reverse();
  assert.deepEqual(dates, sorted);
});

test("getPost returns null for unknown slug", () => {
  assert.equal(getPost("does-not-exist"), null);
});
```

- [ ] **Step 12.3: Run it — verify FAIL**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../lib/posts.js'`.

- [ ] **Step 12.4: Implement `lib/posts.js`**

```js
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const slug = f.replace(/\.mdx$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, f), "utf8"));
      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: typeof data.date === "string" ? data.date : data.date?.toISOString().slice(0, 10),
        content,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug) {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}
```

- [ ] **Step 12.5: Run tests — verify PASS**

```bash
npm test
```

Expected: 3 passing.

- [ ] **Step 12.6: `components/mdx-components.jsx`**

```jsx
import { Link } from "next-view-transitions";

export const mdxComponents = {
  a: ({ href = "", children, ...rest }) =>
    href.startsWith("/") ? (
      <Link href={href} {...rest}>{children}</Link>
    ) : (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} {...rest}>
        {children}
      </a>
    ),
};
```

- [ ] **Step 12.7: `app/writing/page.js`**

```jsx
import { Link } from "next-view-transitions";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Writing",
  description: "Essays and field notes on cloud platforms, Kubernetes operations, and MLOps.",
  alternates: { canonical: "/writing" },
};

export default function WritingPage() {
  const posts = getAllPosts();
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <header className="pb-4 pt-16">
        <h1 className="anim text-3xl font-semibold tracking-tight sm:text-4xl">Writing</h1>
        <p className="anim mt-4 max-w-prose text-muted" style={{ "--d": "90ms" }}>
          Essays, debriefs, and practical observations from building cloud-native platforms.
        </p>
      </header>
      <ul className="dim-list anim space-y-2 py-8" style={{ "--d": "180ms" }}>
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/writing/${p.slug}`} className="group flex flex-col gap-1 rounded-xl p-4 transition-colors hover:bg-card sm:flex-row sm:items-baseline sm:justify-between">
              <span>
                <span className="font-medium group-hover:text-accent">{p.title}</span>
                <span className="mt-1 block text-sm text-muted">{p.description}</span>
              </span>
              <time dateTime={p.date} className="shrink-0 font-mono text-xs text-muted">{p.date}</time>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 12.8: `app/writing/[slug]/page.js`**

```jsx
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPost } from "@/lib/posts";
import { mdxComponents } from "@/components/mdx-components";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/writing/${slug}` },
    openGraph: { title: post.title, description: post.description, type: "article", publishedTime: post.date },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6">
      <div className="progress-bar" aria-hidden="true" />
      <header className="pb-8 pt-16">
        <h1 className="anim text-3xl font-semibold tracking-tight sm:text-4xl">{post.title}</h1>
        <p className="anim mt-3 font-mono text-sm text-muted" style={{ "--d": "90ms" }}>
          <time dateTime={post.date}>{post.date}</time>
        </p>
      </header>
      <div className="prose anim pb-16" style={{ "--d": "180ms" }}>
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>
    </article>
  );
}
```

- [ ] **Step 12.9: Remove old routes, build, verify, commit**

```bash
git rm -r app/blog app/posts
npm run build
npm run dev & sleep 6
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/writing            # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/writing/hello-world  # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/blog               # 308 (redirect)
curl -s http://localhost:3000/writing/hello-world | grep -c "get in touch"      # >=1, with the space fixed
kill %1
git add -A && git commit -m "feat: MDX writing pipeline with tested posts lib; redirect legacy routes

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 13: CV page (print-safe, animation-free) + 404

**Files:**
- Rewrite: `app/cv/page.js`, `app/not-found.js`
- Delete: `app/cv/cv.module.css`, `components/reveal-on-scroll.jsx`, `components/typewriter-role.jsx`

- [ ] **Step 13.1: Rewrite `app/cv/page.js`** — data-driven, zero animation classes, PDF button only when `PROFILE.cvPdf` is set:

```jsx
import ContactLinks from "@/components/contact-links";
import PublicationList from "@/components/publication-list";
import { PROFILE } from "@/content/profile";
import { EXPERIENCE } from "@/content/experience";
import { EDUCATION } from "@/content/education";
import { SKILLS, CERTIFICATIONS, LANGUAGES } from "@/content/skills";

export const metadata = {
  title: "CV",
  description: "Curriculum vitae of Thanh-Loi Hoang — cloud-native infrastructure, Kubernetes, and MLOps.",
  alternates: { canonical: "/cv" },
};

function CvSection({ title, children }) {
  return (
    <section className="border-t border-line/70 py-8">
      <h2 className="mb-5 text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export default function CvPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <header className="flex flex-col gap-5 pb-8 pt-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{PROFILE.name}</h1>
          <p className="mt-1.5 font-mono text-sm text-muted">{PROFILE.role} · {PROFILE.location}</p>
        </div>
        {PROFILE.cvPdf && (
          <a href={PROFILE.cvPdf} download className="btn btn-primary print-hidden">Download PDF</a>
        )}
      </header>

      <div className="pb-8 print-hidden"><ContactLinks /></div>

      <CvSection title="Summary">
        {PROFILE.bio.map((p) => <p key={p.slice(0, 24)} className="mb-3 max-w-prose text-sm leading-relaxed text-muted">{p}</p>)}
      </CvSection>

      <CvSection title="Experience">
        <ol className="dim-list relative space-y-8 border-l border-line pl-6">
          {EXPERIENCE.map((job) => (
            <li key={`${job.title}-${job.org}`} className="relative">
              <span className="absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg" aria-hidden="true" />
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-medium">{job.title}</h3>
                <span className="font-mono text-xs text-muted">{job.period}</span>
              </div>
              <p className="text-sm text-accent">{job.org} · {job.location}</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted">
                {job.bullets.map((b) => <li key={b.slice(0, 24)}>{b}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </CvSection>

      <CvSection title="Education">
        <div className="space-y-5">
          {EDUCATION.map((e) => (
            <div key={e.degree} className="card p-5">
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-medium">{e.degree}, {e.field}</h3>
                <span className="font-mono text-xs text-muted">{e.period}</span>
              </div>
              <p className="text-sm text-muted">{e.school} · {e.location}</p>
              <dl className="mt-3 space-y-1 text-sm">
                {e.honors && <div><dt className="inline font-medium">Honors: </dt><dd className="inline text-muted">{e.honors}</dd></div>}
                {e.thesis && <div><dt className="inline font-medium">Thesis: </dt><dd className="inline text-muted">{e.thesis}</dd></div>}
                {e.gpa && <div><dt className="inline font-medium">GPA: </dt><dd className="inline text-muted">{e.gpa}</dd></div>}
                {e.expectedGraduation && <div><dt className="inline font-medium">Expected graduation: </dt><dd className="inline text-muted">{e.expectedGraduation}</dd></div>}
              </dl>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {e.focus.map((f) => <li key={f} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted">{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </CvSection>

      <CvSection title="Publications">
        <PublicationList />
      </CvSection>

      <CvSection title="Skills">
        <div className="grid gap-5 sm:grid-cols-2">
          {SKILLS.map((s) => (
            <div key={s.group}>
              <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">{s.group}</h3>
              <ul className="flex flex-wrap gap-1.5">
                {s.items.map((i) => <li key={i} className="rounded-full border border-line px-2.5 py-0.5 text-sm">{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </CvSection>

      {CERTIFICATIONS.length > 0 && (
        <CvSection title="Certifications">
          <ul className="space-y-2 text-sm">
            {CERTIFICATIONS.map((c) => (
              <li key={c.name}><span className="font-medium">{c.name}</span> <span className="text-muted">— {c.issuer}, {c.year}</span></li>
            ))}
          </ul>
        </CvSection>
      )}

      <CvSection title="Languages">
        <ul className="space-y-2 text-sm">
          {LANGUAGES.map((l) => (
            <li key={l.name} className="flex justify-between gap-4 sm:justify-start">
              <span className="w-28 font-medium">{l.name}</span>
              <span className="text-muted">{l.level}</span>
            </li>
          ))}
        </ul>
      </CvSection>
    </div>
  );
}
```

- [ ] **Step 13.2: Rewrite `app/not-found.js`**

```jsx
import { Link } from "next-view-transitions";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-center justify-center gap-5 px-4 text-center">
      <p className="anim font-mono text-sm text-muted">404</p>
      <h1 className="anim text-3xl font-semibold tracking-tight" style={{ "--d": "80ms" }}>Page not found</h1>
      <Link href="/" className="btn btn-primary anim" style={{ "--d": "160ms" }}>Back to home</Link>
    </div>
  );
}
```

- [ ] **Step 13.3: Delete last legacy components + CSS, build, verify no TOEIC-as-cert / no IELTS**

```bash
git rm app/cv/cv.module.css components/reveal-on-scroll.jsx components/typewriter-role.jsx
npm run build
npm run dev & sleep 6
curl -s http://localhost:3000/cv | grep -c "IELTS"            # expected: 0
curl -s http://localhost:3000/cv | grep -c "TOEIC 835"        # expected: 1 (under Languages)
curl -s http://localhost:3000/cv | grep -c "loiht2-cv.pdf"    # expected: 0 (cvPdf is null — no broken link)
kill %1
git add -A && git commit -m "feat: data-driven print-safe CV page; new 404; drop last legacy components

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Phase 4 — SEO & platform surfaces

### Task 14: Generated sitemap, robots, manifest, RSS, OG image, icons

**Files:**
- Create: `app/sitemap.js`, `app/robots.js`, `app/manifest.js`, `app/rss.xml/route.js`, `app/opengraph-image.js`, `app/icon.js`, `app/apple-icon.js`
- Delete: `public/sitemap.xml`, `public/rss.xml`, `public/robots.txt`, `public/site.webmanifest`, `app/favicon.ico`, and boilerplate assets

- [ ] **Step 14.1: `app/sitemap.js`**

```js
import { getAllPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export default function sitemap() {
  const now = new Date();
  const routes = ["", "/research", "/projects", "/writing", "/cv"].map((r) => ({
    url: `${SITE_URL}${r}`,
    lastModified: now,
  }));
  const posts = getAllPosts().map((p) => ({
    url: `${SITE_URL}/writing/${p.slug}`,
    lastModified: new Date(p.date),
  }));
  return [...routes, ...posts];
}
```

- [ ] **Step 14.2: `app/robots.js`**

```js
import { SITE_URL } from "@/lib/site";

export default function robots() {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
```

- [ ] **Step 14.3: `app/manifest.js`**

```js
export default function manifest() {
  return {
    name: "Thanh-Loi Hoang",
    short_name: "loiht2",
    description: "Cloud-native infrastructure for AI/ML — Kubernetes, MLOps, and network performance.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
```

- [ ] **Step 14.4: `app/rss.xml/route.js`**

```js
import { getAllPosts } from "@/lib/posts";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const posts = getAllPosts();
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/writing/${p.slug}</link>
      <guid>${SITE_URL}/writing/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${esc(p.description)}</description>
    </item>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_NAME} — Writing</title>
    <link>${SITE_URL}/writing</link>
    <description>Notes on cloud platforms, Kubernetes, and MLOps.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
```

- [ ] **Step 14.5: `app/opengraph-image.js`**

```jsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Thanh-Loi Hoang — cloud-native infrastructure for AI/ML";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0a",
          color: "#ededed",
        }}
      >
        <div style={{ width: 96, height: 8, background: "#3b82f6", borderRadius: 4, marginBottom: 40 }} />
        <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: "-0.02em" }}>Thanh-Loi Hoang</div>
        <div style={{ fontSize: 34, color: "#a1a1aa", marginTop: 24, lineHeight: 1.4 }}>
          Cloud-native infrastructure for AI/ML — Kubernetes, MLOps, network performance
        </div>
        <div style={{ fontSize: 26, color: "#52525b", marginTop: 40 }}>DCNLab · Soongsil University · Seoul</div>
      </div>
    ),
    size
  );
}
```

- [ ] **Step 14.6: `app/icon.js` and `app/apple-icon.js`**

`app/icon.js`:

```jsx
import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#ededed",
          fontSize: 240,
          fontWeight: 700,
          borderRadius: 96,
        }}
      >
        TL
      </div>
    ),
    size
  );
}
```

`app/apple-icon.js`: identical but `export const size = { width: 180, height: 180 };`, `fontSize: 84`, `borderRadius: 0`.

- [ ] **Step 14.7: Delete superseded static files + boilerplate assets**

```bash
git rm public/sitemap.xml public/rss.xml public/robots.txt public/site.webmanifest app/favicon.ico
git rm public/next.svg public/vercel.svg public/file.svg public/globe.svg public/window.svg public/assets/avatar-bg.svg
```

- [ ] **Step 14.8: Build + verify surfaces + commit**

```bash
npm run build
npm run dev & sleep 6
curl -s http://localhost:3000/sitemap.xml | grep -c "loiht2.vercel.app"   # >= 6
curl -s http://localhost:3000/rss.xml | grep -c "<item>"                  # >= 1
curl -s http://localhost:3000/robots.txt | grep -c "Sitemap"              # 1
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/opengraph-image  # 200
kill %1
git add -A && git commit -m "feat: generated sitemap/robots/manifest/rss/og-image on vercel URL

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Phase 5 — Docs & final verification

### Task 15: Rewrite README, delete RUNNING.md

**Files:**
- Rewrite: `README.md`
- Delete: `RUNNING.md` (stale: Next 15/Node 18 claims, `npm start` misinformation, legacy-site references, Gmail in support section)

- [ ] **Step 15.1: New `README.md`**

```markdown
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
```

- [ ] **Step 15.2: Delete RUNNING.md, commit**

```bash
git rm RUNNING.md
git add README.md
git commit -m "docs: rewrite README for vercel-native stack, remove stale RUNNING.md

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 16: Full verification sweep

- [ ] **Step 16.1: Clean gate run**

```bash
npm run lint && npm test && npm run check:privacy && npm run build
```

Expected: all pass, build lists routes `/`, `/research`, `/projects`, `/writing`, `/writing/hello-world`, `/cv`, plus sitemap/rss/og/icon.

- [ ] **Step 16.2: Route + content assertions against the production build**

```bash
npm run start & sleep 4
for r in / /research /projects /writing /writing/hello-world /cv; do
  printf "%-24s %s\n" "$r" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000$r)"
done                                                        # all 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/blog   # 308
curl -sI http://localhost:3000/ | grep -i "x-frame-options"           # DENY
curl -s http://localhost:3000/ | grep -c 'class="anim'                # >=3 — entrance choreography present
curl -s http://localhost:3000/ | grep -c 'opacity:0\|opacity: 0'      # 0 — nothing hidden in server HTML (no-JS safe)
curl -s http://localhost:3000/cv | grep -ci "research assistant"      # >=1
kill %1
```

- [ ] **Step 16.3: Responsive/visual pass** — use the `verify`/`run` skill flow if a browser is available: screenshot `/`, `/cv`, `/writing/hello-world` at 375×812 (phone), 768×1024 (tablet/iPad), 1440×900 (desktop) in both themes; check the mobile menu opens/closes, theme toggle persists across reloads, photo-grid captions appear on hover, and a print preview of `/cv` shows every section. If no browser is available, mark this step for the user to eyeball on the Vercel preview deploy.

- [ ] **Step 16.4: Merge and push**

```bash
git switch master && git merge --no-ff feat/redesign-2026 -m "feat: redesign 2026 — new UI, privacy hardening, vercel-native

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
git push origin master
```

(Vercel auto-deploys. If auth fails, hand the user the push command.)

- [ ] **Step 16.5: Post-deploy checks (user-visible)**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://loiht2.vercel.app/           # 200
curl -s https://loiht2.vercel.app/sitemap.xml | grep -c "loiht2.vercel.app"   # >= 6
```

### Task 17: User-side closeout checklist (present to the user; do not attempt)

- [ ] GitHub → repo Settings → Pages → Source: **None** (stops the Jekyll-rendered README at loiht2.github.io).
- [ ] The four privacy checklist items in `docs/privacy-remediation.md` (support ticket, email settings, global git config, 2FA).
- [ ] Vercel dashboard: confirm production deployment is green; optionally set a custom domain later (then change `SITE_URL` in `lib/site.js` — one line).
- [ ] Fill the `FILL_ME` fields in `content/*.js` (grep: `grep -rn "FILL_ME" content/`) and drop the public-safe CV PDF into `public/` + set `PROFILE.cvPdf`.

---

## Self-review notes (spec → plan coverage)

- Spec §2 decisions: hosting/Vercel (T5, T14, T16), emails alongside (T7 `emails.academic`), history rewrite (T3), cuts — IELTS/Facebook/single-X/typewriter/marquee (T7, T8.4, T9.4, T13).
- Spec §4 IA: all six routes have tasks (T9–T13); redirects preserve old URLs (T5).
- Spec §5/§6 design + animation systems: T6 implements every named pattern (tokens, rise choreography, view-timeline reveals, dim-list, bg-grid, u-link, progress bar, reduced-motion, print).
- Spec §8 SEO: T14 (per-page canonicals are in each page's metadata, T9–T13).
- Spec §9 a11y: skip link/focus/landmarks in T6/T8; heading order h1→h2→h3 everywhere; no aria-live abuse (typewriter deleted T13).
- Spec §10 privacy: T1–T3 + guard script wired as `npm run check:privacy` (T4) and gate (T16).
- Spec §12 blanks: `FILL_ME` convention (T7) + closeout grep (T17).
