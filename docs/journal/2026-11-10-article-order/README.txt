CHICKZEN JOURNAL ORDER — 10 NOVEMBER 2026

Jen requested A Case for Strawberry Lemonade first and Level Up Your Strategy last.
The nine other articles keep their previous relative order. The homepage feature
and article previous/next links use the same editorial order.

Live journal: https://chickzen.com/blog
Stable review: https://chickzen-preview.vercel.app
Application commit: c81ba31 (codex/chickzen-vercel-migration).
Production deployment: dpl_Fy4CzBq3gcgGuJLsSUYshfZX9Nsp.

The ordering is applied after the shared one-hour Contentful cache. Publishing
dates, article content and URLs are unchanged. The homepage now reuses the cached
post list instead of making a separate latest-post query.

Validation: lint, TypeScript and cloud build passed. Rendered production checks
confirmed all 11 cards, the first/last positions, nine unchanged middle articles,
matching homepage feature, consistent neighboring links and 23 sitemap entries.
Checks read HTML without executing analytics or submitting forms.
See before.json, candidate-validation.json and live-validation.json.

Preview deployment: dpl_2FUw51J7R3gis6qAvDmKi5oYZG7c.
Stable preview order also passed; see preview-validation.json.
