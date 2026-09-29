# mutunda.me — Astro rebuild direction

## Decision

Rebuild `mutunda.me` as an Astro static site. It will be the canonical home for portfolio work and long-form technical writing; DEV Community will be a discovery channel, with every cross-post canonicalized to the equivalent `mutunda.me` page.

## Current state

This repository is the deployed-site source: its homepage is configured as `https://mutunda.me`. It is a single-page Next.js 12.2 / React 18 portfolio, using Emotion, a Node 18 baseline, and no content system. Its starter README and single-page structure make a clean Astro replacement safer than an incremental framework upgrade.

## v1 product scope

- `/` — current positioning and selected work.
- `/writing` — article index, tags, RSS.
- `/writing/[...slug]` — Markdown/MDX articles.
- `/projects` — project case studies, beginning with Ebola Tracker.
- `/about` — current biography and contact links.
- Sitemap, robots policy, canonical metadata, Open Graph cards, and a custom 404.

Exclude a CMS, database, comments, authentication, newsletter system, analytics, and visual excess from v1.

## Architecture

- Current Astro and TypeScript on a supported Node LTS release.
- Static output only; deploy prebuilt `dist/` assets.
- Astro Content Collections for Git-backed writing and projects:

```text
src/content/
  writing/
    article-slug.md
  projects/
    ebola-tracker.md
```

- Markdown by default; MDX only when an article truly needs a component.
- Scoped CSS and custom properties; no CSS/UI framework by default.
- `@astrojs/rss` and `@astrojs/sitemap`.
- A shared SEO component that emits title, description, canonical URL, Open Graph metadata, and appropriate JSON-LD.

Required writing front matter:

```yaml
title: ""
description: ""
publishedAt: 2026-01-01
tags: []
draft: true
canonicalURL: "https://mutunda.me/writing/article-slug/"
```

Drafts must be excluded from production builds.

## Deployment and CI

Keep hosting provider-neutral until the existing production deployment is identified. The site build must be reproducible with:

```text
npm run check
npm run test
npm run build
npm run preview
```

GitHub Actions should run supported actions and the current Node LTS on pull requests, executing formatting/linting, type checks, behavior tests, and a production build. Deployment should publish only `dist/` and make exactly one of `mutunda.me` / `www.mutunda.me` canonical.

## Migration sequence

1. Confirm host, DNS ownership, current redirect rules, and the preferred canonical host.
2. Create the Astro application and test the initial route behavior before adding production code.
3. Build the site shell and homepage with rewritten—not copied—public text.
4. Add content collections, writing routes, RSS, sitemap, and the canonical-URL policy.
5. Add project case studies and current professional details.
6. Configure CI and the hosting deployment.
7. Verify mobile/keyboard navigation, internal links, metadata, generated feeds, and static build output before cutover.

## Acceptance gates

- Test-first development for new behavior.
- `npm run check`, tests, and production build pass locally and in CI.
- Internal-link validation passes against the built output.
- Mobile Lighthouse Performance, Accessibility, Best Practices, and SEO scores are each at least 90.
- No tracker, remote font, or third-party runtime dependency without a stated need.

## Decisions still needed

- Current host and DNS arrangement.
- Canonical hostname (`mutunda.me` or `www.mutunda.me`).
- Contact method.
- Whether writing is strictly technical or also includes personal/theological work; navigation and taxonomy depend on this.
