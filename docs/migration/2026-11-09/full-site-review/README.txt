CHICKZEN — COMPLETE EDITORIAL NEXT.JS PREVIEW
9 November 2026

Application commit: 7e8e0e1
Branch: codex/chickzen-vercel-migration
Repository: https://github.com/eacastel/chickzen
Vercel project: chickzen / emilio-castellanos-projects
Deployment: dpl_JBM9zD7r4RAUiHYE8oCabwUSzZvq
URL: https://chickzen-9f7e43bq3-emilio-castellanos-projects.vercel.app
Use the separate seven-day review link from the conversation to bypass Vercel
login for this deployment. The access token is intentionally not in this file.

WHAT CHANGED
- All 12 published Contentful recommendations appear below the homepage hero.
  The displayed five-star ratings come from their CMS records. Quotes and names
  are preserved; only stray surrounding quotation marks were normalized.
- Reviews loop in both directions with swipe, arrow buttons and keyboard control.
  The slideshow advances every eight seconds while visible, pauses on hover or
  interaction, has a pause control, and respects reduced-motion preferences.
  Its height fits the visible quotes. About also contains a static reading grid.
- About, four service categories, 13 published services, all 11 journal articles,
  contact, policies and the existing checkout use the same restrained editorial
  styling. Service inquiries carry the chosen service into the message field.
- Email and muted WhatsApp links are visible in the shared header and footer,
  with additional links in the contact section. The existing Spain number is used.
- The empty Strawberry Lemonade destination now supports a direct guide request
  by email. Automated MailerLite signup/guide fulfilment still needs configuration.
- /journal redirects to /blog and /home redirects to /. Existing article URLs stay.

RESEND
The user authorized reuse of Aliigo's Resend setup. The correct key was obtained
from the Aliigo Vercel project and stored as a sensitive variable in Chickzen's
Preview environment, without exposing it in source or documents.
  Sender: chickzen <notifications@aliigo.com>
  Recipient: hello@chickzen.com
  Reply-To: the person submitting the form
Resend accepted a simulated-delivery test; the real application delivery function
also passed against that provider test inbox. No test email was sent to Jen or
another person. Browser success/failure/retry checks use intercepted responses.

VALIDATION
The successful cloud build runs Next.js 16.4.5 on Node 22 with lint and TypeScript.
The existing 12 server integration tests passed. See browser-validation.json for
published layout/route, carousel, reduced-motion and form behavior results.
Screenshots: desktop.png, mobile.png, about.png, about-opening.png, services.png,
journal-article.png. image-validation.json confirms the portrait and all 18 client
logos load. The opening screenshot verifies the portrait at its actual size.
The browser script is check-preview.mjs. It never submits a real positive inquiry
to Jen: the real endpoint is checked with an invalid payload; positive UI replies
are mocked. Actual server-to-provider delivery was checked separately using the
Resend simulated recipient.

RELEASE STATUS
Live chickzen.com remains on Netlify. This is an unindexed Vercel Preview with
production analytics and payment collection disabled. Review access is scoped to
this deployment; project SSO remains on. GitHub branch changes are pushed, but
Vercel GitHub app access is still needed for automatic Git deployments.

See ../README.txt for the remaining public cutover, MailerLite and payment work.
