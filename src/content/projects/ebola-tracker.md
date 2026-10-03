---
slug: ebola-tracker
title: Ebola Tracker
summary: A public situation dashboard for the 2026 Bundibugyo ebolavirus outbreak across the DRC and neighbouring surveillance routes.
description: A regularly refreshed map and dashboard that turns scattered official reports into a clearer view of an outbreak.
role: Creator and software engineer
year: 2026
featured: true
draft: false
locale: en
technologies:
  - JavaScript
  - Vite+
  - Leaflet
  - OpenStreetMap
  - TanStack Charts
  - GitHub Actions
links:
  live: https://fottym.github.io/ebola-tracker/
  repository: https://github.com/FottyM/ebola-tracker
---

## The problem

When an outbreak is local, useful public information can be hard to find. Important figures may sit in scattered PDF bulletins, far from the people trying to understand what is happening. I wanted a public place where the information could be found and read without hunting through reports.

I built Ebola Tracker as a small weekend experiment. It has since grown into a situation dashboard for the 2026 Bundibugyo ebolavirus outbreak: the Democratic Republic of the Congo, the Ugandan border context, and international medical-evacuation routes.

## Following the data, not just the headline

Every four hours, the pipeline checks official reports and updates the data with ordinary code, not an LLM. It brings together DRC Ministry and INSP bulletins, health-zone data, and verification from organisations including WHO and Africa CDC.

The DRC figures remain separate from international medical evacuations. That distinction matters: a patient receiving care elsewhere should not make it appear that the outbreak has moved there.

The dashboard keeps the source and last-update time visible. Its map can move from country to province and health zone, while situation summaries, outbreak timelines and demographic charts make the figures easier to read on a phone or a larger screen.

## Small public surface, careful data handling

The public site runs on GitHub Pages without a production application server. GitHub Actions handles the scheduled refresh. Validation, snapshots, change detection and rollback checks stop an unavailable or inconsistent bulletin from silently replacing the last good dataset.
