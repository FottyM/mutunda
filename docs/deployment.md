# Deployment and release engineering

This document defines the production hosting topology, canonical domain rules, continuous integration (CI) pipeline, and launch quality gates for `mutunda.me`.

## Architecture overview

| Component | Provider / Standard | Details |
| :--- | :--- | :--- |
| **DNS** | Cloudflare | Nameservers: `clark.ns.cloudflare.com`, `tina.ns.cloudflare.com` |
| **Host** | Vercel | Static Astro deployment emitting to `dist/` |
| **Canonical Host** | `https://mutunda.me` | Apex domain without `www` |
| **Redirect Source** | `www.mutunda.me` | Permanent redirect (HTTP 308) to `https://mutunda.me/:path*` |
| **Node.js Runtime** | Node 22 (Active LTS) | Specified via `.nvmrc` and `package.json` engines |
| **CI / CD** | GitHub Actions | Workflows on pull requests and pushes to `master` |

## Canonical host and redirect policy

`https://mutunda.me` is the single canonical origin for the entire website.

- All page metadata (`<link rel="canonical">`, Open Graph `og:url`, and Twitter cards) emit `https://mutunda.me/<route>/`.
- Sitemaps (`sitemap-index.xml`, `sitemap-0.xml`) list URLs strictly on `https://mutunda.me`.
- RSS feeds (`/rss.xml`) and web app manifests (`/site.webmanifest`) reference `https://mutunda.me`.
- Cross-posts (e.g. DEV Community) link back to `https://mutunda.me` as canonical.

### Vercel redirect rules

`vercel.json` configures permanent redirection for `www.mutunda.me`:

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "www.mutunda.me"
        }
      ],
      "destination": "https://mutunda.me/:path*",
      "permanent": true
    }
  ]
}
```

In the Vercel project dashboard under **Settings &rarr; Domains**, ensure `mutunda.me` is designated as the primary production domain and `www.mutunda.me` is configured to redirect to `mutunda.me`.

### Production HTTP security headers

`vercel.json` applies hardened security and transport headers to all routes:

- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## Continuous Integration (CI)

Pull-request CI runs on GitHub Actions (`.github/workflows/ci.yml`) targeting `master`. Every run executes on clean `ubuntu-latest` environments with Node 22 LTS:

1. **Dependency installation**: `npm ci` verifies lockfile reproducibility.
2. **Type diagnostics**: `npm run check` executes Astro and TypeScript validation across all templates, layouts, and components.
3. **Behavior and contract test suite**: `npm test` runs static build compilation and `node:test` route assertions.
4. **Internal-link verification**: `npm run test:links` crawls all emitted HTML documents in `dist/` and validates that all internal URLs, assets, hash targets, and sitemap entries exist.
5. **Static artifact confirmation**: Asserts required distribution files (`dist/index.html`, `dist/404.html`, `dist/robots.txt`, `dist/sitemap-index.xml`, `dist/rss.xml`).

## Local verification commands

```bash
# Type check Astro and TypeScript files
npm run check

# Execute production build and automated tests
npm test

# Verify internal links and anchor targets in built dist/
npm run test:links

# Preview the built static site locally
npm run preview
```

## Launch quality gates

Before final cutover or major releases, the following criteria must be met:

- [x] Clean clone builds reproducibly with zero errors (`npm test`).
- [x] Zero broken internal links or missing anchor IDs across all localized pages.
- [x] Canonical apex domain (`mutunda.me`) active with valid HTTPS and strict non-canonical redirection.
- [x] Mobile Lighthouse benchmarks score $\ge 90$ across:
  - **Performance**: $\ge 90$
  - **Accessibility**: $\ge 90$ (WCAG 2.1 AA compliant)
  - **Best Practices**: $\ge 90$
  - **SEO**: $\ge 90$
