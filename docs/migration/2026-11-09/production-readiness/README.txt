CHICKZEN — LIVE PRODUCTION
9 November 2026

STATUS: DNS CUTOVER COMPLETE; LIVE HTTPS VERIFIED

Live site: https://chickzen.com
Public review: https://chickzen-preview.vercel.app
Application source: bb4e997, branch codex/chickzen-vercel-migration.
Production: dpl_2t4iy5feGKcbDBjdmMJrLBSnuc6U, READY, promoted from commit b539b67.
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
approved and deployed. ANALYTICS_ENABLED=true is now deployed and persisted in
the Production project default. CHECKOUT_ENABLED=false.
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
The initial cutover checks confirmed analytics OFF even after accepting consent.
The later activation check verified consent-controlled pageview dispatch with
Google scripts stubbed and every collector blocked.
No real email or payment was sent during cutover checks.
Evidence: certificate.json, custom-host-validation.json,
public-cutover-validation.json, discovery-validation.json, enabled-validation.json,
approved-cutover-dns.json and deployments.json.

ANALYTICS ACTIVATED
Existing GA4 G-6PCNC6QKXE and dedicated GTM-WDHMFN7J version 3 are preserved.
The analytics owner saved/read back all eight Enhanced Measurement switches OFF
at 2026-11-09T21:43:55.020Z. We then persisted the Production analytics default ON
at 21:44:36.043Z and promoted the prevalidated candidate, confirmed by 21:44:59Z.
No event/schema changes were made. Preview remains excluded. The brief measurement
transition gap is documented by those times; the website stayed available.

Candidate QA used the actual build at a simulated production browser origin with
Google stubbed and all inquiry/provider requests intercepted. Consent, service
and accepted-inquiry events passed; no form details leaked into event payloads.
The existing API ON/OFF/preview tests passed with provider calls mocked. Live
consent/pageview dispatch then passed at 21:45:00.553Z, also without real events.
The analytics owner verified the actual published Google tags on desktop/mobile:
16 checks and eight intercepted wire events passed at 2026-11-09T21:48:50.103Z.
Both contact POSTs were mocked; no real email/payment or GA4 test event was sent.
Consent/rejection/withdrawal, single navigation views, campaign attribution,
service context, inquiry acknowledgment, privacy and mobile controls all passed.
See live-google-tag-validation.json for the summary and original evidence path.
Genuine consented receipt in GA4 is a separate follow-up; no artificial inquiry
or analytics event was sent. Search Console submission is handled by that owner;
site publication must not be described as proof of Google indexing.
Search Console indexed-version baseline: 9 indexed, 10 unknown and 4 crawled but
not indexed. Recorded crawl dates predate the redesign, so this is not evidence
of a migration loss or fresh indexing. See GOOGLE-INDEX-BASELINE.csv.
See analytics-activation.json, analytics-candidate-validation.json,
live-analytics-validation.json and promoted-aliases.json.

References:
https://vercel.com/docs/domains/pre-generating-ssl-certs
https://llmstxt.org/
