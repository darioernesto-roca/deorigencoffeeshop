# Professional Greenfield Build Approach

## Purpose

This document describes how I would build De Origen Coffee Shop from zero as a production application. It is a greenfield recommendation, not a proposal to rewrite the current repository in place. The existing HTML, Pug, Handlebars, and EJS applications should remain intact as reference implementations; the existing `next/` direction is the closest match to the architecture recommended here.

The design intentionally starts as a **modular monolith**. A coffee shop site does not need microservices on day one. One deployable application, one relational database, and well-defined internal boundaries provide lower cost and simpler operations while leaving room to extract services if measured scale or team ownership later requires it.

## Product assumptions to validate first

Before selecting implementation details, I would run a short discovery phase with the owner and document answers to these questions:

- Is the site informational, a browsable catalog, or a complete online store?
- Are prices, stock, and categories managed by staff? How often do they change?
- Is checkout required? If so, which countries, currencies, taxes, delivery methods, and payment provider apply?
- Does an existing point-of-sale or inventory system own product and stock data?
- Who maintains editorial content such as the home page, store details, FAQs, and promotions?
- What personal information is collected through contact, newsletter, account, and order flows, and how long may it be retained?
- Which languages, accessibility standard, traffic level, availability target, and response-time target are required?
- What are the launch date, budget, expected team size, and post-launch support responsibilities?

These decisions change the correct solution. In particular, if online commerce is required, I would integrate a mature commerce platform or payment provider rather than implement card handling, tax, refunds, and fulfillment from scratch.

## Recommended technology stack

| Layer | Choice | Reason |
| --- | --- | --- |
| Language | TypeScript with strict compiler settings | One typed language across browser, server, domain, and tests reduces contract drift and catches common errors before runtime. |
| Web framework | Next.js App Router with React and Server Components by default | Provides routing, server rendering, static generation, metadata, image optimization, route handlers, and a strong deployment path in one framework. |
| Styling | CSS Modules plus global design tokens in CSS custom properties | Keeps styles locally scoped and dependency-light while retaining the current site's visual language. A component library can be added only if product needs justify it. |
| Validation | A schema validator at every external boundary | Produces a single executable definition for form, API, environment, and persistence inputs. Select and pin the package only after the repository's dependency-security review. |
| Database | Managed PostgreSQL | Product/category/contact/order data is relational, benefits from constraints and transactions, and is portable across hosting vendors. |
| Data access | A thin repository layer over a typed SQL query builder or ORM | Centralizes queries and transactions without allowing persistence details to leak into pages and components. Select the tool after migration, serverless-connection, and advisory review. |
| Media | Object storage plus a CDN; Next.js image optimization for presentation | Keeps large images and videos out of application deployments and supports responsive delivery and cache control. |
| Authentication | Managed identity or a mature session-based authentication solution | Avoids custom password and recovery logic. Administrative access should support MFA and role-based authorization. |
| Email | Transactional email provider called only from the server | Supports reliable contact acknowledgements and operational notifications without exposing credentials. |
| Payments, if required | Hosted checkout from a PCI-compliant payment provider | Keeps card data outside this application's systems and reduces security/compliance scope. |
| Testing | Node test runner or Vitest for units, Testing Library for components, Playwright for critical browser journeys | Covers business rules, rendering behavior, accessibility semantics, and real user flows at appropriate layers. |
| Package management | pnpm with one workspace and one committed frozen lockfile | Matches repository policy and makes installations reproducible across local development and CI. |
| Deployment | Managed Next.js runtime plus managed PostgreSQL and object storage | Reduces operational burden while supporting preview deployments, rollback, backups, and observability. Keep provider-specific code behind adapters. |

I would pin exact dependency versions, commit `pnpm-lock.yaml`, keep install scripts disabled unless explicitly reviewed, and investigate package age, provenance, and advisories before introducing any dependency. Technology choices above describe capabilities rather than approving a package automatically.

## Why PostgreSQL instead of MongoDB or MySQL

PostgreSQL would be my default because the likely domain contains clear relationships: categories contain products, products have prices and availability, contact requests have statuses, and orders contain line items and payment/fulfillment state. Foreign keys, unique constraints, check constraints, and transactions enforce these rules even when application code fails.

MongoDB remains reasonable for a read-heavy, loosely structured content catalog, but the current application does not demonstrate a need for schema flexibility that outweighs relational integrity. MySQL is also technically capable; PostgreSQL is a preference, not a requirement. If an existing business system already uses MySQL reliably, integration cost and team expertise may justify keeping it.

