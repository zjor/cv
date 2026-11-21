# Web CV

**PERMANENT.** A visitor opens `https://cv.zubrik.me` and sees a one-page CV: name and current
position, contact links (LinkedIn, GitHub, GitLab, email, website), profile, skills, experience,
education, Credly certification badges and interests. A **Download (pdf)** button in the top bar
opens the PDF CV.

- Responsive layout with a print stylesheet (`@media print`) that hides the nav bar and interests.
- Content comes from `src/cv-site/data.yaml`; markup from `src/cv-site/template.hbs`.
- Published automatically on every push to `master`.
