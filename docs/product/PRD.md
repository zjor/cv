# Product Requirements

**PERMANENT.** Product-level what & why.

## Problem

A CV has to exist in two forms, a shareable web page and a downloadable PDF, and both must stay
current and consistent while the content changes a few times a year.

## Users

- **Readers:** recruiters and hiring managers who open `cv.zubrik.me` or the PDF.
- **Owner:** Roman, who edits the content and publishes it.

## Requirements

- Web CV, rendered from structured data and published automatically on push to `master` → [features/web-cv.md](features/web-cv.md)
- Downloadable PDF CV linked from the web page → [features/pdf-cv.md](features/pdf-cv.md)
- Verifiable certifications shown as Credly badges (part of the web CV).
- Editing content must not require touching markup.

## Non-goals

- No CMS, backend or user accounts.
- No multi-language versions.
