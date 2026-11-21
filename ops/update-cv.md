# Runbook: update and publish the CV

**RECURRING.** Run whenever the CV content changes (new role, certification, etc.).

1. `npm ci` (first time only, or after dependency changes).
2. Terminal A: `npm run watch` re-renders `dist/` on every save under `src/cv-site/`.
3. Terminal B: `npm run serve`, then open <http://localhost:8000>.
4. Edit the web CV content in `src/cv-site/data.yaml` (markup: `template.hbs`, styles: `css/style.css`).
5. Make the **same** content change in `src/cv-pdf/resume.html`. It is a separate copy.
6. Export the PDF: open <http://localhost:8000/resume.html> in Chrome → Print → *Save as PDF*
   → overwrite `src/cv-pdf/resume.pdf`.
7. For a new certification: add its Credly badge id under `badges:` (and `certifications:`) in
   `data.yaml`, and the name in `resume.html`.
8. Optional local checks: `yamllint --strict -c .yamllint.yaml .` and `actionlint`.
9. Commit and push to `master` (or open a PR first: it runs the build and lints without deploying).
   CI renders and publishes `dist/` to `gh-pages`, writing `CNAME` on each deploy.
10. Check <https://cv.zubrik.me> and the README badges.
