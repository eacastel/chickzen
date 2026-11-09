CHICKZEN — LIVE PRODUCTION
9 November 2026

STATUS: DNS CUTOVER COMPLETE; LIVE HTTPS VERIFIED

Live site: https://chickzen.com
Public review: https://chickzen-preview.vercel.app
Application source: bb4e997, branch codex/chickzen-vercel-migration.
Production: dpl_631dPHdGE5icWbyUht9xSYuTYWL3, READY.
Preview: dpl_ABqSgiAPDK5K1CVPizMwSTLs89XM, READY.
Project: chickzen (prj_4dtRYBrYg4BD0313JA1SJZOUu4pr).
Team: emilio-castellanos-projects.

DNS AND HTTPS
Emilio applied the final Cloudflare traffic records:
  A @ 76.76.21.21
  CNAME www cname.vercel-dns.com
Records are DNS only, TTL Auto. The old Netlify apex A records were replaced.
Both targets were verified as accepted by Vercel before cutover. Vercel now
reports both domains correctly configured, with no conflicts. Email MX/TXT and
Cloudflare nameservers were not changed by the agent. Retain Netlify for rollback;
its former traffic records are preserved in domain-preparation.json.

A pre-cutover certificate request was blocked by CAA inherited through the old
Netlify www CNAME. Emilio added the certificate TXT records, prepared www to point
to the apex, then explicitly approved moving traffic before certificate issuance.
The certificate was issued at 2026-11-09T21:33:23.714Z with autoRenew=true and
covers chickzen.com and www.chickzen.com. Public HTTPS now returns 200 at the apex;
www redirects with HTTP 308 and preserves the requested path. TLS verification
was enabled throughout the successful checks; no certificate error was ignored.
DNS caches can continue to update independently after these observations.

ACTIVATION STATE
Production SITE_LAUNCHED=true and EMAIL_DELIVERY_ENABLED=true were explicitly
approved and deployed. ANALYTICS_ENABLED=false and CHECKOUT_ENABLED=false.
Preview remains noindex and analytics-disabled. The public review alias works
without login; protection remains on other generated deployment addresses.

The approved Resend key is configured for Preview and Production. Sender is
chickzen <notifications@aliigo.com>; recipient is hello@chickzen.com; Reply-To is
the visitor. Provider delivery was previously tested against Resend's simulated
inbox. The live enabled form passed browser checks; no human-recipient test
inquiry was sent. MailerLite signup and payments remain disabled.

CONTACT PROTECTION
The published Vercel firewall rule allows five POST /api/contact requests per
minute per source IP within each Vercel region. Invalid-payload verification
returned five 400 responses and then 429 without sending email. The form handles
JSON or HTML 429 responses, retains input and retry ID, and gives a clear message.
See firewall-validation.json and rate-limit-ui-validation.json.

INDEXING, SITEMAP AND LLMS.TXT
Production pages are indexable and have canonical chickzen.com URLs. robots.txt
allows crawling and advertises https://chickzen.com/sitemap.xml. The sitemap has
23 URLs, including 11 journal articles. Confirmation and disabled checkout stay
noindex and are excluded. All sitemap URLs passed canonical/indexing checks.
https://chickzen.com/llms.txt is public text/plain with a concise description of
Jen's consulting and 11 resource links; HTML advertises it via rel=describedby.
Existing legacy paths retain eight verified permanent redirects. Unknown paths
remain real 404s. Publication permits discovery; it does not guarantee indexing.
Search Console sitemap submission can now use the live XML in the analytics phase.

VALIDATION
Cloud build, lint, TypeScript and 33 prerendered routes passed.
15 migration/API tests and seven analytics tests passed with providers mocked.
The real custom-host browser check passed nine routes at four widths (1440,
768, 390, 320), enabled form UI, correct indexing exceptions, www redirect,
sitemap and llms.txt. Public DNS checks independently confirmed HTTPS and files.
No Google requests or dataLayer were created, including after accepting consent.
No real email or payment was sent during cutover checks.
Evidence: certificate.json, custom-host-validation.json,
public-cutover-validation.json, discovery-validation.json, enabled-validation.json,
approved-cutover-dns.json and deployments.json.

ANALYTICS NEXT PHASE
Existing GA4 G-6PCNC6QKXE and dedicated GTM-WDHMFN7J are preserved. The analytics
owner has the successful live-host handoff. Production collection is still off;
old Enhanced Measurement was not changed during this release. Coordinate the
manual-tracking build with the owner's saved/readback Enhanced Measurement-off
change before enabling ANALYTICS_ENABLED. Verify a genuine consented receipt
separately; automated QA did not create live events. Checkout is a separate phase.

References:
https://vercel.com/docs/domains/pre-generating-ssl-certs
https://llmstxt.org/
