# PDF CV

**PERMANENT.** A reader clicks **Download (pdf)** on the web CV (or opens `/resume.pdf` directly)
and gets a recruiter- and ATS-friendly CV: summary by area (AWS, Azure, DevOps, leadership,
languages, certifications) followed by employment history with responsibilities and key references.

- Source: `src/cv-pdf/resume.html` (standalone page, also served at `/resume.html`).
- The PDF is exported from that page and committed as `src/cv-pdf/resume.pdf`.
- Content is maintained separately from the web CV's `data.yaml`.
