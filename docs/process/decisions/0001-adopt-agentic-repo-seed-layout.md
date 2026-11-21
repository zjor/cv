# 0001 — Adopt the agentic-repo-seed layout

**Status:** accepted (2026-11-21)

## Context

All files sat at the repo root: the generated `index.html` was committed, CI published the whole
repo root (including `package.json`, `render.js` and `data.yaml`) to `gh-pages`, and nothing told an
agent or a human how the two CV variants (web and PDF) relate. We want the repo to be easy for coding
agents to work in, following [agentic-repo-seed](https://github.com/zjor/agentic-repo-seed).

## Decision

- Product code lives in `src/`, one folder per component:
  - `src/cv-site/` — YAML + Handlebars → static web CV (`render.js`, `data.yaml`, `template.hbs`, `css/`).
  - `src/cv-pdf/` — the printable CV (`resume.html`, hand-maintained) and its exported `resume.pdf`.
- Build output goes to `dist/` (git-ignored). `render.js` also copies the CSS and the `cv-pdf`
  files there, so published URLs (`/`, `/css/style.css`, `/resume.pdf`, `/resume.html`) are unchanged.
- CI publishes `./dist` instead of `./`, sets `cname: cv.zubrik.me` (deploys no longer drop the
  custom domain), and also runs the build on pull requests without deploying, so path mistakes surface
  before `master`.
- Lint checks follow the `zubrik13/pe-tools` convention: one workflow per check, pinned tool versions, and
  a README badge for each (`yaml-lint.yaml` → yamllint 1.38.0, `actions-lint.yaml` → actionlint 1.7.12).
  Workflow actions were bumped to `checkout@v6.0.2`, `setup-node@v6.5.0` and `actions-gh-pages@v4.1.0`
  because actionlint rejects the old v3 runners. Node moved from 10.15.3 (EOL 2021) to 26 LTS, pinned in
  `.nvmrc`. The unused `html-pdf` / `phantomjs-prebuilt` dependencies (and `npm run pdf`) were removed:
  their install script fails on current Node, and the PDF is exported from `resume.html` in a browser.
- `run.sh` is replaced by `npm run serve` (serves `dist/`).
- Docs follow the durability axis: `docs/product/` (permanent), `docs/process/` (build-moment
  records), `ops/` (recurring routines).
- The deploy workflow must stay in `.github/workflows/` (GitHub requirement).
  `src/cv-site/deploy/README.md` points to it, so the component still documents its own deploy.

## Consequences

- `gh-pages` will no longer contain source files, only the built site.
- `index.html` is no longer in git. Preview locally with `npm run render && npm run serve`.
- The two-sources-of-truth problem (web vs. PDF) is now visible as two components. Merging them is
  tracked as item 2 of the [optimization review](../specs/2026-11-21-code-optimization-review.md).
