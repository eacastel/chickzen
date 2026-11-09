CHICKZEN — NEXT.JS / VERCEL MIGRATION PREPARATION
9 November 2026

Branch: codex/chickzen-vercel-migration
Repository: https://github.com/eacastel/chickzen
Working checkout: /home/eacastel/Avanti/worktrees/chickzen-editorial-strategy-20261108
Vercel team: emilio-castellanos-projects
Vercel project: chickzen (prj_4dtRYBrYg4BD0313JA1SJZOUu4pr)

IMPLEMENTATION
The approved editorial homepage now renders through Next.js React components.
The studio portrait, prominent testimonials and process-only numbering remain.
The shared header and footer connect to existing About, Journal and legal routes.
The homepage journal feature reads the newest published Contentful article;
/blog and existing /blog/:slug URLs stay within the application. /journal redirects
to /blog. No CMS entries or publishing workflows were changed. New homepage copy
is source-controlled; existing inner pages and journal stay CMS-managed.

Contact uses a real form and /api/contact endpoint. The existing Resend service
handles inquiry notifications; MailerLite handles optional, unchecked newsletter
opt-in only when its API key and group are configured. Inquiry delivery uses a
fixed recipient and verified sender, visitor email as Reply-To, input limits,
same-origin checking, a honeypot and a stable idempotency key for retries. Provider
failures are shown honestly. A newsletter failure does not discard the inquiry.
No real email was sent during preparation; automated provider tests are mocked.

MailerLite itself does not provide SMTP. MailerSend offers separate transactional
API/SMTP access, but an existing send-only Resend key is already configured locally.
The read-only Resend check confirmed send-only scope; it cannot list sending domains,
so the verified sender address and actual delivery still need confirmation.
https://www.mailerlite.com/help/does-mailerlite-offer-smtp-simple-mail-transfer-protocol
https://resend.com/docs/api-reference/emails/send-email
https://developers.mailerlite.com/api/subscribers

CHECKOUT AND HOSTING
Retained the existing service catalogue and Stripe checkout. Payment amounts are
now computed from cached CMS prices on the server; client amounts are not trusted.
/success is a real route and verifies the payment with Stripe before claiming success.
Vercel geolocation is supported with the existing Netlify header as a fallback.
Netlify configuration is retained for rollback. Contentful's hourly data cache stays.
Next.js 16.4.5 and React 19.3.1 are pinned in the package lock. Node 22 is
selected for Vercel. Existing production analytics are retained but disabled in preview.

PREVIEW CONFIGURATION
Contentful delivery credentials are installed in Preview and in the new project's
unlaunched Production environment for Vercel's mandatory first-deployment bootstrap.
Vercel labels the first deployment Production even when --target=preview is used.
This new project has no chickzen.com custom domain; all release flags remain off.
SITE_LAUNCHED=false, EMAIL_DELIVERY_ENABLED=false and CHECKOUT_ENABLED=false.
No mail/payment credentials are enabled on the preview. The form is visible but
submission is disabled until a verified sender is configured. Email remains available.
All preview pages have noindex headers and robots rules. The current chickzen.com
DNS, Netlify production deployment and static design review are unchanged.

RELEASE WORK STILL REQUIRED
1. Confirm the Resend verified sender for CONTACT_EMAIL_FROM, Jen's receiving inbox,
   and set the server-only Resend key. Authorize and verify an actual delivery test
   before enabling EMAIL_DELIVERY_ENABLED.
2. Connect Jen's MailerLite API key and intended group; verify double-opt-in settings
   for API signups and test with an authorized address. Subscriber status is not
   forced to active and existing unsubscribed contacts are not forcibly reactivated.
3. Configure Vercel Firewall rate limiting for POST /api/contact before public intake.
   The honeypot/origin checks are basic defenses, not a durable rate limiter.
4. Complete an end-to-end Stripe test with test credentials. Existing local Stripe
   settings are test-mode; confirm live keys and fulfilment before enabling checkout.
5. Copy reviewed environment values into Vercel production, retaining the existing
   analytics ID. Keep all keys server-only except Stripe's publishable key and GA ID.
6. Approve the working preview, then merge the migration branch and connect/configure
   Git deployments. A domain cutover has not been performed or scheduled.
7. At cutover, attach chickzen.com/www in Vercel, use the DNS records Vercel supplies,
   set SITE_LAUNCHED=true only for the production deployment, and verify canonical
   URLs, redirects, sitemap, inquiry delivery and payments. Keep Netlify available
   for rollback until those checks pass. Do not change MX/email records.

VALIDATION
Run npm run typecheck and npm run test:migration. The 12 focused tests cover invalid
and cross-origin inquiries, disabled delivery, provider failures, newsletter consent,
retry keys, CMS pricing, geography and preview indexing. Cloud build and browser
verification are recorded in VALIDATION.txt when complete.

Local dependencies were reused from the same Chickzen project to avoid duplicating
723 MB on Aurora. The deploy uses the lockfile's patched releases through npm ci.
Cloud build is authoritative for the pinned dependency versions and Node 22 runtime.
