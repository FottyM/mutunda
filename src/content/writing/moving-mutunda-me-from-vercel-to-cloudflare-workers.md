---
title: Moving mutunda.me from Vercel to Cloudflare Workers
description: A migration note on Cloudflare Workers, preview URLs, and DNS.
date: 2026-10-04
tags:
  - astro
  - delivery
  - architecture
draft: false
locale: en
---

![Static pages clear a hurdle into a cloud gateway.](/images/writing/mutunda-vercel-to-cloudflare-cover.png)

The road from Vercel to Cloudflare Workers began with an omen I did not trust. Vercel built the site successfully, but GitHub marked the deployment as failed. The Astro build was not the problem. Two external deployment checks had met the limit of Vercel's Hobby plan.

A green build with a red release status is a poor riddle. Had the new site reached the public domain? Was there a preview to inspect? Did the failure point to my code, or only to an account limit? I did not want each release to begin with that sort of guesswork.

Cloudflare was already familiar ground. I use it for other projects, so the tools and dashboards did not feel like another kingdom with its own strange customs. The developer experience was clearer and more enjoyable for the work I wanted to do. The free plan also gave this small site more room at the time of the move. That may change, but it mattered then.

Cloudflare also brings DNS, DDoS protection and other edge security controls into the same place. A personal site does not need a fortress, but it is good to know the walls are there. More than anything, I wanted a platform that suited my work and made the path from a Git commit to a public page plain to see.

## The thing I was actually publishing

Astro writes the finished site to `dist`: HTML, CSS, JavaScript, images, an RSS feed and a sitemap. That directory is the thing being published. There is no server application to keep alive and no database to move. Cloudflare Workers serves the built site.

The arrangement is simple enough to hold in my head. GitHub holds the source. `npm run build` creates the site. `dist` is the release artefact. The Worker makes it available. The site still remembers themes, switches languages and opens a command palette, but the page is useful before any of that arrives.

## A Worker name is not a domain name

The first stumble was a naming mistake. I called the Worker `mutunda.me`, and Wrangler refused it. Worker names use lower-case letters, numbers and dashes. A dot belongs in a domain, not in the Worker name.

So the Worker became `mutunda`, while `mutunda.me` remained the address visitors use. The two names looked close enough to be confused, but they belong to different parts of the system. The Worker runs the site. DNS points the domain at it. Writing that down made the rest of the move less slippery.

Cloudflare's setup command could detect Astro and offer defaults. It could not know everything about this project. I kept the configuration in the repository and reviewed the generated values before they became part of the release.

## The build and the artefact

Cloudflare Workers Builds runs the familiar `npm run build`, then Wrangler publishes the result. I kept the build in one place. Building it again during deployment would have made the trail harder to follow and might have produced a different artefact from the one already reviewed.

The repository declares the supported Node versions, and Cloudflare records the version it selected in the build log. The lockfile, package manager and Node version are as much part of a predictable build as the framework is. The log also mentioned `esbuild`'s post-install script. It was expected, but I would rather know it ran than let it vanish among the noise.

## The missing preview URL

Previews mattered because so much of this site is visual. An article cover, a small-screen layout, a language switcher and a page transition need a browser, not just a diff.

The first preview built successfully but gave the commit no usable URL. The site existed, yet there was nowhere to visit. The configuration needed a `previews` block and `preview_urls: true`, and the matching Version URLs setting needed to be enabled for the Worker. Once those pieces met, the next commit received a proper preview.

I also kept Cloudflare Access on previews only. Branch work stays private, while the public site remains public. That small boundary was important to me.

## DNS is part of the release

DNS asked for more care than the build. The zone contained records for services unrelated to the portfolio, including email. They stayed where they were. I removed only the old routing records for the site, then attached the public hostname to the new Worker.

A DNS zone is a small map of its own, with different records serving different purposes. I checked the old route was gone and the new one was present before waiting for the public result to catch up. The move did not require clearing the map and drawing it again.

## Keep the migration reversible

I wanted a way back while the move was still new. The source remained in GitHub. The build still ran locally. I identified the old routing records before removing them. If the Worker had not worked, I could have restored the old route instead of rebuilding the whole zone.

That restraint mattered because a dashboard is always willing to configure more than a small move requires. I wanted each change to be narrow and explainable.

The result is a quieter delivery path. GitHub holds the source, Astro creates the artefact, the `mutunda` Worker publishes it, and DNS routes the public domain to it. Pull requests can receive protected preview URLs. Cloudflare has its own sharp edges, but each part now has a distinct role. That is all I wanted: fewer riddles between a finished article and the moment it can be read.

This is the second part of the migration. The first covers why I moved the site from Next.js to Astro: [from Next.js to Astro](/writing/moving-mutunda-me-from-nextjs-to-astro/).