For primarily editorial content, I would consider a headless CMS as the owner of pages and promotions while PostgreSQL remains the owner of operational records. I would not add a CMS until non-developers genuinely need frequent content editing.

## High-level architecture

```text
Browser / search crawler
        |
        v
CDN + web application firewall
        |
        v
Next.js application (single deployable)
  ├─ App Router pages and layouts
  ├─ Server Components (reads/rendering)
  ├─ Server Actions or route handlers (mutations/integrations)
  ├─ Application services (use cases)
  ├─ Domain rules and schemas
  └─ Infrastructure adapters
       ├─ PostgreSQL repository
       ├─ Object storage / CDN
       ├─ Email provider
       ├─ Identity provider
       └─ Payment provider (optional)
```

The browser never connects directly to the database, email provider, or privileged storage APIs. Pages and components call application services on the server. Application services depend on interfaces, and infrastructure adapters implement those interfaces. This keeps business rules testable and prevents framework or vendor APIs from spreading through the codebase.

### Request flow

1. The CDN serves cacheable static assets and forwards dynamic requests.
2. Next.js renders public pages on the server or from a pre-generated cache.
3. An incoming mutation is authenticated where required, rate-limited, checked for origin/CSRF risk, size-bounded, and schema-validated.
4. An application service authorizes the action and applies business rules.
5. A repository runs parameterized queries inside a transaction when multiple writes must succeed together.
6. The response exposes a deliberate DTO rather than a database record.
7. Structured logs and metrics record outcome, duration, and correlation ID without recording secrets or unnecessary personal data.

## Repository layout

I would use a pnpm workspace even if the initial application is the only deployable. It makes boundaries explicit without requiring separately deployed services.

