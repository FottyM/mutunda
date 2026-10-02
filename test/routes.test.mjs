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
