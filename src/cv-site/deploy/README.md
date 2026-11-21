# cv-site deploy

Deployed to GitHub Pages (`gh-pages` branch → `https://cv.zubrik.me`) by
[`.github/workflows/build.yaml`](../../../.github/workflows/build.yaml) on every push to `master`:
`npm ci` (Node from `.nvmrc`) → `npm run render` → publish `./dist` with `cname: cv.zubrik.me`. Pull requests run the
build only (deploy step is skipped).

The workflow file has to live in `.github/workflows/` (GitHub requirement), so this folder only
documents it. See [ADR 0001](../../../docs/process/decisions/0001-adopt-agentic-repo-seed-layout.md).
