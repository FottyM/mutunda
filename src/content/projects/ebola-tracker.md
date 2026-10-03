---
slug: ebola-tracker
title: Ebola Tracker
summary: A live epidemiological map and situation dashboard for the 2026 Bundibugyo ebolavirus outbreak in Central Africa.
description: A static, mobile-ready surveillance interface backed by an automated ingestion and validation pipeline.
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

## The reporting landscape

Outbreak reporting arrives through separate public-health sources, formats, and geographic levels. A useful public view needs to preserve provenance and freshness without presenting uncertain data as current.

The interface also needs to keep a dense map and situation summary usable on phones, where the available map area is limited.

## Validation before presentation

I built a scheduled pipeline that discovers DRC Ministry situation reports, parses their PDF data, incorporates UN OCHA HDX feeds, and reconciles national, provincial, and health-zone totals.

The pipeline uses fail-closed validation, immutable snapshots, change detection, retention, and rollback tooling so an unavailable or inconsistent source cannot silently replace the last validated dataset.

The static Leaflet and OpenStreetMap experience uses responsive panels, touch-oriented controls, epidemic curves, demographic charts, and explicit source-health states.

## A static public surface with an operational core

The public dashboard is delivered through GitHub Pages without a production application server, while GitHub Actions refreshes validated data on a four-hour schedule.

The project keeps source reachability separate from epidemiological freshness and retains previous snapshots for operational recovery.
