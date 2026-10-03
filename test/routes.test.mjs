import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readPage(pathname) {
  const outputPath = pathname === "/"
    ? "dist/index.html"
    : pathname === "/404"
      ? "dist/404.html"
      : `dist${pathname}/index.html`;
  return readFile(new URL(`../${outputPath}`, import.meta.url), "utf8");
}

async function readOutput(pathname) {
  return readFile(new URL(`../dist/${pathname}`, import.meta.url), "utf8");
}

test("the home page provides the primary site navigation and introduction", async () => {
  const html = await readPage("/");

  assert.match(html, /<nav[^>]*aria-label="Primary"/);
  assert.match(html, /<main[^>]*id="main-content"/);
  assert.match(html, /Fortunat Mutunda/);
});

test("the custom not-found page provides a route home", async () => {
  const html = await readPage("/404");

  assert.match(html, /Page not found/);
  assert.match(html, /href="\/"/);
});

test("the style guide renders the reusable visual language", async () => {
  const html = await readPage("/style-guide");

  assert.match(html, /Technical field journal/);
  assert.match(html, /button--primary/);
  assert.match(html, /class="tag"/);
  assert.match(html, /class="card"/);
  assert.match(html, /callout--warning/);
  assert.match(html, /class="prose"/);
});

test("the primary navigation reaches every portfolio section", async () => {
  const html = await readPage("/");

  for (const path of ["/projects", "/writing", "/about"]) {
    assert.match(html, new RegExp(`href="${path}"`));
  }
});

test("the project index and generated case study use the shared project entry", async () => {
  const index = await readPage("/projects");
  const caseStudy = await readPage("/projects/ebola-tracker");

  assert.match(index, /href="\/projects\/ebola-tracker"/);
  assert.match(caseStudy, /Ebola Tracker/);
  assert.match(caseStudy, /Creator and software engineer/);
  assert.match(caseStudy, /fottym\.github\.io\/ebola-tracker/);
  assert.match(caseStudy, /github\.com\/FottyM\/ebola-tracker/);
  assert.match(caseStudy, /rel="canonical" href="https:\/\/mutunda\.me\/projects\/ebola-tracker\/"/);
});

