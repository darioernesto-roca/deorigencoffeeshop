# De Origen Angular implementation

This folder contains a standalone Angular implementation of the De Origen Coffee Shop. It adds an Angular comparison without replacing the repository's HTML, Pug, Handlebars, EJS, React, or Next.js variants.

## Included functionality

- Standalone Angular components with strict TypeScript and strict template checking.
- Lazy-loaded Home, Menu, Our Story, Contact, and Not Found routes.
- An `/about-us` compatibility redirect to the canonical `/about` route.
- Angular signals for menu disclosure, catalog search, derived results, and form status.
- Angular Forms for accessible, client-side contact-form validation.
- Responsive layouts, visible keyboard focus, semantic landmarks, and reduced-motion handling.
- Existing repository images and videos, exposed through `public/assets` without duplicating the large media files.

The contact form is deliberately a user-interface demonstration. It does not transmit or persist personal information and says so after submission.

## Requirements and commands

- Node.js 20.19 or newer.
- pnpm 10.10.0.

```bash
cd angular
corepack enable
pnpm install --frozen-lockfile
pnpm start
```

| Command | Purpose |
| --- | --- |
| `pnpm start` | Run the Angular development server, normally at `http://localhost:4200`. |
| `pnpm build` | Compile, optimize, and emit the production application into `dist/`. |
| `pnpm watch` | Continuously compile the development configuration. |
| `pnpm test` | Run configured Angular unit tests once. |

`node_modules/` and `dist/` are generated and must not be committed. Dependencies use exact versions, and `pnpm-lock.yaml` is the reproducible dependency graph.

## Structure

```text
angular/
├── docs/ARCHITECTURE.md
├── public/assets -> ../../html
├── src/
│   ├── app/
│   │   ├── components/       # Shared header, footer, hero, and product UI
│   │   ├── data/             # Typed catalog and pure filtering function
│   │   ├── pages/            # Lazy route components
│   │   ├── app.config.ts     # Root providers
│   │   ├── app.routes.ts     # Route and title definitions
│   │   └── app.component.ts  # Persistent application shell
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
└── tsconfig*.json
```

## Deployment

Run `pnpm build` and deploy the generated browser output. Configure the host to fall back to `index.html` for application routes such as `/about`, while leaving real asset failures as 404 responses. Angular's router selects the route after the entry document loads.

This implementation is client rendered. Use the existing Next.js direction, or explicitly add Angular server-side rendering, if server-rendered route metadata and crawler-ready HTML are production requirements.

## Connecting real services

Before connecting the contact form or catalog to a backend, define validated contracts, server-side authorization where needed, request limits, anti-abuse controls, generic public errors, privacy and retention rules, and integration tests. Never put credentials in browser source, `public/`, or client-readable environment configuration.
