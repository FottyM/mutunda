import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readPage(pathname) {
  const outputPath = pathname === "/" ? "dist/index.html" : `dist${pathname}.html`;
  return readFile(new URL(`../${outputPath}`, import.meta.url), "utf8");
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
