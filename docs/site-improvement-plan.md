# AudioLife improvement stages

## Stage 1: Structure and images

Implemented in the October 2026 site update:

- Removed calendar page, menu, events source, component, and calendar CSS.
- Compact responsive header with mobile menu, keyboard Escape, skip link, visible focus.
- Latest post -> reviews/articles -> columns -> external channels. Removed placeholder advertising slot.
- Shared responsive thumbnails and optimized local body images. Originals and manuscripts retained.
- Shared archives: 12 posts/page, search, category filter, crawlable pagination; shared tag/category/search lists.
- Shared detail layout: unobscured photos, readable text width, reviewer YK, related posts on mobile and desktop.
- Duplicate excerpt/body opening is suppressed in presentation only, with SEO descriptions preserved.
- Page-specific canonical for About and archive pagination; thin taxonomy pages and filtered lists are noindex/follow.
- Replaced retired global layout CSS with page/component CSS modules.

## Next release priority: dependency security

`npm audit` on 2026-10-19 reported 17 advisories (2 critical, 10 high, 5 moderate) in the current dependency tree.
The critical package reports include Next.js 14.2.35 and next-auth 4.24.13.
This is dependency scanning, not evidence of a compromise; applicability varies by advisory/deployment.
The layout and manuscript update does not include a framework or authentication migration. Do not run `npm audit fix --force` blindly. Prioritize this work for the next release:

1. Upgrade Next.js/React and next-auth to supported, patched compatible releases.
2. Review App Router async params/searchParams, route handlers, middleware and image configuration migrations.
3. Re-run unit/build/browser tests and verify OAuth, email sign-in, admin authorization, comments and subscription preferences in staging.
4. Re-run audit, evaluate remaining transitive advisories and capture deployment preview results.

Framework/authentication upgrades are intentionally separate from the layout change so failures are attributable and rollback is clear.

## Stage 2: Manuscript structure

Preserve voice, facts, photographs and existing published URLs. Start with 3 representative posts for review before bulk edits.

1. Write distinct short summaries instead of copying the first paragraph.
2. Convert existing section labels to real Markdown H2/H3 headings; do not invent measurements or listening observations.
3. Standardize product/brand/category tags; keep redirects if any public URL must change.
4. Improve descriptive image alt text from the actual image and article context.
5. Add useful contextual internal links, listening conditions and loan/sponsorship disclosures only when verified.
6. Validate dates and accurate review schema; do not fabricate ratings, prices or reviewer claims.

## Stage 3: Search measurement

After deployment, verify the live production build, representative routes and image optimization.
Submit homepage/key updated URLs for re-crawl in Search Console, inspect sitemap and canonical choices.
Track indexed canonical articles, non-brand impressions/clicks, query CTR and mobile Core Web Vitals against a dated baseline.
Indexing/ranking improvements are not guaranteed; avoid repeated bulk indexing requests as a substitute for content quality.

### Stage 2 progress (2026-10-19)

First editorial batch completed: PD5 product review, 천변풍경 listening-space review, Sony Walkman announcement.
Added distinct summaries, semantic headings, descriptive image alt text, targeted contextual links and optional `updated` dates.
Original paragraphs, image paths/order, publication dates and URLs were checked against the imported revision and preserved.
Added product/space/news templates, authoring guide, and build-time content diagnostics.
All 132 manuscripts: 0 validation errors, 393 editorial warnings; representative 3: 0 warnings.
Second editorial batch completed: 10 newest remaining reviews, dated 2026-08-12 through 2026-10-06.
Updated summaries, headings, tags, descriptive alt text, contextual links and modified dates. The original review prose, image paths/order, publication dates and URLs remain in place.
Other manuscripts and dependency security work are still pending.
