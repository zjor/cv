# Roadmap

**PERMANENT.** Ordered intent: where the product is going and why. Details and evidence for each
item are in the [2026-11-21 optimization review](../process/specs/2026-11-21-code-optimization-review.md) (numbers = item ids).

## Done

- Deploys keep the custom domain: `cname:` in the workflow (#1)
- CI actions bumped off the deprecated v3 runners; PR build check; YAML and Actions lint with badges (part of #8)

## Now

- Fix `<head>`: viewport, `lang`, OG tags, empty description (#3, #4)
- Remove dead Universal Analytics tag (#5)
- Modernise CI: Node 22, `npm ci`; bump handlebars/js-yaml (#7, #8)
- Enforce HTTPS on Pages (#9)

## Next

- Single source of truth: render the PDF CV from `data.yaml`, generate the PDF in CI with headless
  Chromium, drop `html-pdf`/`phantomjs` and the committed `resume.pdf` (#2, #7)
- Strict template rendering plus a colocated smoke test (#6, #15)

## Later

- Data and template hygiene: merge `certifications`/`badges`, move hard-coded content to YAML,
  render or drop `technologies` (#11, #12)
- `render.js`, CSS and `package.json` cleanups (#10, #13, #14)
