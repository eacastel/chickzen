CHICKZEN — HOMEPAGE EDITOR, CLIENT LOGOS AND PUBLISH REFRESH
18 November 2026

STATUS: DEPLOYED AND VERIFIED

Live: https://chickzen.com
Preview: https://chickzen-preview.vercel.app
Final application source: b1e37db (includes f20271a).
Production: dpl_4bjVnoXTsWQE6Rzan2MgdwKkyMn4
Preview: dpl_BCK2BNeHxAYmJDwUFbSDMxj3BdSu
Branch: codex/chickzen-vercel-migration

Jen’s instructions: JEN-EDITING-GUIDE.txt.

WHAT CHANGED
The existing Contentful Home entry now contains a "Homepage — current design"
field linking 19 named Homepage Blocks. The current homepage copy, editorial
line breaks, CTA labels/links and portrait were seeded into these blocks. The
existing page and other models were retained; the new block model and page
reference field are additive. The original Home Sections remain available.
Homepage metadata now reads Home’s Meta Title and Meta Summary. Sections use
the published block data, with the approved copy as fallback for unresolved
references. No arbitrary HTML is rendered from these new text fields.

The existing Our Clients entry now supplies the homepage carousel, after the
recommendations and before the experience strip. Its 18 existing assets remain
in their original order; Zoanne Clack and the original Beverly Hills 9/11
Memorial Garden logo are appended. Names come from asset titles. Touch, keyboard,
previous/next, autoplay and pause are supported. Motion stops for reduced-motion
preferences, pointer interaction, focus, hover, hidden tabs and offscreen views.

ASSET SOURCES
Zoanne’s existing mark: /home/eacastel/Avanti/clients/zoanneclack/app/icon.svg
The matching mark is used by her website; no replacement brand was invented.
Original memorial logo:
/home/eacastel/Avanti/clients/BH911/assets/brand/beverly-hills-911-memorial-logo.png
Jen’s existing approved portrait: public/brand/jen-studio-headshot.png.
All three were uploaded and published as Contentful assets. See cms-publication.json.

JEN’S REPORTED EDIT NOT SHOWING
Origin Story entry 1qbeBkbNgHYTJjeqebOhmT was successfully published at
2026-11-18T15:08:01.833Z. Both sites still rendered the earlier cached version.
The normalized published body had 2,468 characters; the old rendered body had
2,038, including the old education wording. See jen-edit-before.json.
At 2026-11-18T15:19:29.556Z the complete rendered body matched the published
Contentful body on BOTH live and preview. See jen-edit-validation.json.
Jen’s content was not rewritten or reverted.

PUBLISHING REFRESH
POST /api/revalidate requires a server-only 256-bit shared secret in a header,
an allowlisted Contentful publication topic, and matching space/environment.
It rejects unauthenticated, foreign and malformed requests. Draft saves do not
invalidate caches. Published/unpublished/deleted entries and assets expire the
shared Contentful tag immediately and invalidate dependent page layouts.

Contentful webhooks chickzen-vercel-publish and chickzen-preview-publish target
the two stable HTTPS hosts and filter to master. Only entity identifiers are
sent in their transformed bodies. The secret header is protected in Contentful
and sensitive in the existing Vercel project’s Production/Preview environments.
No secret values are in these documents or repository files.

Actual provider delivery was verified by republishing an unchanged homepage
experience label; no visitor inquiry, analytics event or email was sent.
Both Contentful delivery logs returned 200 with zero errors at approximately
2026-11-18T15:18:25Z. See webhook-delivery.json. The one-hour cache remains as a
fallback and keeps normal visitor traffic from generating uncached CMS calls.
An existing browser tab still needs a reload to see newly published content.

VALIDATION
- Lint passed. Three homepage CMS tests and three publishing authorization/
  invalidation tests passed; existing migration and analytics checks passed.
- Preview and Production cloud builds passed compilation, lint and TypeScript
  against the pinned Next.js 16.4.5. Existing local shared dependencies still use
  15.5.7, whose revalidateTag type lacks the second argument. No dependencies
  were installed locally; cloud checks use the authoritative lockfile/version.
- Live and preview homepage checks at 1440, 390 and 320 px: no overflow or browser
  errors; original section text unchanged; portrait loaded; all 20 cards present;
  keyboard wrapping, previous/next and reduced-motion behavior passed.
- All 20 logo images loaded, including both new additions. Autoplay and pause
  were verified separately. See logo-validation.json.
- Candidate endpoint rejected missing secret with 401, wrong space with 400,
  and accepted a valid publication with 200. See publish-route-validation.json.
- Live remains indexable; preview stays noindex. Sitemap has 23 URLs. Journal
  still has Strawberry Lemonade first, Level Up Your Strategy last, 11 articles.
- Email, consent/analytics, payment and newsletter settings were preserved.

ROLLBACK AND RECORDS
The previous application release remains available as
dpl_Fy4CzBq3gcgGuJLsSUYshfZX9Nsp. Disable the two new hooks before an application
rollback to a release without /api/revalidate. The CMS additions can remain
without affecting the old application. Do not restore historical CMS snapshots
over later edits by Jen. Do not rerun migrate.mjs as routine publishing: it is
the initial setup record, and later content edits are owned by Contentful.
Earlier unpromoted build dpl_H9nJrfFfncURe2YwCRWmM6swKwXv is superseded.

References checked 18 November 2026:
https://nextjs.org/docs/app/api-reference/functions/revalidateTag
https://www.contentful.com/developers/docs/references/content-management-api/webhooks/
https://www.contentful.com/developers/docs/extensibility/webhooks/transformations/
