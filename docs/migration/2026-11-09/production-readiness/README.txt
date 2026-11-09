CHICKZEN — PRODUCTION PREPARATION
9 November 2026

STATUS: PRODUCTION ACTIVATED; HTTPS COMPLETION STILL REQUIRED BEFORE CUTOVER

Public review: https://chickzen-preview.vercel.app
Production source: bb4e997, branch codex/chickzen-vercel-migration.
Preview: dpl_ABqSgiAPDK5K1CVPizMwSTLs89XM, READY.
Production: dpl_631dPHdGE5icWbyUht9xSYuTYWL3, READY.
Production build: chickzen-46bj9blb2-emilio-castellanos-projects.vercel.app.
Vercel project prj_4dtRYBrYg4BD0313JA1SJZOUu4pr, team emilio-castellanos-projects.

The production build succeeded with lint, TypeScript and 33 prerendered routes.
The stable preview is public without authentication. Other generated deployment
addresses retain protection. Both custom domains are attached and verified in
Vercel; www is configured to redirect to chickzen.com with HTTP 308.
Public DNS still sends traffic to Netlify. Neither its app nor traffic DNS changed.

ACTIVATION STATE
Production SITE_LAUNCHED=true and EMAIL_DELIVERY_ENABLED=true, explicitly approved
by Emilio and deployed. CHECKOUT_ENABLED=false. ANALYTICS_ENABLED=false is now
explicitly configured in Production.
NEXT_PUBLIC_GTM_ID=GTM-WDHMFN7J; GA4 remains G-6PCNC6QKXE.
The approved sensitive Resend variables now target Preview and Production.
Sender: chickzen <notifications@aliigo.com>; recipient: hello@chickzen.com.
Visitor email is Reply-To. No secret values are recorded in these documents.
Preview and Production email are enabled. No human-recipient test email was sent.

Code now separates public indexing from analytics activation. Loading GTM and
reporting API analytics eligibility both require ANALYTICS_ENABLED=true as well
as the existing production, host and consent checks. No pre-consent/off-state
events are replayed. The 15 migration/API and 7 analytics tests passed; providers
were mocked. Earlier full-route and real Google-script QA remains in analytics-stage.

CONTACT PROTECTION
Vercel's durable firewall rule is published and active for POST /api/contact.
It allows five requests per minute per source IP within each Vercel region.
An invalid-payload-only check returned 400 five times, then 429; no email was sent.
The form now handles HTML or JSON rate-limit responses, keeps the visitor's input
and retry ID, and displays a clear wait/retry message with an email alternative.
The final preview passed the mocked 429/retry browser test on mobile.
Evidence: firewall-validation.json and rate-limit-ui-validation.json.

SITEMAP AND LLMS.TXT
Production robots.txt now permits public crawling and advertises the sitemap.
All 23 sitemap entries, including 11 journal articles, returned HTTP 200 with
index/follow metadata and matching canonical URLs on the protected deployment.
Transaction confirmation and disabled checkout remain noindex and outside sitemap.
public/llms.txt provides a concise description of Jen's consulting and 11 links
to public resources. The layout advertises it using rel=describedby. Its response
is text/plain; charset=utf-8. Source follows https://llmstxt.org/ format.
Sitemap and llms.txt publication is complete on Vercel; the old Netlify site still
serves the public domain until DNS changes. Search Console submission, if needed,
should follow cutover so its fetch reaches the new sitemap.
Evidence: discovery-validation.json and enabled-validation.json.

HTTPS VALIDATION — WWW PREPARATION CHANGE PENDING
The following TXT records were requested in Cloudflare, with TTL Auto:
  _acme-challenge
  h756rsRylJhj3aUNmL8DlndIThkIIvymFe2SUR31pzA
  _acme-challenge.www
  J-QZjk5ht79BCQ3pZxT-VSp2Zt0cTILvPDBa7WEqVmk
Both records are visible and match. They validate certificates without moving
traffic. Certificate issuance returned pretest_conflicting_caa_record_error:
www still points to Netlify, whose inherited CAA records authorize Amazon and
DigiCert rather than Let's Encrypt. Do not add a CAA alongside a CNAME.

Emilio was asked to change only CNAME www to chickzen.com, DNS only, TTL Auto,
while retaining the current apex A records and the two TXT records. This keeps
www on Netlify via the apex and removes the inherited netlify.app CAA restriction.
Both current apex IPs were tested with www's real hostname: HTTPS verified and
HTTP 301 returned. After this preparation change propagates, finalize the existing
certificate order and test both real hosts directly against Vercel with verified TLS.
Actual custom-domain HTTPS verification is still pending; protected deployment
browser checks are not a substitute for that check.

ACTIVATION APPROVAL — COMPLETED
Earlier automatic approval review required explicit approval for pre-cutover
indexing and email. Emilio then explicitly approved both and requested sitemap
publication and llms.txt. The approval requirement is resolved; the flags were
changed successfully and the new production build passed browser and discovery
checks. No further activation permission is needed for this approved scope.

TRAFFIC DNS — DO NOT CHANGE YET
Vercel's current domain-config API ranks these targets first:
  A @ 216.150.1.1
  A @ 216.150.16.1
  CNAME www 29bc08226de3d2dc.vercel-dns-016.com
It still lists 76.76.21.21 and cname.vercel-dns.com as accepted second-ranked
targets; the installed older CLI recommends 76.76.21.21. Re-read project domain
recommendations at the actual cutover and give Emilio one consistent record set.
Use DNS-only records in Cloudflare. Preserve Cloudflare nameservers, MX and email
TXT records. Current rollback records are captured in domain-preparation.json.

REMAINING SEQUENCE
1. Confirm the www CNAME preparation change and issue/verify the domain certificate.
2. Verify actual-host HTTPS, indexing, redirects, sitemap and llms.txt. The enabled
   form already passed browser QA; analytics and checkout remain off.
3. Tell Emilio the site is ready and provide fresh traffic DNS records.
4. After Emilio changes DNS, verify the live host and coordinate analytics with
   its existing owner. Keep the old Netlify deployment available for rollback.

ANALYTICS HANDOFF
The owner restored live Netlify Enhanced Measurement at 2026-11-09T16:55:04.545Z.
Do not disable it while waiting for DNS. Once the new host is confirmed, coordinate
its permanent removal with the new manual-tracking deployment. Retain the same
GA4 property and published GTM version 3. A short documented measurement gap is
preferable to duplicate pageviews during the transition. No real Google events,
human-recipient emails or payments were generated by these checks.

References:
https://vercel.com/docs/domains/pre-generating-ssl-certs
https://vercel.com/docs/domains/working-with-dns
