CHICKZEN — NEXT.JS / VERCEL MIGRATION
9 November 2026 — working migration and launch preparation

Stable public review address: https://chickzen-preview.vercel.app
See STABLE-PREVIEW.txt for access and updating this same address.

Current launch status: production-readiness/README.txt.
Earlier visual refinement: header-refinement/README.txt (opaque header and logo).

Repository: https://github.com/eacastel/chickzen
Branch: codex/chickzen-vercel-migration
Implementation: /home/eacastel/Avanti/worktrees/chickzen-editorial-strategy-20261108
Canonical project documents: /home/eacastel/Avanti/webdev/chickzen/docs
Vercel team: emilio-castellanos-projects
Vercel project: chickzen (prj_4dtRYBrYg4BD0313JA1SJZOUu4pr)

CURRENT REVIEW
See production-readiness/README.txt for the latest deployment and launch status.
See full-site-review/README.txt, browser-validation.json and screenshots for the
visual integration review. Images beside this README are the initial
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

The public review is a Preview deployment. SITE_LAUNCHED=false and
CHECKOUT_ENABLED=false. Analytics are not loaded and preview indexing is disabled.
Project SSO stays enabled; public review access is allowed for the stable
chickzen-preview.vercel.app alias with explicit approval. A separate production
build is staged with public indexing and email delivery still disabled. The
custom domains are attached; live traffic DNS and the Netlify app are unchanged.

Vercel Git integration is still pending GitHub app access to eacastel/chickzen.
The branch is pushed successfully; CLI deployments work in the correct Vercel
project. After access is granted, connect this project rather than creating one.

BEFORE PUBLIC CUTOVER
- Add the two requested certificate-validation TXT records; leave traffic DNS as-is.
- Obtain the required explicit activation approval after automatic approval review
  rejected enabling production indexing and email ahead of the DNS move.
- Issue and verify HTTPS, enable the approved production flags, redeploy and verify.
- Give Emilio the green light and current Vercel DNS values; he changes traffic DNS.
- Keep analytics disabled until the new host is confirmed, then coordinate the
  existing GA4/GTM measurement transition with the analytics owner.
- Retain Netlify for rollback. Preserve email MX, TXT and Cloudflare nameservers.

Production Resend credentials are prepared. Durable Vercel contact rate limiting
is active and verified. Newsletter and checkout remain disabled; configuring them
is separate from launching the consulting site. No human received an automated
test inquiry. Real inbox receipt can be checked with Jen's first genuine inquiry
or an explicitly authorized test.

References:
https://resend.com/docs/dashboard/emails/send-test-emails
https://resend.com/docs/knowledge-base/how-do-I-create-an-email-address-or-sender-in-resend
https://www.mailerlite.com/help/does-mailerlite-offer-smtp-simple-mail-transfer-protocol
