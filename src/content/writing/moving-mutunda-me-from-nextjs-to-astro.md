---
title: Moving mutunda.me from Next.js to Astro
description: Why I rebuilt my single-page Next.js portfolio with Astro, Git-backed writing, and a design system built around reading.
date: 2026-10-03
tags:
  - astro
  - architecture
  - blogging
draft: false
locale: en
---

This started with a conversation about blogging.

I was considering dev.to, mostly because I have no existing audience. Publishing on a platform where developers already spend time made sense. But I also had a personal domain and a site that needed attention.

The old mutunda.me was a single-page portfolio built with Next.js 12, React 18, and Emotion. It had sections for experience and technologies, but also placeholder text and no proper writing workflow.

Before worrying about where people would discover my posts, I needed somewhere worth sending them.

## Why Astro

There wasn't anything about the site that demanded a full React application. Most of what I wanted to publish was text: articles, a biography, and explanations of projects.

Astro fit that workload. The new configuration explicitly uses static output. Pages are generated at build time, and content lives in the repository.

This wasn't a migration driven by a benchmark or a claim that Next.js is bad. Next.js can handle a portfolio. I wanted a setup where adding an article felt like adding an article, rather than extending an application.

The old dependencies were also an opportunity to reconsider what the site needed. Carrying everything forward would have defeated much of the point.

## Giving the site somewhere to grow

The rebuild separates the homepage, writing, projects, and about page.

That changes what I can put on the site. A project can now have its own case study instead of being a name beside a technology logo. An article has a stable URL, metadata, and a place in the writing archive.

Writing and project content use Astro Content Collections. Markdown is the default, with MDX available when content needs a component.

Keeping the content in Git suits the way I already work. Changes are reviewable, previous versions are available, and the articles remain files I can take elsewhere. I don't need a separate content-management service to publish a few pages.

## A theme built around reading

The visual direction we settled on was a "technical field journal": editorial typography, compact annotations, thin rules, and enough space for longer writing.

That gave the rebuild a more useful design constraint than simply making it look newer.

The implementation has shared design tokens and a rendered style guide. It supports light, dark, and system themes, with explicit preferences stored locally. There's also a command palette for navigating pages and changing themes.

Those details give the site some personality, but the article layout matters more. Code should scroll without breaking the page. Text should have a comfortable reading width. Navigation should work with a keyboard.

The repository now also includes English, French, and Estonian routes. That adds another concern beyond translating paragraphs: navigation, metadata, and links need to stay consistent across languages.

## Checking more than whether it builds

A static site still has plenty of ways to break.

A page can build with a link to a nonexistent route. A draft can accidentally appear in the archive. A feed can point to the wrong hostname.

The project includes Astro and TypeScript checks, build-based tests, internal-link checks, and internationalization tests. RSS and sitemap generation are part of the publishing setup rather than tasks to remember after writing.

I'm not attaching a performance victory lap to this migration. Without comparable measurements of the old and new sites, a faster-sounding framework name isn't evidence.

## Where dev.to fits

I still want to use dev.to for discovery. The plan is to publish on mutunda.me first, then cross-post selected articles with a canonical link back to the original.

Owning a domain doesn't produce an audience. It does give me somewhere consistent to keep the work as I build one.

The rebuild gives me a publishing workflow and space to explain what I make. Now I need to use it.
