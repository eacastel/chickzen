CHICKZEN — PRODUCTION PREPARATION
9 November 2026

STATUS: PREPARED, NOT YET CLEARED FOR TRAFFIC DNS CUTOVER

Public review: https://chickzen-preview.vercel.app
Source: 12302c5, branch codex/chickzen-vercel-migration.
Preview: dpl_CVD9dbVRijYsiHT4RDGz4mGherT5, READY.
Staged Production: dpl_5ednzGb5iFJxvQLsA2Mp6tNNsSyD, READY.
Production build: chickzen-iag4mqxth-emilio-castellanos-projects.vercel.app.
Vercel project prj_4dtRYBrYg4BD0313JA1SJZOUu4pr, team emilio-castellanos-projects.

The production build succeeded with lint, TypeScript and 33 prerendered routes.
The stable preview is public without authentication. Other generated deployment
addresses retain protection. Both custom domains are attached and verified in
Vercel; www is configured to redirect to chickzen.com with HTTP 308.
Public DNS still sends traffic to Netlify. Neither its app nor traffic DNS changed.

ACTIVATION STATE
Production SITE_LAUNCHED=false and EMAIL_DELIVERY_ENABLED=false.
CHECKOUT_ENABLED=false. ANALYTICS_ENABLED is absent and therefore false by design.
NEXT_PUBLIC_GTM_ID=GTM-WDHMFN7J; GA4 remains G-6PCNC6QKXE.
The approved sensitive Resend variables now target Preview and Production.
Sender: chickzen <notifications@aliigo.com>; recipient: hello@chickzen.com.
Visitor email is Reply-To. No secret values are recorded in these documents.
Preview email is enabled; Production email remains disabled until activation.

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

HTTPS VALIDATION — USER ACTION PENDING
The following TXT records were requested in Cloudflare, with TTL Auto:
  _acme-challenge
  h756rsRylJhj3aUNmL8DlndIThkIIvymFe2SUR31pzA
  _acme-challenge.www
  J-QZjk5ht79BCQ3pZxT-VSp2Zt0cTILvPDBa7WEqVmk
These records validate certificates and do not move traffic. They were not yet
visible in the latest DNS lookup. After they resolve, issue the certificate and
test both real hostnames directly against Vercel with full TLS verification.
Actual custom-domain HTTPS verification is still pending; protected deployment
browser checks are not a substitute for that check.

ACTIVATION APPROVAL — USER ACTION PENDING
Automatic approval review rejected enabling SITE_LAUNCHED and EMAIL_DELIVERY_ENABLED
before DNS cutover, stating that readiness authorization did not clearly authorize
pre-cutover public indexing and live email delivery. A successful inactive production
deployment and credential preparation were allowed and completed. A second request
to activate was also rejected. Do not retry activation without explicit user approval.
The concrete proposed action is to enable those two Production flags, leave
analytics and checkout disabled, and deploy a fresh build with DNS unchanged.

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
1. Confirm TXT records and issue/verify the domain certificate.
2. Obtain explicit activation approval, set the approved flags and redeploy.
3. Verify actual-host HTTPS, page/indexing behavior and enabled form UI using
   mocked submissions. Confirm analytics remains off and checkout remains off.
4. Tell Emilio the site is ready and provide fresh traffic DNS records.
5. After Emilio changes DNS, verify the live host and coordinate analytics with
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
