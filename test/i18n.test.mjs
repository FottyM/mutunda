import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readPage(pathname) {
  const outputPath = pathname === "/"
    ? "dist/index.html"
    : `dist${pathname}/index.html`;
  return readFile(new URL(`../${outputPath}`, import.meta.url), "utf8");
}

const writingListings = [
  {
    locale: "en",
    path: "/writing",
    title: "Static sites are operational systems",
    absentTitles: [
      "Les sites statiques sont des systèmes opérationnels",
      "Staatilised veebisaidid on operatiivsed süsteemid",
    ],
  },
  {
    locale: "fr",
    path: "/fr/writing",
    title: "Les sites statiques sont des systèmes opérationnels",
    absentTitles: [
      "Static sites are operational systems",
      "Staatilised veebisaidid on operatiivsed süsteemid",
    ],
  },
  {
    locale: "et",
    path: "/et/writing",
    title: "Staatilised veebisaidid on operatiivsed süsteemid",
    absentTitles: [
      "Static sites are operational systems",
      "Les sites statiques sont des systèmes opérationnels",
    ],
  },
];

test("each localized writing index renders only its matching article translation", async () => {
  for (const listing of writingListings) {
    const html = await readPage(listing.path);

    assert.match(html, new RegExp(`<html lang="${listing.locale}">`));
    assert.match(html, new RegExp(listing.title));
    for (const absentTitle of listing.absentTitles) {
      assert.doesNotMatch(html, new RegExp(absentTitle));
    }
  }
});

test("localized article routes retain their locale-specific metadata and content", async () => {
  for (const listing of writingListings) {
    const html = await readPage(`${listing.path}/static-sites-are-operational-systems`);

    assert.match(html, new RegExp(`<html lang="${listing.locale}">`));
    assert.match(html, new RegExp(`<h1>${listing.title}</h1>`));
  }
});
