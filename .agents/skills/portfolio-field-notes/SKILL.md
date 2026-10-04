---
name: portfolio-field-notes
description: Comprehensive editorial and technical writing guide for mutunda.me field notes. Use whenever drafting, editing, translating, or verifying articles, personal essays, incident analyses, or technical notes. Enforces author voice, hard 2,000-word caps, no em dashes, structured GFM footnotes, and multilingual parity across English, French, and Estonian.
---

# Personal Software Field Notes for mutunda.me

This skill governs the editorial, technical, and architectural standards for writing, revising, and maintaining field notes on **mutunda.me**.

---

## 1. Editorial Voice & Tone

- **Perspective**: Use plain British English, short active sentences, and first person ("I").
- **Persona**: Sound like an engineer recording what actually happened on the ground. Never sound like a tutorial, a press release, corporate marketing, or an AI-generated explainer.
- **Tone**: Warm, reflective, grounded, and lightly adventurous when it fits.
- **Punctuation rule**: **Do not use em dashes (`—`)** or double hyphens (`--`) as dashes. Use commas, semicolons, parentheses, or separate sentences instead.
- **Forbidden filler**: Avoid buzzwords, promotional prose, and AI idioms:
  - *"game changer"*, *"seamless"*, *"leverage"*, *"delve"*, *"in conclusion"*, *"it is worth noting"*, *"testament"*, or repetitive introductory and summary paragraphs.
- **Hard word-count limit**: Apply a **hard 2,000-word cap** per article and per language edition (including code examples and notes).
  - If a topic genuinely demands more space, split it into a multipart series at natural topic boundaries with distinct scopes, titles, and working cross-links rather than exceeding the cap or gutting essential substance.
  - Do not split articles that are already within the cap without an editorial reason.
- **Preserve dictated experience**: When adapting spoken or dictated recollections, faithfully retain the author's real arguments, blunt opinions, authentic uncertainties, and unresolved contradictions ("I hate it", "I don't know yet why I like Hasura").
  - Do not invent neat causal chronologies, diplomatic reconciliations, or tidy moral conclusions.
  - Add technical context only where requested or strictly necessary for clarity and accuracy.

---

## 2. Narrative Arc & Code Integration

- **Incident-led opening**: Begin with a concrete friction point, question, irritation, or failure that draws the reader into the real work (e.g., an unexpected build failure, a memory spike, or an awkward domain question).
- **Chronology vs. Hook**: Opening with an incident does not mean that incident caused all prior doubts. Distinguish the narrative hook from historical chronology; do not invent a fictional turning point for narrative convenience.
- **In-line code demonstration**: Weave short, focused code examples directly into the narrative right where the reader needs them:
  1. Describe what was encountered.
  2. Show the relevant code snippet.
  3. Explain its immediate consequence.
  4. Continue the story.
  - Never exile explanations or code to an isolated technical appendix.
- **GraphQL-specific field note guidelines**:
  - Describe the query as *"seemingly harmless"*, not *"stupid"*.
  - Acknowledge that the author already found GraphQL odd in a complex setup before the incident.
  - Accurately represent the extension architecture: `src/graphql/extensions/Query/types/[typename]/resolver.ts` and `Mutation/types/[typename]/`, where resolvers can delegate to an underlying subschema, execute GraphQL over HTTP, or make plain HTTP `fetch` calls.
  - In fan-out incidents, show the resolver making plain HTTP calls in `Promise.all`, explain the arithmetic (e.g., 20 entities × 5 requests = 100 downstream calls), and show the concurrency limiter (`p-limit`).
- **Endings**: Conclude on a concrete observation or next step, never a moral lesson or canned summary.

---

## 3. Accuracy, Privacy & Primary Grounding

- **Privacy & safety**: Never expose real internal hostnames, private IPs, raw DNS records, secrets, tokens, customer data, or proprietary infrastructure.
- **Time-bound claims**: Keep pricing, plan limits, and feature tiers explicitly time-bound (e.g., "at the time of the move").
- **Clear labelling**: Clearly label illustrative code examples and fixtures (e.g., *"This is an illustrative request, not code from that job"*).
- **Fact checking & primary sources**: Ground every factual technical claim with primary documentation. Cite them as numbered Markdown footnotes (`[^1]`).
- **Honest uncertainty**: If a memory or implementation detail is incomplete (e.g., an exact enum fix or bridge connector), explicitly state the uncertainty rather than inventing a plausible technical explanation.

---

## 4. Repository Structure & Front Matter

Articles live in `src/content/writing/`:
- English: `<slug>.md`
- French: `<slug>.fr.md`
- Estonian: `<slug>.et.md`

### Front Matter Schema (`src/content.config.ts`)

```yaml
---
title: How my love for GraphQL fell off a cliff
description: From a Net Ninja tutorial to LoopBack filters, debugging GraphQL at work, and a brief look at Hasura.
date: 2026-10-04
tags:
  - graphql
  - architecture
  - debugging
draft: false
cover:
  src: ../../assets/images/writing/graphql-over-the-cliff-cover.png
  alt: An abstract query sheet tipping over a cliff into a network of pipes and service nodes.
locale: en
---
```

For French and Estonian editions, include `slug: <slug>` matching the English file name, localized title/description/tags, and localized `alt` text.

### Visual Assets (`cover`)
- Editorial covers use a 16:9 Memphis-style abstract metaphor for the central hurdle.
- Palette: warm cream, deep forest green, muted coral, mustard, black.
- No text, code, logos, screenshots, faces, or watermarks.
- Images are placed under `src/assets/images/writing/` and imported via Astro Assets for progressive blur-up rendering.

---

## 5. Footnotes & Documentation Citations

- **GFM Footnotes**: Use inline `[^N]` markers and numbered references at the end of the document.
- **Section Heading**: End the article with `## Notes` (matching the archive's established standard).
- **Reference format**:
  ```markdown
  ## Notes

  [^1]: LoopBack 3: [querying data](https://loopback.io/doc/en/lb3/Querying-data.html).
  [^2]: [Fetch standard: response `ok`](https://fetch.spec.whatwg.org/#dom-response-ok).
  ```
- **Astro Rendering**: Astro compiles GFM footnotes into `<section data-footnotes class="footnotes">`, styled via `src/styles/global.css`.

---

## 6. Multilingual Parity (English, French, Estonian)

When writing or revising articles:
1. Maintain strict 1:1 structural and technical parity across all three locales.
2. Keep footnote numbers identical across all three language files.
3. Keep code blocks identical, localizing only inline explanatory comments if helpful.
4. Ensure all titles, descriptions, slugs, and back links (`.back-link`) match the expected route contracts.

---

## 7. Mandatory Verification Checklist

Before considering any field note ready:

1. **Programmatic Word Count**: Run `wc -w` and verify every language version is strictly $\le 2,000$ words.
2. **Em-Dash Scan**: Run `grep -n "—" <files>` and ensure zero occurrences.
3. **Internal Link & Syntax Check**: Run `npm run check` (Astro type/content check, must pass with 0 errors).
4. **End-to-End Suite**: Run `npm run test:e2e` (all Playwright browser tests must pass).
5. **Git Discipline**:
   - `git fetch` and check status.
   - Commit with a standard conventional commit message (e.g., `docs(writing): ...`).
   - Push to the designated topic branch.
