CHICKZEN PROJECT DOCUMENTS

Project root:
/home/eacastel/Avanti/webdev/chickzen

NEXT.JS / VERCEL MIGRATION

Stable public review: https://chickzen-preview.vercel.app
No login or expiring share link is required.

docs/migration/2026-11-09/production-readiness/README.txt
  Current launch preparation, production deployment, contact rate limiting,
  successful live HTTPS/DNS verification and analytics follow-up. Earlier review
  folders are historical snapshots.

docs/migration/2026-11-09/analytics-stage/README.txt
  Current preview: consent controls, staged GTM events, restored legacy URLs,
  correct confirmation/404 canonicals and checkout sitemap exclusion.
  Historical analytics staging; see production-readiness for the live cutover.

docs/migration/2026-11-09/header-refinement/README.txt
  Header refinement: solid header while scrolling and logo navigation to homepage top.

docs/migration/2026-11-09/full-site-review/README.txt
  Latest review: all 12 CMS recommendations in a looping carousel, editorial
  inner pages and journal, visible email/WhatsApp, and enabled Resend inquiries.
  Desktop/mobile screenshots and browser verification are in the same folder.

docs/migration/2026-11-09/README.txt
  Working Next.js implementation, Vercel project, email setup and cutover steps.
  Source branch: codex/chickzen-vercel-migration in the existing repository.

docs/migration/2026-11-09/VALIDATION.txt
  Successful cloud build, browser checks, tests and remaining account setup.
  Screenshots and browser-validation.json are alongside this file.

ANALYTICS

docs/analytics/CLIENT-ANALYTICS.txt
  Client analytics reference.

docs/analytics/2026-11-08-lifetime-report/REPORT.txt
  Traffic history, findings and measurement limitations.

docs/analytics/2026-11-08-lifetime-report/chickzen-report-2026-11-08.pdf
  Shareable analytics report.

docs/analytics/2026-11-08-lifetime-report/WEBSITE-AGENT-HANDOFF.txt
  Technical findings and recommended fixes.

REDESIGN AND FUNNEL STRATEGY

docs/redesign/2026-11-09-social-proof-review/prominence/REVIEW.txt
  Latest refinement: testimonials immediately below the hero, a clearer
  heading and decorative star. Includes desktop/mobile review evidence.

docs/redesign/2026-11-09-social-proof-review/REVIEW.txt
  Earlier placement beside the services and simplified section numbering.

docs/redesign/2026-11-09-portrait-review/REVIEW.txt
  Approved studio headshot, local comparisons, and published desktop/mobile
  screenshots. The shared preview was updated on 9 November 2026.

docs/redesign/2026-11-08/REVIEW.txt
  Start here for the design review and preview status.

docs/redesign/2026-11-08/STRATEGY.txt
  Design direction, offer architecture, funnel and priorities.

docs/redesign/2026-11-08/index.html
  Clickable homepage concept. Open with its assets folder alongside it.

docs/redesign/2026-11-08/desktop.png
docs/redesign/2026-11-08/mobile.png
  Full-page design screenshots; *-opening.png files show the first screen.

docs/redesign/2026-11-08/exports/chickzen-redesign-review.zip
  Portable review package with the concept, assets, screenshots and strategy.

docs/redesign/2026-11-08/audit/
  Original live-site screenshots, captured page data and audit scripts.

docs/redesign/2026-11-08/deployment/
  Preview payload, hosting metadata and deployment record. No API credentials.

The older Netlify preview remains the standalone homepage concept. The new
Vercel review deployment is the working Next.js application with its journal
integrated. Inquiry delivery now uses Aliigo's verified Resend sender and key.
The live chickzen.com site now runs on Vercel with HTTPS, indexing, sitemap and
llms.txt verified. Production analytics remains off for its coordinated activation.

The existing analytics documents remain in their original folder. The design
deliverables and live-site evidence have been consolidated into this checkout.
Git's registered isolated worktree remains in its managed storage location.
Temporary browser profiles and caches are not project documents.
