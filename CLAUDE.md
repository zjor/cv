# CV

Personal CV published at <https://cv.zubrik.me>: a static web page rendered from YAML, plus a
downloadable PDF. Layout follows [agentic-repo-seed](https://github.com/zjor/agentic-repo-seed).

## Commands

```bash
npm ci              # install (Node version: .nvmrc)
npm run render      # build dist/ (index.html + css + resume.pdf/html)
npm run watch       # re-render on changes under src/cv-site/
npm run serve       # serve dist/ at http://localhost:8000
yamllint --strict -c .yamllint.yaml .   # YAML lint (CI: yaml-lint.yaml)
actionlint                              # workflow lint (CI: actions-lint.yaml)
```

Deploy = push to `master` → `.github/workflows/build.yaml` publishes `./dist` to `gh-pages` with
`CNAME` = `cv.zubrik.me`. Pull requests run the same build without deploying. Before pushing, run all
three checks (render, yamllint, actionlint). Each one has a README badge.

## How this repo is organized — the durability axis

Sort files by the **activity that produced them**:

- **`docs/product/` — PERMANENT.** What the CV product is and how it is built *now*. Overwrite as reality changes.
- **`docs/process/` — TEMPORARY-ACT.** Specs, plans, ADRs, each tied to one build moment.
- **`ops/` — RECURRING.** Routines run again and again (e.g. updating the CV).
- **`src/` — the product itself.** Each component owns its own `deploy/`.

## Map

```text
.
├── .github/workflows/
│   ├── build.yaml                 render on PR/push; publish dist/ to gh-pages on master
│   ├── yaml-lint.yaml             yamllint (rules in .yamllint.yaml)
│   └── actions-lint.yaml          actionlint
├── docs/
│   ├── product/
│   │   ├── PRD.md, ROADMAP.md
│   │   ├── architecture/overview.md
│   │   └── features/              web-cv.md, pdf-cv.md
│   └── process/
│       ├── decisions/             ADRs (append-only)
│       ├── specs/                 superpowers brainstorming output; reviews
│       └── plans/                 superpowers writing-plans output (create on demand)
├── ops/update-cv.md               runbook: edit → preview → publish
├── src/
│   ├── cv-site/                   web CV: data.yaml, template.hbs, css/, render.js, deploy/
│   └── cv-pdf/                    printable CV: resume.html (hand-edited) → resume.pdf
└── dist/                          build output (git-ignored, published)
```

`.claude/` (skills, commands), `docs/product/guide/` and `src/tools/` are not created yet. Add them when there is real content.

## Conventions

- **Content edits go in `src/cv-site/data.yaml`**, not in the template. The PDF CV
  (`src/cv-pdf/resume.html`) is still a separate copy, so mirror content changes there (see roadmap).
- Published URLs must stay stable: `/`, `/css/style.css`, `/resume.pdf`, `/resume.html`.
- Tests are colocated next to the code (`src/<component>/*.test.js`), never in a top-level `tests/`.
- Filenames `kebab-case`; ADRs `NNNN-short-title.md`, never edited after publishing (supersede instead).
- `ops/` stays flat until a second category of doc appears; then use `runbooks/`, `playbooks/`, … subfolders.
- Known issues and the prioritized backlog: `docs/product/ROADMAP.md` → `docs/process/specs/2026-11-21-code-optimization-review.md`.
