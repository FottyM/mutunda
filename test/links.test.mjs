import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, dirname } from "node:path";
import test from "node:test";

const DIST_DIR = new URL("../dist", import.meta.url).pathname;

async function getHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getHtmlFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

async function fileExists(filePath) {
  try {
    const s = await stat(filePath);
    return s.isFile();
  } catch {
    return false;
  }
}

test("all internal links and resources in built HTML output resolve to existing files and targets", async () => {
  const htmlFiles = await getHtmlFiles(DIST_DIR);
  assert.ok(htmlFiles.length > 0, "dist directory must contain HTML files");

  const hrefRegex = /href=["']([^"']+)["']/g;
  const srcRegex = /src=["']([^"']+)["']/g;

  const brokenLinks = [];
  let checkedCount = 0;

  for (const htmlFile of htmlFiles) {
    const content = await readFile(htmlFile, "utf8");
    const relHtmlPath = relative(DIST_DIR, htmlFile);

    const matches = [
      ...content.matchAll(hrefRegex),
      ...content.matchAll(srcRegex),
    ];

    for (const match of matches) {
      let rawUrl = match[1].trim();

      // Skip non-HTTP / external URLs
      if (
        rawUrl.startsWith("mailto:") ||
        rawUrl.startsWith("tel:") ||
        rawUrl.startsWith("javascript:") ||
        rawUrl.startsWith("data:")
      ) {
        continue;
      }

      if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
        if (!rawUrl.startsWith("https://mutunda.me")) {
          // External link
          continue;
        }
        // Normalize canonical internal URL to root-relative path
        rawUrl = rawUrl.replace("https://mutunda.me", "") || "/";
      }

      checkedCount++;
      const [pathname, hash] = rawUrl.split("#");

      // In-page hash link
      if (!pathname && hash) {
        const hasTarget =
          content.includes(`id="${hash}"`) || content.includes(`name="${hash}"`);
        if (!hasTarget) {
          brokenLinks.push({
            source: relHtmlPath,
            url: rawUrl,
            reason: `Target ID #${hash} not found in same page`,
          });
        }
        continue;
      }

      if (pathname) {
        let normalizedPath = pathname;
        if (normalizedPath.startsWith("/")) {
          normalizedPath = normalizedPath.slice(1);
        } else {
          normalizedPath = join(dirname(relHtmlPath), normalizedPath);
        }

        if (normalizedPath.endsWith("/")) {
          normalizedPath = normalizedPath.slice(0, -1);
        }

        const candidates = normalizedPath === ""
          ? [join(DIST_DIR, "index.html")]
          : [
              join(DIST_DIR, normalizedPath),
              join(DIST_DIR, normalizedPath, "index.html"),
              join(DIST_DIR, `${normalizedPath}.html`),
            ];

        let targetFile = null;
        for (const candidate of candidates) {
          if (await fileExists(candidate)) {
            targetFile = candidate;
            break;
          }
        }

        if (!targetFile) {
          brokenLinks.push({
            source: relHtmlPath,
            url: rawUrl,
            reason: `File not found for path: ${pathname}`,
          });
        } else if (hash && targetFile.endsWith(".html")) {
          const targetContent = await readFile(targetFile, "utf8");
          const hasTarget =
            targetContent.includes(`id="${hash}"`) ||
            targetContent.includes(`name="${hash}"`);
          if (!hasTarget) {
            brokenLinks.push({
              source: relHtmlPath,
              url: rawUrl,
              reason: `Target ID #${hash} not found in ${relative(DIST_DIR, targetFile)}`,
            });
          }
        }
      }
    }
  }

  assert.equal(
    brokenLinks.length,
    0,
    `Found broken internal links:\n${JSON.stringify(brokenLinks, null, 2)}`
  );
  assert.ok(checkedCount > 100, `Expected > 100 links checked, got ${checkedCount}`);
});

test("all URLs in sitemap resolve to valid HTML pages in dist", async () => {
  const sitemapXml = await readFile(join(DIST_DIR, "sitemap-0.xml"), "utf8");
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  const locs = [...sitemapXml.matchAll(locRegex)].map((m) => m[1]);

  assert.ok(locs.length > 0, "Sitemap must contain URLs");

  for (const loc of locs) {
    assert.ok(
      loc.startsWith("https://mutunda.me/"),
      `Sitemap URL must start with canonical host: ${loc}`
    );
    let pathname = loc.replace("https://mutunda.me/", "");
    if (pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }

    const candidate = pathname === ""
      ? join(DIST_DIR, "index.html")
      : join(DIST_DIR, pathname, "index.html");

    const exists = await fileExists(candidate);
    assert.ok(exists, `Sitemap URL ${loc} does not correspond to ${candidate}`);
  }
});
