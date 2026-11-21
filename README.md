# cv

[![build-deploy-pages](https://github.com/zubrik13/cv/actions/workflows/build.yaml/badge.svg)](https://github.com/zubrik13/cv/actions/workflows/build.yaml) [![Actions lint](https://github.com/zubrik13/cv/actions/workflows/actions-lint.yaml/badge.svg)](https://github.com/zubrik13/cv/actions/workflows/actions-lint.yaml) [![YAML lint](https://github.com/zubrik13/cv/actions/workflows/yaml-lint.yaml/badge.svg)](https://github.com/zubrik13/cv/actions/workflows/yaml-lint.yaml) [![cv.zubrik.me](https://img.shields.io/website?url=https%3A%2F%2Fcv.zubrik.me&label=cv.zubrik.me)](https://cv.zubrik.me)

Personal CV published at [cv.zubrik.me](https://cv.zubrik.me). The web page is rendered from a YAML data file and a Handlebars template. A printable version is downloadable as PDF. The repo layout follows [agentic-repo-seed](https://github.com/zjor/agentic-repo-seed). Conventions for humans and coding agents are in [`CLAUDE.md`](CLAUDE.md).

## Repository Structure

```text
cv/
├── src/
│   ├── cv-site/   # Web CV: data.yaml, template.hbs, css/, render.js, deploy/
│   └── cv-pdf/    # Printable CV: resume.html (hand-edited) and resume.pdf
├── docs/
│   ├── product/   # PRD, roadmap, architecture, features (permanent)
│   └── process/   # ADRs and specs (one per build moment)
├── ops/           # Runbooks (recurring routines)
└── dist/          # Build output, git-ignored, published to gh-pages
```

## Prerequisites

| Tool | Version |
| --- | --- |
| Node.js | 26 LTS (pinned in `.nvmrc`, used by CI) |
| npm | bundled with Node |
| Python | 3.7+ (only for `npm run serve`) |
| yamllint | 1.38.0 (tested; optional, YAML checks) |
| actionlint | 1.7.12 (tested; optional, workflow checks) |

## Quick start

```bash
npm ci
npm run watch   # terminal A: re-render dist/ on every change under src/cv-site/
npm run serve   # terminal B: http://localhost:8000
```

| Script | What it does |
| --- | --- |
| `npm run render` | Render `dist/index.html` and copy CSS, `resume.pdf` and `resume.html` into `dist/` |
| `npm run watch` | Same, then re-render on change |
| `npm run serve` | Serve `dist/` on port 8000 |

## Linting

Each check runs in its own GitHub Actions workflow and has a badge at the top of this page. Run the same commands locally from the repo root.

| Check | Scope | Workflow |
| --- | --- | --- |
| Render | `npm run render` on every PR and push to `master` | `build.yaml` |
| YAML syntax and style | All `*.yaml` (rules in `.yamllint.yaml`) | `yaml-lint.yaml` |
| GitHub Actions workflow lint | `.github/workflows/` | `actions-lint.yaml` |

```bash
npm run render
yamllint --strict -c .yamllint.yaml .
actionlint
```

## Directories

### `src/cv-site/`

The web CV. Edit content here, not in the markup.

| File | Description |
| --- | --- |
| `data.yaml` | All content: profile, skills, experience, education, Credly badge ids |
| `template.hbs` | Handlebars page template |
| `css/style.css` | Screen and print styles |
| `render.js` | Build script → `dist/` |
| `deploy/` | Points to the deploy workflow |

### `src/cv-pdf/`

| File | Description |
| --- | --- |
| `resume.html` | Standalone printable CV, also served at `/resume.html` |
| `resume.pdf` | PDF exported from `resume.html`, linked as **Download (pdf)** |

> **Note:** `resume.html` is a separate copy of the content, so mirror every `data.yaml` change there. Merging the two is on the [roadmap](docs/product/ROADMAP.md).

### `docs/` and `ops/`

| Path | Description |
| --- | --- |
| [`docs/product/ROADMAP.md`](docs/product/ROADMAP.md) | Prioritized backlog |
| [`docs/product/architecture/overview.md`](docs/product/architecture/overview.md) | How the build and deploy work now |
| [`docs/process/specs/2026-11-21-code-optimization-review.md`](docs/process/specs/2026-11-21-code-optimization-review.md) | Code review with evidence and fixes |
| [`docs/process/decisions/`](docs/process/decisions/) | ADRs (append-only) |
| [`ops/update-cv.md`](ops/update-cv.md) | Runbook: edit → preview → export PDF → publish |

## Deployment

Pushing to `master` runs `build.yaml` on Node from `.nvmrc`: `npm ci` → `npm run render` → `peaceiris/actions-gh-pages` publishes `./dist` to the `gh-pages` branch, writing `CNAME` (`cv.zubrik.me`) on each deploy. Pull requests run the same build without deploying.

> **Important:** the repo is public. Everything in `src/cv-site/data.yaml`, including fields the page doesn't render (e.g. `info.phone`), is readable on GitHub.
