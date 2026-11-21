# Code optimization review — 2026-11-21

**TEMPORARY-ACT.** Snapshot review of the repo at `6d4b3a1`, taken while moving it to the
[agentic-repo-seed](https://github.com/zjor/agentic-repo-seed) layout (see
[ADR 0001](../decisions/0001-adopt-agentic-repo-seed-layout.md)). Nothing below is applied yet
except the layout itself; the prioritized backlog is mirrored in [ROADMAP](../../product/ROADMAP.md).

Each item: **finding** (with evidence) → **fix** → **effort** (S < 30 min, M < 2 h, L > 2 h).

---

## P0 — broken today

### 1. Every deploy deletes the custom domain
- **Finding:** `peaceiris/actions-gh-pages` force-replaces the `gh-pages` branch, and no `CNAME` is
  published, so `cv.zubrik.me` is dropped on every deploy. `gh-pages` history shows it being
  re-created by hand right after each CI deploy (`deploy: 15abd4b` → `Create CNAME` → `Update CNAME`,
  and again after `deploy: 6d4b3a1`).
- **Fix:** add `cname: cv.zubrik.me` to the deploy step in `.github/workflows/build.yaml`.
- **Effort:** S

### 2. Two hand-maintained copies of the CV drift apart
- **Finding:** the web CV renders from `src/cv-site/data.yaml`; the PDF is printed from a separate
  hand-written `src/cv-pdf/resume.html`. One content update (`6d4b3a1 feat: add SPM`) touched
  `data.yaml`, `index.html`, `resume.html` and `resume.pdf`. They have already diverged: the PDF has
  "Summary" groups and "Key references" that the YAML lacks, and job titles differ (e.g. ORBIT
  "Cloud Consultant | AWS" vs "Cloud Consultant").
- **Fix:** make `data.yaml` the single source. Add the missing fields (`summary` groups,
  `references` per job), turn `resume.html` into a second template `src/cv-pdf/template.hbs`, render
  both from the same data, and generate the PDF in CI with headless Chromium (`playwright` or
  `puppeteer` `page.pdf()`), which honours the existing `@media print` CSS. Stop committing
  `resume.pdf` (each update currently adds a ~150 KB binary to history).
- **Effort:** L

### 3. Open Graph description is always empty
- **Finding:** `template.hbs` uses `{{info.profile}}`, but `profile` is top-level in `data.yaml`.
- **Fix:** `{{profile}}`. Item 6 (strict mode) would have caught this.
- **Effort:** S

### 4. Broken `<head>`: no viewport, malformed meta tags
- **Finding:**
  - There is no `<meta name="viewport">`, so phones render the desktop layout zoomed out and every
    `max-width: 767px / 543px / 525px` rule in `style.css` never fires on real devices.
  - `<meta charset="utf-8" name="og:title" …>` mixes charset with OG; OG tags need `property="og:…"`.
  - `<html>` has no `lang`.
- **Fix:**
  ```html
  <html lang="en">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta property="og:title" content="{{title}}">
  <meta property="og:description" content="{{profile}}">
  <meta property="og:image" content="…">
  ```
- **Effort:** S

### 5. Dead analytics
- **Finding:** `UA-72137960-1` is a Universal Analytics property; Google stopped processing UA hits in
  July 2023. The script still loads on every visit and collects nothing.
- **Fix:** remove it, or replace it with a GA4 `G-…` ID if analytics is still wanted.
- **Effort:** S

---

## P1 — build, CI, security

### 6. Silent template errors → enable strict mode
- **Finding:** Handlebars renders missing fields as empty strings, which is how item 3 went unnoticed.
- **Fix:** `Handlebars.compile(src, { strict: true })` makes the render throw on unknown paths.
  Optional fields (e.g. `url`) need `{{#if url}}` guards.
- **Effort:** S

### 7. 14 known vulnerabilities, mostly from unused PDF tooling
- **Finding:** `npm audit` on the lockfile: 14 advisories (6 critical, 5 high, 3 moderate). Direct
  dependencies: `handlebars 4.7.6` (critical; fixed in 4.7.10), `js-yaml 3.14.1` (high; 4.x
  current), `html-pdf 3.0.1` and `phantomjs-prebuilt 2.1.16` (both unmaintained, high, no non-breaking
  fix). Most transitive hits (`request`, `form-data`, `extract-zip`, `minimist`…) come from
  `html-pdf`/`phantomjs`. CI installs them on every run and downloads the PhantomJS binary, yet CI
  never builds a PDF. Locally, `npm run pdf` renders the *web* page, not `resume.html`, so it is not
  how the committed PDF is made.
