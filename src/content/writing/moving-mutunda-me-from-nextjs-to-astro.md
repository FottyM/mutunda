---
title: Moving mutunda.me from Next.js to Astro
description: Why I rebuilt my single-page Next.js portfolio with Astro, Git-backed writing, and a design system built around reading.
date: 2026-10-03
tags:
  - astro
  - architecture
  - blogging
draft: false
cover:
  src: ../../assets/images/writing/mutunda-nextjs-to-astro-cover.png
  alt: A browser window clearing the first hurdle on the way to a calmer publishing system.
locale: en
---

This began with a small, awkward question: where should I put my writing?

dev.to was an obvious answer. People already go there to read about software, and I do not yet have an audience of my own. But I also had a domain and an old portfolio that had begun to feel like a locked room. It was a single page built with Next.js 12, React 18 and Emotion. It listed experience and technologies, but it had placeholder text and no real place for an article to live.

Before I could send anyone to my writing, I needed a home worth sending them to.

## Why Astro

Nothing about the site needed a full React application. I wanted to publish articles, a biography and project notes. Astro suited that job because it stays out of the way. I can write a page in MDX, build the site and publish it. I do not need extra systems around a personal portfolio.

Next.js can do this work perfectly well. This was not an escape from a bad tool. I wanted adding an article to feel like adding an article, rather than changing an application. Astro makes static pages that search engines can read. If the site later needs pages made on the server, Astro can do that too. For now, it does not need to.

## The requirements I did not have

It is easy to prepare for a grand campaign when all you need is a good pair of boots. A portfolio rebuild can invite a headless CMS, a database, search, a dashboard and enough moving parts to make the original problem disappear beneath them.

That was not an honest picture of this site. I needed a lasting home page, project notes, articles, stable URLs and a way to change them without reopening a half-remembered machine months later. Writing that down changed the question. I stopped asking which frontend was best and started asking what would make publishing simple and leave the work portable.

Static output and Markdown answered most of it. There is still JavaScript where it earns its place. The site remembers a theme, switches languages, opens a command palette and moves between pages without a hard reset. But the words, navigation and reading experience arrive first.

## Giving the site somewhere to grow

The new site has separate places for writing, projects and the about page. That gives each piece room to breathe. A project is no longer a name beside a technology logo. It can hold the problem, the decisions and what I learned. An article has a stable address and a place in the archive.

The content lives in Markdown files, with Astro Content Collections checking the front matter when the site builds. Git suits the way I work. I can review a change, find an older version and take the writing elsewhere if I ever need to. A Markdown file is not a promise that moving will be painless, but it does mean the words are not trapped behind one interface.

That modest bit of checking has already proved useful. A missing title or a bad date fails near the change that caused it. I would rather meet that problem in a build than discover it after publishing.

## A theme built around reading

I wanted the design to feel like a technical field journal. That led to editorial type, small notes, thin rules and enough space for a longer piece of writing. It also gave the site a useful limit. It did not need to look new for the sake of looking new. It needed to make reading pleasant.

The shared tokens and style guide keep the pages from drifting as the site grows. I made room for code, kept the text at a comfortable width and made the navigation work with a keyboard. Light, dark and system themes remember the choice a visitor has made. The site also has English, French and Estonian routes, which means the links and metadata need as much care as the translated paragraphs.

## Checking more than whether it builds

Static does not mean untested. A page can build with a broken link, a draft can wander into the archive and a translated route can quietly lead to the wrong place. The project checks Astro and TypeScript, builds the site, checks links and covers the main journeys in a browser: moving around the site, changing language, keeping a theme and recovering from a missing page. The RSS feed and sitemap are made as part of the build, not remembered at the end.

I have no performance victory story to sell here. I did not measure the old site against the new one. A framework name is not evidence. What I have is a site that is simpler to publish to, easier to return to and ready to hold the work I want to share.

## A migration is an editorial decision

Moving the site was not only a technical tidy-up. The old single page made writing and projects feel secondary. Now a post can be brief when it needs to be brief, or take its time when the subject deserves it. A project can show its trade-offs rather than end as a polished bullet point.

I left out the parts that did not solve a real problem, including a database-backed CMS and search service. The aim was not a catalogue of tools and job titles. It was a place that shows how I approach the work.

## Where dev.to fits

I still plan to use dev.to for discovery, publishing on mutunda.me first and cross-posting selected pieces with a canonical link back home. Owning a domain does not create an audience. It does give me a consistent place to keep the work while I earn one.

The next part of this story is about moving the finished site from Vercel to Cloudflare Workers: [from Vercel to Cloudflare Workers](/writing/moving-mutunda-me-from-vercel-to-cloudflare-workers/).
