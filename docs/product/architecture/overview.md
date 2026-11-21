# Architecture overview

**PERMANENT (snapshot).** How it is built right now. Overwrite as it changes.

```text
src/cv-site/data.yaml ─┐
src/cv-site/template.hbs ─┼─ render.js (js-yaml + Handlebars) ──► dist/index.html
src/cv-site/css/ ────────┘                       └─ copies ──► dist/css/style.css
src/cv-pdf/resume.html ── (hand-edited, printed to PDF manually) ──► src/cv-pdf/resume.pdf
src/cv-pdf/resume.{html,pdf} ── copied by render.js ──► dist/resume.{html,pdf}

pull request   ─► .github/workflows/build.yaml ─► npm ci ─► npm run render   (no deploy)
push to master ─► .github/workflows/build.yaml ─► npm ci ─► npm run render ─► gh-pages (publish ./dist + CNAME) ─► cv.zubrik.me
push / PR      ─► yaml-lint.yaml (yamllint) · actions-lint.yaml (actionlint)   (path-filtered)
```

## Components

| component | what | entry |
| --- | --- | --- |
| `src/cv-site/` | Static web CV generated from YAML | `npm run render` / `npm run watch` |
| `src/cv-pdf/` | Printable CV (standalone HTML) + exported PDF | edit `resume.html`, print to PDF |

## Key facts

- Content for the web CV lives only in `data.yaml`. The PDF content is a **separate, hand-maintained
  copy** in `resume.html` (known drift risk; see roadmap).
- `dist/` is the only thing published. It is git-ignored.
- GitHub Pages serves the `gh-pages` branch at the custom domain `cv.zubrik.me`, behind **Cloudflare**
  (proxied DNS; Cloudflare terminates TLS and redirects HTTP → HTTPS).
- External runtime dependencies on the page: Google Fonts (Lato), Cloudinary (avatar), Credly
  embed script (badges), Google Analytics (UA, defunct).