```text
.
├── apps/
│   └── web/
│       ├── public/
│       ├── src/
│       │   ├── app/                 # Next.js routes, layouts, metadata, errors
│       │   ├── components/          # Reusable presentation components
│       │   ├── features/            # Feature UI and orchestration
│       │   ├── server/              # Server-only composition and adapters
│       │   └── styles/              # Tokens and global styles
│       └── tests/
├── packages/
│   ├── domain/                      # Entities, value objects, schemas, policies
│   ├── database/                    # Schema, migrations, repositories
│   ├── ui/                          # Shared primitives only when reuse exists
│   └── config/                      # Shared lint and TypeScript configuration
├── docs/
│   ├── adr/                         # Architecture decision records
│   ├── runbooks/                    # Deploy, rollback, restore, incident guides
│   └── api/                         # Contracts and error conventions
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

Do not create packages speculatively. If only the web app uses a module, keep it under `apps/web`. Extract a package when it has a real reuse or ownership boundary. Use dependency rules so domain code cannot import Next.js, React, database drivers, or provider SDKs.

## Application layering and responsibilities

### Presentation layer

- Route layouts, loading states, error boundaries, metadata, and accessible page composition.
- Server Components for read-heavy UI; Client Components only for browser state, event handling, or browser-only APIs.
- No direct SQL/ORM calls and no business decisions embedded in JSX.
- Semantic HTML first; reusable components preserve keyboard, focus, labeling, and error behavior.

### Application layer

- Use cases such as `ListPublishedProducts`, `SubmitContactRequest`, `UpdateProduct`, and `PublishCategory`.
- Transaction boundaries, authorization checks, idempotency, and orchestration of repositories/providers.
- Accepts validated commands and returns deliberate result objects or typed application errors.

### Domain layer

- Product/category/contact/order rules independent of React, Next.js, and the database.
- Value objects for money, slug, email address, availability state, and identifiers where they prevent invalid states.
- Schemas/contracts for external inputs and public outputs.

### Infrastructure layer

- Parameterized database access, migrations, storage, email, identity, payment, logging, and clock/ID adapters.
- Vendor-specific failures are translated into application errors.
- Secrets and server-only modules are guarded from client imports.

This separation is not intended to produce ceremony for simple reads. A small read-only page can use a server-side query service directly. Complex mutations should always pass through an application service so authorization and invariants have one home.

## Initial domain model

The model should be confirmed during discovery, but this is a practical starting point.

### `categories`

- `id`: UUID or sortable unique identifier, primary key
- `name`: required display name
- `slug`: required, unique, URL-safe
- `description`: optional, length-bounded
- `status`: draft or published
- `sort_order`: non-negative integer
- `created_at`, `updated_at`: UTC timestamps

### `products`

- `id`: primary key
- `category_id`: foreign key to `categories`
- `name`, `slug`, `description`: validated content; slug unique
- `price_minor`: integer in the smallest currency unit; never a floating-point price
- `currency`: supported ISO currency code
- `availability`: explicit enum rather than arbitrary text
- `image_key`, `image_alt`: storage reference and meaningful alternative text
- `status`: draft, published, or archived
- `created_at`, `updated_at`: UTC timestamps

### `contact_requests`

- `id`: primary key
- `name`, `email`, `phone`, `message`: normalized and length-bounded
- `status`: new, in_progress, resolved, or spam
- `consent_version`: policy version accepted when legally required
- `created_at`, `resolved_at`: UTC timestamps
- retention/deletion date derived from the documented privacy policy

### Optional commerce tables

If checkout is in scope, add `orders`, immutable `order_items`, payment-provider references, and append-only status history. Store the price/currency snapshot on each order item; do not recalculate historical orders from the current product price. Never store raw card data.

Database migrations are forward-reviewed source files applied by a deployment job, never ad hoc startup mutations. Seed data is idempotent and restricted to controlled environments. Production administration uses authenticated, audited operations rather than a public bulk endpoint.

## Routes and rendering strategy

| Route | Rendering | Data policy |
| --- | --- | --- |
| `/` | Static generation with explicit revalidation | Published featured products and editorial content only. |
| `/categories` | Static generation or incremental revalidation | Published categories, deterministic order. |
| `/categories/[slug]` | Incremental static generation | Published category and paginated public products. |
| `/products/[slug]` | Incremental static generation | Published product; return a real 404 for missing/unpublished slugs. |
| `/about` | Static generation | Versioned editorial content. |
| `/contact` | Static shell plus server mutation | Validate and rate-limit submissions; use a generic success response to limit enumeration. |
| `/admin/*` | Dynamic, no public caching | Authentication, MFA where supported, role authorization, audit events. |
| `/api/health/live` | Dynamic | Process liveness only; no sensitive dependency details. |
| `/api/health/ready` | Dynamic and restricted as appropriate | Readiness of required dependencies. |

Cache invalidation should follow content changes: after an authorized publish operation, revalidate affected product, category, sitemap, and listing paths. Avoid arbitrary short revalidation intervals when event-driven invalidation can provide fresher content with less database traffic.

The public URL decision must be made once. Because the current variants use `/about-us` and Next.js uses `/about`, select a canonical route and implement a tested permanent redirect for the other path only after launch URLs are approved.

## API and mutation design

Prefer server-rendered reads rather than exposing an API solely for the application's own pages. Create route handlers when a browser interaction, webhook, or external consumer genuinely needs an HTTP contract.

Every mutation should follow the same pipeline:

1. enforce method and content type;
2. apply request-size and timeout limits;
3. authenticate the actor where required;
4. protect cookie-authenticated requests against CSRF and validate expected origin;
5. rate-limit by appropriate actor and network signals;
6. parse and validate an allowlisted schema;
7. authorize the specific resource/action;
8. execute the use case, transaction, and audit event;
9. return an intentional response DTO with a stable error code and correlation ID.

Use resource-oriented administrative operations rather than a generic `/data` endpoint. Bulk imports should be authenticated jobs with file/row limits, dry-run validation, idempotency keys, progress reporting, audit records, and explicit rollback behavior. Destructive collection-wide HTTP operations should not exist.

Webhook routes additionally require raw-body signature verification, replay protection, event deduplication, fast acknowledgement, and asynchronous processing for slow side effects.

## Security and privacy baseline

Security is part of the initial acceptance criteria, not a final launch task.

- Deny administrative access by default; use roles such as viewer, catalog_editor, and administrator rather than a single shared credential.
- Require MFA for privileged users when the identity provider supports it.
- Store secrets only in the deployment secret manager. Validate configuration at startup and never expose server secrets through public environment prefixes.
- Use secure, `HttpOnly`, appropriately scoped `SameSite` cookies for sessions; rotate sessions after privilege changes.
- Configure CSP from an asset inventory, `frame-ancestors`, content-type protection, a restrictive referrer policy, and HSTS at the HTTPS edge.
- Keep CORS same-origin unless a documented external client requires narrowly allowed origins and methods.
- Use parameterized database queries, least-privilege database roles, encrypted transport, and managed backups.
- Validate upload type, size, and dimensions; generate storage keys server-side; serve uploads from a separate media origin where practical.
- Redact authorization data, cookies, secrets, and personal information from logs. Do not send production data to development or preview environments.
- Define data purpose, consent, retention, export, and deletion procedures before collecting customer information.
- Scan dependencies, repository secrets, source, and deployable artifacts in CI. Triage findings rather than automatically suppressing them.
- Write a threat model for authentication, administration, contact spam, inventory manipulation, uploads, checkout, and webhooks before those features ship.

## Accessibility, SEO, and performance

### Accessibility

- Target WCAG 2.2 AA and include it in component acceptance criteria.
- Use semantic landmarks, one clear page heading, labeled controls, inline error associations, keyboard operation, visible focus, and reduced-motion support.
- Test automated rules, keyboard-only flows, zoom/reflow, contrast, and representative screen-reader journeys.
- Never use color alone for stock, validation, or selection state.

### SEO

- Generate unique titles, descriptions, canonical URLs, Open Graph metadata, sitemap, and robots policy from validated site configuration.
- Add relevant structured data only when page content supports it; validate generated markup.
- Preserve stable product/category slugs and maintain a redirect ledger when URLs change.
- Return correct status codes; do not render a soft-404 product page with status 200.

### Performance

- Establish measured mobile budgets for JavaScript, images, fonts, Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift.
- Default to Server Components and avoid client-side fetching for content available during server rendering.
- Serve responsive images with dimensions, efficient formats, sensible quality, and below-fold lazy loading; do not lazy-load the primary hero image.
- Subset/self-host fonts when licensing permits and preload only critical assets.
- Treat videos as optional enhancements: provide posters, avoid forced autoplay with sound, and respect reduced motion/data usage.
- Monitor real-user Web Vitals rather than relying only on laboratory scores.

## Testing strategy

Use a test pyramid based on risk rather than pursuing coverage percentage alone.

### Unit tests

- Domain validation and state transitions
- Money and availability behavior
- Slug and environment configuration rules
- Authorization policies and public DTO mapping

### Integration tests

- Repository queries against an isolated PostgreSQL database
- Migrations from a clean database and from the previous supported version
- Transactions, uniqueness, pagination, sorting, and not-found behavior
- Email/storage/payment adapters behind local fakes or provider test environments
- Route validation, authorization, CSRF/origin checks, rate-limit behavior, and non-leaking errors

### Browser tests

- Navigate home, category, and product pages
- Submit valid and invalid contact requests
- Keyboard navigation and focus behavior
- Sign in and perform permitted admin operations; verify forbidden roles cannot do so
- Checkout success, decline, cancellation, duplicate webhook, and retry paths if commerce exists

### Non-functional checks

- Accessibility automation plus scheduled manual review
- Responsive visual regression for critical templates
- Lighthouse/performance budgets on stable preview builds
- Dependency, secret, static-analysis, and container/artifact scanning
- Backup restoration and rollback drills outside the normal request test suite

Tests use deterministic factories and isolated data. They must not call production services or rely on shared mutable staging records.

## CI/CD and environments

### Pull-request pipeline

1. verify repository policy and frozen pnpm lockfile;
2. format/lint and detect unused code;
3. typecheck;
4. run unit and integration tests;
5. build the production application;
6. run security and secret scans;
7. deploy an isolated preview with synthetic data;
8. run browser, accessibility, and smoke checks against the preview.

Pin third-party CI actions to immutable commit SHAs and grant each job minimum permissions. Secrets must not be available to untrusted pull-request code. Database migrations receive explicit review and are tested both forward and, where supported, for operational rollback compatibility.

### Environments

- **Local:** local/test services and synthetic data; no production credentials.
- **Preview:** isolated build per pull request; short-lived or isolated data and restricted external side effects.
- **Staging:** production-like topology for release candidates and migration rehearsal.
- **Production:** protected deployment, least-privilege credentials, managed backups, monitoring, and an audited release history.

Use progressive rollout when supported. A release is not complete until post-deploy smoke checks pass. Roll back application code promptly on regression; use forward database fixes when a destructive migration makes binary rollback unsafe.

## Observability and operations

- Emit structured logs with timestamp, severity, service version, environment, correlation ID, route template, outcome, and duration.
- Record request/error/latency/saturation metrics plus business signals such as contact delivery failures and payment webhook backlog.
- Trace database and external-provider calls when needed, sampling responsibly and excluding sensitive payloads.
- Alert on user-impacting symptoms and service-level objectives, not every individual exception.
- Maintain dashboards and runbooks for database unavailability, email failure, elevated errors, slow pages, payment/webhook issues, and suspected account compromise.
- Automate backups and point-in-time recovery where available; schedule restore drills and record recovery time and recovery point results.
- Define ownership, escalation, status communication, rollback, and post-incident review procedures before launch.

## Delivery plan

### Phase 0 — discovery and architecture

**Deliverables:** product scope, content inventory, route map, wireframes, domain glossary, data ownership, threat model, privacy requirements, NFRs, provider decisions, architecture decision records, release plan.

**Exit criteria:** checkout/POS/CMS scope is unambiguous; canonical routes and data owners are approved; no critical security or compliance question is unresolved.

### Phase 1 — engineering foundation

**Deliverables:** pnpm workspace, Next.js application, strict TypeScript/lint rules, design tokens, accessible layout primitives, environment schema, PostgreSQL migrations, local development setup, CI, preview deployment, logging, liveness/readiness.

**Exit criteria:** a new contributor can run documented setup; frozen install, typecheck, tests, and production build pass; preview and rollback paths are demonstrated.

### Phase 2 — public experience

**Deliverables:** home, categories, product detail, about, responsive media, metadata, sitemap/robots, empty/error/loading/not-found states, accessibility and performance baselines.

**Exit criteria:** content owners approve presentation; supported devices and browsers pass; SEO, accessibility, and performance budgets pass.

### Phase 3 — contact and administration

**Deliverables:** protected admin, roles, audited catalog management, validated/rate-limited contact flow, email delivery/retry policy, privacy retention job, event-driven cache invalidation.

**Exit criteria:** authorization tests cover each action; no public bulk mutation exists; contact failures are observable and recoverable; staff complete acceptance testing.

### Phase 4 — commerce, only if required

**Deliverables:** hosted checkout, server-authoritative price calculation, immutable order snapshots, signed/idempotent webhooks, fulfillment/refund workflows, tax/shipping integration, commerce-specific monitoring and support runbooks.

**Exit criteria:** happy, decline, cancellation, retry, duplicate, refund, and reconciliation paths pass in provider test mode; no card data enters application logs or storage.

### Phase 5 — launch and operate

**Deliverables:** content/data migration rehearsal, redirect map, production configuration review, backup restore evidence, load/smoke testing, launch checklist, rollback exercise, dashboards/alerts, owner training.

**Exit criteria:** production smoke checks pass, monitoring is active, recovery procedures have been exercised, and operational ownership is accepted.

## Important trade-offs and rejected defaults

- **Modular monolith over microservices:** fewer deployments and failure modes. Extract a service only for proven scale, isolation, or team-ownership needs.
- **Relational database over document-first storage:** better fit for integrity and transactional workflows. Reconsider if an external platform already owns all structured data.
- **Server rendering over SPA-by-default:** less browser JavaScript, stronger SEO, and direct access to server data. Add client state only for interactions that require it.
- **Managed services over self-hosting:** smaller operational burden. The trade-off is cost and vendor dependency, mitigated through adapters, exports, backups, and documented recovery.
- **Hosted checkout over custom payment UI:** substantially smaller compliance and security surface, with less visual control.
- **No CMS by default:** code-managed content is simplest at low update frequency. Add a CMS when editorial workflow—not fashion—requires it.
- **No public generic CRUD API:** purpose-built use cases are easier to authorize, validate, audit, and evolve.

## Greenfield definition of done

The application is professionally ready for launch when:

- approved user journeys work across defined devices and browsers;
- public and administrative routes meet documented accessibility, SEO, and performance targets;
- database constraints, application validation, authorization, rate limits, and audit trails cover every mutation;
- no secret, raw card data, or unnecessary personal data is present in code, client bundles, logs, or test fixtures;
- frozen pnpm install, lint, typecheck, unit/integration/browser tests, security scans, and production build pass in CI;
- migrations have been rehearsed with realistic data and post-deploy smoke checks are automated;
- dashboards and actionable alerts are active;
- backup restoration and application rollback have been exercised successfully;
- privacy retention/deletion and incident-response procedures have named owners;
- architecture decisions, environment configuration, deployment, rollback, and support runbooks are current.

## First decisions I would ask the owner to approve

1. Confirm whether the launch is catalog/contact only or includes checkout.
2. Confirm Next.js and strict TypeScript as the single production application while preserving current variants as references.
3. Confirm PostgreSQL as the system of record, or identify the existing POS/CMS that owns catalog data.
4. Select the deployment, database, identity, email, storage, and optional payment providers based on region, budget, data residency, and team experience.
5. Approve canonical URLs, languages, accessibility target, privacy/retention rules, availability target, and performance budgets.
6. Approve the modular-monolith boundary and phased delivery plan before feature implementation begins.
