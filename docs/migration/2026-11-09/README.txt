CHICKZEN — NEXT.JS / VERCEL MIGRATION
9 November 2026 — current full-site review

Stable review address: https://chickzen-preview.vercel.app
See STABLE-PREVIEW.txt for access and updating this same address.

Latest preview refinement: header-refinement/README.txt (opaque header and logo).

Repository: https://github.com/eacastel/chickzen
Branch: codex/chickzen-vercel-migration
Implementation: /home/eacastel/Avanti/worktrees/chickzen-editorial-strategy-20261108
Canonical project documents: /home/eacastel/Avanti/webdev/chickzen/docs
Vercel team: emilio-castellanos-projects
Vercel project: chickzen (prj_4dtRYBrYg4BD0313JA1SJZOUu4pr)

CURRENT REVIEW
See full-site-review/README.txt, browser-validation.json and screenshots for the
latest deployment and verification. Images beside this README are the initial
migration baseline, before the complete editorial integration.

The approved homepage, portrait, restrained palette and earlier CTA placement
remain. All 12 published Contentful recommendations now appear directly below
the hero in an infinite carousel with actual CMS star ratings, swipe, keyboard,
previous/next and pause controls. Reduced motion disables automatic playback.
The About page also offers the complete recommendations as a static reading grid.

About, services, journal articles, policies, contact and the retained checkout
share the editorial design. All 11 journal articles remain inside Next.js. The
service catalogue contains 13 resolved published products in four categories.
An unresolved CMS service reference is omitted rather than fabricated. The
previously empty Strawberry Lemonade destination now offers a direct email
request for the guide; no automatic download or newsletter delivery is claimed.
CMS publishing workflows and original content remain intact. The new homepage
copy is source-controlled. Contentful data remains cached for one hour.

EMAIL AND CONTACT
Visible email and WhatsApp links appear in the header, footer and contact panel.
WhatsApp uses the site's existing Spain number, +34 606 989 881, in muted colors.

At Emilio's request, the existing Aliigo Vercel Resend key is reused. The older
local Chickzen key could not send from either chickzen.com or aliigo.com; the
correct Aliigo project key successfully sent to Resend's simulated delivery
inbox. The actual Chickzen server delivery function was also verified against
that simulated inbox. No human recipient received an automated test message.

Chickzen Preview environment:
  RESEND_API_KEY: stored as a sensitive server-only variable (value not recorded)
  CONTACT_EMAIL_FROM=notifications@aliigo.com
  CONTACT_EMAIL_TO=hello@chickzen.com
  EMAIL_DELIVERY_ENABLED=true
The sender display name is chickzen; Reply-To is the visitor's email address.
Public contact links continue to use hello@chickzen.com. The form only reports
success after Resend acknowledges the request. Validation, same-origin checking,
a honeypot, timeouts and stable retry keys remain in place. Newsletter opt-in is
hidden until Jen's MailerLite key and group are configured. No mailing list is
silently created and visitors are not automatically subscribed.

HOSTING AND CUTOVER
Next.js 16.4.5, React 19.3.1 and Node 22 are configured. The lockfile/cloud build
are authoritative; task-local checks reuse this project's existing dependencies
to respect Aurora's storage reserve. No new dependency was needed for this work.

The new review is a Preview deployment. SITE_LAUNCHED=false and
CHECKOUT_ENABLED=false. Production analytics are not loaded and preview indexing
is disabled. Project SSO stays enabled; a separate seven-day deployment share
link is supplied privately and never committed. Live chickzen.com, its DNS and
Netlify production remain unchanged.

Vercel Git integration is still pending GitHub app access to eacastel/chickzen.
The branch is pushed successfully; CLI deployments work in the correct Vercel
project. After access is granted, connect this project rather than creating one.

BEFORE APPROVED PUBLIC CUTOVER
- Confirm real inquiry receipt with Jen using an explicitly authorized test.
- Configure durable rate limiting for POST /api/contact before public intake.
- If desired, connect MailerLite's intended group and verify opt-in/guide delivery.
- Validate Stripe test payment, fulfilment and live keys before enabling checkout.
- Copy the approved server settings into Production; retain the current GA ID.
- After design approval, attach chickzen.com/www using Vercel's DNS instructions,
  set SITE_LAUNCHED=true only in Production, and verify URLs, redirects, sitemap,
  inquiry delivery and payments. Retain Netlify for rollback. Preserve email MX.

References:
https://resend.com/docs/dashboard/emails/send-test-emails
https://resend.com/docs/knowledge-base/how-do-I-create-an-email-address-or-sender-in-resend
https://www.mailerlite.com/help/does-mailerlite-offer-smtp-simple-mail-transfer-protocol
