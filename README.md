# mutunda.me

The source for Fortunat Mutunda's portfolio and technical writing, built as a
static site with [Astro](https://astro.build/).

## Requirements

- Node.js 26
- npm

## Development

Install the locked dependencies and start the local development server:

```sh
npm ci
npm run dev
```

## Quality checks

```sh
npm run check
npm test
npm run build
```

The production site URL defaults to `https://mutunda.me`. Set `SITE_URL` when
building a preview for another origin:

```sh
SITE_URL=https://preview.example.com npm run build
```

The static output is written to `dist/` and can be inspected with
`npm run preview`.