test("the about route provides intentional public content", async () => {
  const about = await readPage("/about");

  assert.match(about, /based in Tallinn, Estonia/);
  assert.match(about, /src="https:\/\/avatars\.githubusercontent\.com\/u\/227173828\?v=4"/);
  assert.match(about, /alt="Fortunat Mutunda"/);
  assert.match(about, /https:\/\/github\.com\/FottyM/);
  assert.match(about, /https:\/\/www\.linkedin\.com\/in\/fortunat-mutunda\//);
  assert.equal((about.match(/class="profile-link__icon"/g) ?? []).length, 2);
});

test("French routes render localized navigation, content, and language metadata", async () => {
  const home = await readPage("/fr");
  const article = await readPage("/fr/writing/static-sites-are-operational-systems");

  assert.match(home, /<html lang="fr">/);
  assert.match(home, /href="\/fr\/projects">Projets<\/a>/);
  assert.match(home, /href="\/" hreflang="en" lang="en"/);
  assert.match(home, /href="https:\/\/mutunda\.me\/fr\/"/);
  assert.match(article, /Les sites statiques sont des systèmes opérationnels/);
  assert.match(article, /Publié le 3 octobre 2026/);
  assert.match(article, /rel="alternate" hreflang="en" href="https:\/\/mutunda\.me\/writing\/static-sites-are-operational-systems\/"/);
});

test("Estonian routes render localized navigation, content, and language metadata", async () => {
  const home = await readPage("/et");
  const about = await readPage("/et/about");
  const projects = await readPage("/et/projects");
  const article = await readPage("/et/writing/static-sites-are-operational-systems");
  const caseStudy = await readPage("/et/projects/ebola-tracker");

  assert.match(home, /<html lang="et">/);
  assert.match(home, /href="\/et\/projects">Projektid<\/a>/);
  assert.match(home, /href="\/et\/writing">Kirjutised<\/a>/);
  assert.match(home, /href="\/et\/about">Minust<\/a>/);
  assert.match(about, /Tarkvaraarendus terve süsteemi vaates/);
  assert.match(projects, /Ebola Tracker/);
  assert.match(caseStudy, /Reaalajas epidemioloogiline kaart/);
  assert.match(article, /Staatilised veebisaidid on operatiivsed süsteemid/);
  assert.match(article, /Avaldatud 3\. oktoober 2026/);
  assert.match(article, /rel="alternate" hreflang="et" href="https:\/\/mutunda\.me\/et\/writing\/static-sites-are-operational-systems\/"/);
});

test("the language selector renders flags and preserves equivalent page navigation", async () => {
  const home = await readPage("/");
  const article = await readPage("/writing/static-sites-are-operational-systems");
  const caseStudy = await readPage("/projects/ebola-tracker");

  // Flag icons are present
  assert.match(home, /class="flag-icon"/);
  assert.match(home, /aria-label="Language selection"/);
  assert.match(home, /aria-current="true"[^>]*>[\s\S]*?EN/);
  assert.match(home, /href="\/fr" hreflang="fr" lang="fr"[^>]*>[\s\S]*?FR/);
  assert.match(home, /href="\/et" hreflang="et" lang="et"[^>]*>[\s\S]*?ET/);

  // Equivalent article routes are preserved
  assert.match(article, /href="\/fr\/writing\/static-sites-are-operational-systems"/);
  assert.match(article, /href="\/et\/writing\/static-sites-are-operational-systems"/);

  // Equivalent project routes are preserved
  assert.match(caseStudy, /href="\/fr\/projects\/ebola-tracker"/);
  assert.match(caseStudy, /href="\/et\/projects\/ebola-tracker"/);
});

test("missing tag translations use a safe index fallback and localized interface copy", async () => {
  const frenchOnlyTag = await readPage("/fr/writing/tags/livraison");
  const frenchArticle = await readPage("/fr/writing/static-sites-are-operational-systems");
  const estonianTag = await readPage("/et/writing/tags/delivery");

  assert.match(frenchOnlyTag, /href="\/writing" hreflang="en" lang="en"/);
  assert.doesNotMatch(frenchOnlyTag, /href="\/writing\/tags\/livraison" hreflang="en"/);
  assert.doesNotMatch(frenchOnlyTag, /hreflang="en" href="https:\/\/mutunda\.me\/writing\/tags\/livraison/);
  assert.match(frenchArticle, /aria-label="Étiquettes"/);
  assert.match(estonianTag, /3\. oktoober 2026/);
});

test("the site exposes a keyboard-accessible theme control with anti-FOUC script and token contracts", async () => {
  const home = await readPage("/");
  const tokensCss = await readFile(new URL("../src/styles/tokens.css", import.meta.url), "utf8");

  // Anti-FOUC script is present in <head>
  assert.match(home, /localStorage\.getItem\("theme"\)/);
  assert.match(home, /document\.documentElement\.setAttribute\("data-theme"/);

  // Accessible theme control exists in the header
  assert.match(home, /<div class="theme-control"/);
  assert.match(home, /id="theme-toggle"/);
  assert.match(home, /aria-label="Toggle color theme"/);

  // Tokens CSS supports light, dark, and system preference overrides
  assert.match(tokensCss, /:root\[data-theme="light"\]/);
  assert.match(tokensCss, /:root\[data-theme="dark"\]/);
  assert.match(tokensCss, /@media \(prefers-color-scheme: dark\)/);
  assert.match(tokensCss, /--color-background/);
  assert.match(tokensCss, /--color-focus/);

  // Page flip from bottom right View Transition is defined in global CSS
  const globalCss = await readFile(new URL("../src/styles/global.css", import.meta.url), "utf8");
  assert.match(globalCss, /@keyframes page-flip-bottom-right/);
  assert.match(globalCss, /html\.theme-transitioning::view-transition-new\(root\)/);
  assert.match(globalCss, /clip-path: polygon/);
});


test("published writing renders chronologically with article and tag routes", async () => {
  const writing = await readPage("/writing");
  const article = await readPage("/writing/static-sites-are-operational-systems");
  const tag = await readPage("/writing/tags/architecture");

  assert.match(writing, /Static sites are operational systems/);
  assert.doesNotMatch(writing, /An unpublished field note/);
  assert.match(article, /datetime="2026-10-03T00:00:00.000Z"/);
  assert.match(article, /Content is an interface/);
  assert.match(article, /href="\/writing\/tags\/architecture"/);
  assert.match(tag, /1 note in this field/);
  assert.match(tag, /Static sites are operational systems/);
});

test("public pages expose canonical, social, and structured metadata", async () => {
  const home = await readPage("/");
  const article = await readPage("/writing/static-sites-are-operational-systems");

  assert.match(home, /rel="canonical" href="https:\/\/mutunda\.me\/"/);
  assert.match(home, /property="og:title" content="Fortunat Mutunda — Software Engineer"/);
  assert.match(home, /name="twitter:card" content="summary"/);
  assert.match(home, /"@type":"Person"/);
  assert.match(home, /https:\/\/www\.linkedin\.com\/in\/fortunat-mutunda\//);
  assert.match(article, /"@type":"Article"/);
  assert.match(article, /property="og:type" content="article"/);
  assert.match(article, /"mainEntityOfPage":"https:\/\/mutunda\.me\/writing\/static-sites-are-operational-systems\/"/);
});

test("the build emits RSS, sitemap, and a crawl policy", async () => {
  const [rss, sitemapIndex, sitemap, robots] = await Promise.all([
    readOutput("rss.xml"),
    readOutput("sitemap-index.xml"),
    readOutput("sitemap-0.xml"),
    readOutput("robots.txt"),
  ]);

  assert.match(rss, /<title>Fortunat Mutunda — Field notes<\/title>/);
  assert.match(rss, /static-sites-are-operational-systems/);
  assert.doesNotMatch(rss, /unpublished-field-note/);
  assert.match(sitemapIndex, /https:\/\/mutunda\.me\/sitemap-0\.xml/);
  assert.match(sitemap, /https:\/\/mutunda\.me\/writing\/static-sites-are-operational-systems\//);
  assert.match(robots, /User-agent: GPTBot\nDisallow: \//);
  assert.match(robots, /User-agent: ClaudeBot\nDisallow: \//);
  assert.match(robots, /User-agent: PerplexityBot\nDisallow: \//);
  assert.match(robots, /Sitemap: https:\/\/mutunda\.me\/sitemap-index\.xml/);
});

test("the command palette provides accessible, keyboard-operable site search and actions", async () => {
  const home = await readPage("/");
  const frenchHome = await readPage("/fr");
  const estonianHome = await readPage("/et");

  // Visible discoverability trigger exists in header
  assert.match(home, /id="command-palette-trigger"[^>]*aria-haspopup="dialog"/);
  assert.match(home, /aria-controls="command-palette-dialog"/);
  assert.match(home, /aria-label="Open command palette"/);
  assert.match(home, /class="command-palette-trigger__icon"/);

  // Native modal dialog with light dismiss attribute
  assert.match(home, /<dialog[^>]*class="command-palette-dialog"[^>]*closedby="any"/);

  // Accessible combobox search input
  assert.match(home, /<input[^>]*id="command-palette-input"[^>]*role="combobox"/);
  assert.match(home, /aria-autocomplete="list"/);
  assert.match(home, /aria-controls="command-palette-list"/);

  // Primary destinations listed (Home, Projects, Writing, About)
  assert.match(home, /id="nav-home"[^>]*data-href="\/"/);
  assert.match(home, /id="nav-projects"[^>]*data-href="\/projects"/);
  assert.match(home, /id="nav-writing"[^>]*data-href="\/writing"/);
  assert.match(home, /id="nav-about"[^>]*data-href="\/about"/);

  // Actions and brand SVGs
  assert.match(home, /data-action="theme-light"/);
  assert.match(home, /data-action="theme-dark"/);
  assert.match(home, /data-action="theme-system"/);
  assert.match(home, /class="command-palette__brand-icon"/);
  assert.match(home, /https:\/\/github\.com\/FottyM/);

  // Localized palettes in French and Estonian
  assert.match(frenchHome, /aria-label="Ouvrir la palette de commandes"/);
  assert.match(frenchHome, /data-href="\/fr\/projects"/);
  assert.match(frenchHome, /Les sites statiques sont des systèmes opérationnels/);
  assert.match(estonianHome, /aria-label="Ava käsualus"/);
  assert.match(estonianHome, /data-href="\/et\/writing"/);
  assert.match(estonianHome, /Staatilised saidid on operatsioonisüsteemid/);

  // Focus and dialog binding
  assert.match(home, /id="command-palette-dialog"/);
  assert.match(home, /class="command-palette__list"/);
});
