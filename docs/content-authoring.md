# Content authoring

Writing and project case studies are Astro Content Collections backed by files
in `src/content`. Markdown is the default. Use MDX only when an entry must embed
a custom component; changing `.md` to `.mdx` is otherwise unnecessary.

## Publish a field note

1. Add a Markdown file under `src/content/writing`.
2. Add validated front matter:

   ```yaml
   ---
   title: A useful, specific title
   description: One sentence used on the index and in page metadata.
   date: 2026-10-03
   tags:
     - architecture
   draft: false
   ---
   ```

3. Write the article below the front matter and push the file. The file path
   becomes the URL under `/writing`.

Set `draft: true` while an entry is unfinished. Drafts are validated but are not
included in indexes, tag pages, or production routes. Use `canonicalUrl` only
when another URL is intentionally the canonical source.

## Publish a project

Add a Markdown file under `src/content/projects`. Project front matter requires
`slug`, `title`, `summary`, `description`, `role`, `year`, `featured`, `draft`,
`technologies`, and `links`. The `slug` preserves the public
`/projects/<slug>` URL independently of the filename.

Write the problem, approach, and outcome as ordinary Markdown sections in the
body. The project index, featured homepage entries, and case-study routes all
read the same collection entry.

## Add a tag

Tags need no separate configuration. Adding a tag to a published field note
creates its lowercase, hyphenated page under `/writing/tags` during the build.

## Validate before publishing

Run:

```sh
npm run check
npm test
npm run build
```

Invalid or missing front matter fails validation before deployment.
