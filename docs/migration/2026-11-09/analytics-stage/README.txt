CHICKZEN — STAGED ANALYTICS AND URL PRESERVATION
9 November 2026

PUBLIC REVIEW
https://chickzen-preview.vercel.app
Deployment dpl_8mbTjmvHTYo3FLCW8aT7oegk4CpL, READY.
Source commit ccc3de7, branch codex/chickzen-vercel-migration.
Immutable deployment: chickzen-fahmp8l98-emilio-castellanos-projects.vercel.app.
The public review alias remains the same. Other deployment URLs retain protection.
No production deploy, production-domain attachment, DNS or Netlify app change.

MEASUREMENT
Dedicated GTM-WDHMFN7J; existing GA4 G-6PCNC6QKXE remains the destination.
Container ID set as NEXT_PUBLIC_GTM_ID in Preview and Production. Production
SITE_LAUNCHED is explicitly false; no production deployment was performed.
Runtime requires SITE_LAUNCHED=true,
VERCEL_ENV=production, exact HTTPS chickzen.com/www.chickzen.com and acceptance.
Preview creates no dataLayer or Google requests, including after acceptance.
Direct gtag replaced only in the migration branch, never in the live main checkout.
One manual pathname-based pageview owner. Query/hash-only changes do not count.
Static titles and safe paths; unknown paths map to /404. Confirmation is /success.
Public UTM slugs use explicit campaign_* fields. Query/hash are cleaned only after
hydration and before Google loads, after server payment verification/form prefill.
Only allowed campaign values survive legacy redirects; sensitive fields do not.

Equal Accept/Reject controls use the existing palette. Choice lasts 180 days;
small accessible settings control reopens choices. Withdrawal disables GA,
clears GA cookies and internal analytics session state, and reloads to unload tags.
No events replayed from before acceptance. Ads consent remains denied.

Delegated link owner records one service/contact/guide intent event per click.
All 13 service IDs come from the existing public service slugs. Service CTAs do
not additionally emit contact events. Inquiry requires API202, accepted:true,
analyticsEligible:true and actual provider acknowledgment. Captured source page
survives async submission; retries dedupe internally. No form values or submission
IDs are sent to Google. An accepted inquiry is not a qualified client or a sale.
GA4 once-per-session key-event counting is configured by the analytics owner;
client-side event dedup concerns repeated submissions only. Payments stay disabled.

SEO
Permanent explicit legacy aliases: /origin-story -> /about;
/good-vibes -> /about#recommendations; /lets-begin -> /contact; /shop -> /services;
/home -> /; /journal -> /blog; known /journal/:slug -> matching /blog/:slug;
/services/checkout -> /services/lets-begin. Unknown/cart paths remain real404s.
Next.js16 proxy owns redirects so private queries are not forwarded.
All11blogslugs and all 24 existing content routes remain accessible.
Disabled checkout now has an H1 and a useful contact invitation, noindex metadata,
and is excluded from sitemap while disabled. Current sitemap therefore has 23 URLs.
/success has its own canonical and noindex;404s have no canonical and noindex.
Public launch indexing remains gated; host guard protects deployment hostnames.

VALIDATION
Cloud Next.js16.4.5 build, lint and type checks pass.
7 analytics policy tests and 14 migration/API tests pass; providers mocked.
Actual-module fixture with stubbed Google script:5 initial/SPA/back/forward views,
13 services,4 contact methods,guide intent,inquiry negative/duplicate scenarios,
withdrawal,4 excluded host/scheme cases and generic404. No real collections.
Deployed preview:4 widths(1440/768/390/320),28 route checks,8 redirect checks,
23 sitemap entries,no overflow,working choice persistence/reopening,service-prefill
preserved,duplicate-submit suppression and stable retry key. Google requests 0;
browser errors 0. All contact POSTs mocked; no real emails/payments submitted.
Screenshots were visually reviewed at desktop and mobile sizes.

ACTUAL GOOGLE SCRIPT QA
Published GTM version 3 passed the real-script review: 36 recorded checks,
26 intercepted events, all13 services retaining details/source page, four contact
methods, guide intent, accepted-inquiry validation and dedup, navigation pageviews,
safe campaigns/URLs, consent withdrawal and excluded hosts. No real Google event,
email or payment was delivered. See actual-google-tag-validation.json.

The first real-script check exposed asynchronous per-event Google-tag setup that
lost service context. Analytics corrected the container to initialize Google once
on the consented load, then resolve event fields from their own trigger context.
App source remained ccc3de7; the full regression passed after that correction.
Original live Enhanced Measurement settings were restored and read back at
2026-11-09T16:55:04.545Z. Temporary configuration windows are recorded in the
analytics owner's evidence, with restoration confirmed after each attempt.

Actual receipt in GA4 remains a separate post-launch check using genuine consented
traffic. Coordinate the permanent Enhanced Measurement/manual pageview switch
with the authorized production release. Production deployment/domain attachment
and DNS remain pending. A working preview is not a production cutover.

MAINTENANCE
Static src/lib/analytics/catalog.json is deliberately a safe allowlist. Add new
published CMS pages/articles/service slugs when shipping their tracking support;
unknown paths stay generic and unknown service IDs do not emit service events.
Contract: /home/eacastel/Avanti/clients/analytics/2026-11-09-chickzen-gtm/CONTRACT.txt
URL history/map: same directory, URL-PRESERVATION-MAP.csv.
Local fixture uses scripts/analytics-fixture.cjs and never forwards provider calls.
