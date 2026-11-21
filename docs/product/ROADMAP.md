# Roadmap

**PERMANENT.** Ordered intent: where the product is going and why. Details and evidence for each
item are in the [2026-11-21 optimization review](../process/specs/2026-11-21-code-optimization-review.md) (numbers = item ids).

## Done

- Deploys keep the custom domain: `cname:` in the workflow (#1)
- CI actions bumped off the deprecated v3 runners; PR build check; YAML and Actions lint with badges (part of #8)
- CI on Node 26 LTS via `.nvmrc`, `npm ci` (#8)
- Dropped `html-pdf`/`phantomjs-prebuilt` and `npm run pdf`; lockfile regenerated (part of #7)
- handlebars 4.7.10, js-yaml 3.15.2 via `npm audit fix`: 0 known vulnerabilities (#7)
- PDF CV fits 2 A4 pages; Terraform Associate badge updated to 004
- `<head>`: viewport, `lang`, Open Graph `property=` tags, filled description (#3, #4)
- Removed the defunct Universal Analytics tag (#5)
- HTTPS: already enforced by Cloudflare in front of Pages (HTTP → 301 → HTTPS, valid `*.zubrik.me` cert). The GitHub "Enforce HTTPS" toggle cannot be used behind a proxy; no change needed (#9)

## Now

- Decide whether the Download (pdf) button should show on phones (hidden below 544px by `u-hidden@xs-down`)
- Strict template rendering plus a colocated smoke test (#6, #15)

## Next

- Single source of truth: render the PDF CV from `data.yaml`, generate the PDF in CI with headless
  Chromium, and stop committing `resume.pdf` (#2)

## Later

- Data and template hygiene: merge `certifications`/`badges`, move hard-coded content to YAML,
  render or drop `technologies` (#11, #12)
- `render.js`, CSS and `package.json` cleanups (#10, #13, #14)
