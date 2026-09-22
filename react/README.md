# De Origen React implementation

This folder contains a standalone React single-page implementation of the De Origen Coffee Shop website. It preserves the repository's existing HTML, Pug, Handlebars, EJS, and Next.js variants while providing a focused client-rendered React comparison.

## What is included

- Responsive Home, Menu, Our Story, Visit/Contact, and Not Found views.
- Shared React components for navigation, footer, page introductions, links, and product cards.
- Lightweight browser-history routing without an additional routing dependency.
- Searchable in-memory product catalog.
- Accessible navigation, form labels, status feedback, keyboard focus styles, semantic landmarks, and reduced-motion support.
- A demonstration contact form. It validates in the browser and confirms submission locally; it deliberately does **not** transmit or persist personal information.
- Unit tests for catalog integrity and filtering.
- A Vite production build with source maps.

The application imports the existing media from `html/img` and `html/vids` at build time. This avoids committing duplicate multi-megabyte assets while allowing Vite to fingerprint them in production output. Moving or deleting those source assets will break the corresponding build imports.

## Requirements

- Node.js 18.18 or newer.
- pnpm 10.10.0 (the version declared in `package.json`).

From this directory:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Vite prints the local development URL, normally `http://localhost:5173`.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start Vite's development server. |
| `pnpm build` | Create an optimized production bundle in `dist/`. |
| `pnpm preview` | Serve the production bundle locally for a final smoke test. |
| `pnpm test` | Run catalog tests with Node's built-in test runner. |

Do not commit `node_modules/` or `dist/`. Both are generated locally and covered by the repository ignore rules.

## Architecture

```text
react/
├── docs/ARCHITECTURE.md     # Design decisions, routes, limits, and extension notes
├── src/
│   ├── components/          # Reusable presentational and navigation components
│   ├── data/catalog.js      # Static catalog and pure search function
│   ├── pages/               # Route-level components
│   ├── App.jsx              # Route selection and browser-history integration
│   ├── main.jsx             # React root
│   └── styles.css           # Design tokens and responsive styling
├── tests/                   # Node unit tests
├── index.html               # Vite HTML entry point
├── package.json
└── vite.config.js
```

## Deployment

Run `pnpm build`, then deploy the contents of `dist/` to a static host. Configure the host to rewrite unknown application paths (such as `/about`) to `/index.html`; React will select the correct view after the entry document loads. Static asset requests should retain their normal 404 behavior.

Because this implementation is client-rendered, page-specific metadata is not produced server-side. Prefer the repository's Next.js app when server rendering, route metadata, incremental generation, backend operations, or search-engine crawl guarantees are production requirements.

## Data and privacy

Catalog data is illustrative and lives in source control. The contact form is intentionally client-only. Before connecting it to a real endpoint:

1. define and validate a strict server-side input schema;
2. add rate limiting and anti-abuse controls;
3. document retention, consent, and deletion rules;
4. return generic public errors without leaking internal details;
5. add an accessible failure state and integration tests.

Never put API keys, database credentials, or private service tokens in `VITE_` environment variables: Vite exposes those values to the browser bundle.