- **Fix:** drop `html-pdf` and `phantomjs-prebuilt` (covered by item 2's Chromium PDF), bump
  `handlebars` to `^4.7.10` and `js-yaml` to `^4` (`load` API is the same for this use). Close the
  stale `dependabot/npm_and_yarn/handlebars-4.3.0` branch.
- **Effort:** S (bump/remove) · M with item 2

### 8. EOL runtime and deprecated actions in CI
- **Finding:** `node-version: "10.15.3"` (EOL April 2021); `actions/checkout@v3` and
  `actions/setup-node@v3` run on the deprecated Node 16 action runtime; `npm install` instead of
  `npm ci`.
- **Fix:**
  ```yaml
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with: { node-version: 22, cache: npm }
  - run: npm ci
  - run: npm run render
  - uses: peaceiris/actions-gh-pages@v4
    with:
      github_token: ${{ secrets.GITHUB_TOKEN }}
      publish_dir: ./dist
      cname: cv.zubrik.me
  ```
  Add `"engines": { "node": ">=22" }` to `package.json`.
- **Effort:** S

### 9. Enforce HTTPS on Pages
- **Finding:** the Pages API reports `https_enforced: false` for `cv.zubrik.me`.
- **Fix:** Settings → Pages → *Enforce HTTPS* (or `gh api -X PUT repos/zubrik13/cv/pages -F https_enforced=true`).
- **Effort:** S

---

## P2 — code quality and data hygiene

### 10. `render.js` cleanups
- `contains(list, x)` → `process.argv.includes(x)`.
- `console.log(html)` prints the whole ~12 KB page on every render (CI log and watch noise). Drop it.
- `fs.watch` fires two or three events per save on macOS → debounce (~100 ms).
- The `--pdf` callback logs `res` even after an error; `return` after logging `err` (moot if item 7
  removes it).
- **Effort:** S

### 11. Duplicate and unused data in `data.yaml`
- `certifications` (name + URL) and `badges` (id) repeat the same five UUIDs; the template only uses
  `badges`. Merge into one `certifications: [{ name, id }]` list and derive the Credly URL in the
  template.
- Never rendered: `experience[].technologies`, `info.phone`. Either render `technologies` (useful
  for keyword-scanning recruiters) or delete them. The template still references `info.hackerrank`
  (commented out), but the data no longer has it.
- Self-employed `url:` is empty, so it renders `<a href="">`, a link to the page itself. Guard
  with `{{#if url}}`.
- Typos: "Gilab CI/CD" ×2 (Swipelux); trailing comma in self-employed `technologies`.
- **Effort:** S

### 12. Hard-coded content in the template
- Footer name, Interests list and avatar URL (repeated in `og:image` and `<img>`) live in
  `template.hbs`. Move them to `data.yaml` so content edits never touch markup.
- `<img>` has no `alt`, `width` or `height`, so it shifts the layout when it loads.
- **Effort:** S

### 13. CSS / loading
- `@import url(fonts.googleapis.com…)` inside `style.css` serialises the font request behind the CSS.
  Replace with `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` + a
  `<link rel="stylesheet" href="…family=Lato:wght@400;700;900&display=swap">` in `<head>`.
- Print rule `h2, h3 { color: red; }` is a debug leftover (already overridden by
  `* { color: #000 !important }`). Delete it.
- Credly embed uses a protocol-relative `//cdn.credly.com/…` URL; use `https://`.
- **Effort:** S

### 14. `package.json` metadata from the upstream fork
- `author`, `bugs` and `homepage` point to `zjor/cv`; `main: index.js` doesn't exist. Set
  `"private": true`, fix the URLs, and drop `main`.
- **Effort:** S

### 15. A smoke test
- No tests exist. One colocated test (`src/cv-site/render.test.js`, `node --test`) that renders
  `data.yaml` in strict mode and asserts key strings (name, latest employer, every badge id) would
  catch items 3 and 11 in CI before deploy.
- **Effort:** S

---

## Content check (not code)
- Swipelux (Mar 2022 – Dec 2023) overlaps Smartlook (Aug – Dec 2022). Fine if they were concurrent;
  otherwise fix the dates.
