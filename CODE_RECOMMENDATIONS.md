# Code Quality and Hardening Recommendations

## Scope and approach

This review covers the four existing implementations (`html/`, `pug/`, `hdb/`, and `ejs/`) and the emerging canonical `next/` application. It is a recommendation document only: no runtime behavior or architecture is changed.

Recommendations are ordered by risk and implementation dependency. Each item records the observed root cause, why the proposed change works, and the main compatibility or operational risks. Preserve the current variants as learning/reference implementations while applying production controls first to the canonical Next.js app, as proposed in `NEXT_STEPS_IMPLEMENTATION_GUIDE.md`.

## Executive summary

The highest-risk issue is the unauthenticated EJS `/data` API: any reachable client can read, bulk insert, bulk update, or delete the entire product and category collections. The API also accepts unbounded bodies and returns internal database error text. The dormant Handlebars product router contains SQL built by interpolation and should not be mounted until it is redesigned.

The repository also has inconsistent dependency management: the root documentation and three legacy applications use npm/package locks, while `next/` declares pnpm but has no committed `pnpm-lock.yaml`. There is no shared CI baseline, and the Express services start listening before confirming database readiness. Address these gaps before treating any implementation as production-ready.

## Priority 0 — block production exposure

### 1. Protect or remove the EJS mutation API

**Evidence:** `ejs/routes/index.js` mounts `/data` publicly. `ejs/routes/data.routes.js` exposes unauthenticated `POST`, `PUT`, and `DELETE`; `DELETE /data` calls `deleteMany()` without a filter.

**Root cause:** administrative seed/catalog operations are implemented as public application routes with no authorization boundary or environment guard.

**Recommendation:**

- Do not expose these handlers in production until an explicit administrator authentication and authorization policy exists.
- Prefer an offline, idempotent seed/migration command for bulk initialization instead of an HTTP endpoint.
- If an API remains necessary, use resource-scoped routes (for example, `/products/:id`), least-privilege database credentials, deny-by-default authorization middleware, and an audit trail.
- Require deliberate confirmation for destructive bulk operations; avoid a collection-wide delete endpoint entirely.
- Add integration tests proving anonymous requests receive `401`/`403` and cannot mutate data.

**Why it works:** removing bulk maintenance from the public request path eliminates the easiest route to full catalog compromise. Authentication, resource-level authorization, and audit events provide defense in depth for operations that remain.

**Risks/side effects:** existing scripts or demos that call `/data` will stop working and should be migrated to the seed command. Authentication changes require a documented operator workflow and secure secret/session management.

### 2. Validate and bound every untrusted request

**Evidence:** `ejs/index.js`, `hdb/index.js`, and `pug/index.js` accept URL-encoded and JSON bodies without explicit size limits. The EJS data routes pass request arrays directly to Mongoose operations, while the schemas have no required fields, bounds, enums, or string-length constraints.

**Root cause:** transport parsing is treated as domain validation, and the persistence models accept overly broad input.

**Recommendation:**

- Define one canonical `Product` and `Category` contract with allowlisted fields, required values, maximum string lengths, price bounds, stock-status enums, array/item limits, and strict unknown-field rejection.
- Validate at the HTTP boundary before database work and return stable `400`/`422` problem responses without internal details.
- Configure parsers explicitly, for example `express.json({ limit: '100kb', strict: true })` and a suitably small `express.urlencoded` limit; remove duplicate `body-parser`/`express.json()` parsing.
- Enable strict schema behavior and timestamps, add indexes only for demonstrated query patterns, and use `{ runValidators: true }` for updates.
- Validate identifiers before queries and use atomic/bulk operations only after the complete payload passes validation.

**Why it works:** boundary validation prevents malformed, oversized, and unexpected values from reaching the database; schema validation remains a second line of defense.

**Risks/side effects:** strict rules can reject legacy `data.json` records. Validate and normalize existing data before enforcement, and version API contracts if external consumers exist. Avoid adding a validation dependency until its age, advisories, and install behavior have been reviewed under the repository dependency policy.

### 3. Keep the dormant Handlebars product router disabled and replace interpolated SQL

**Evidence:** `hdb/routes/products-.routes.js` interpolates `req.params.id` into `UPDATE` and `DELETE` statements and passes the full request body into `SET ?`. It also imports `../db`, which does not exist, and is not mounted by `hdb/routes/index.js`.

**Root cause:** unfinished CRUD code lacks parameterization, input allowlisting, dependable error handling, and a valid database import.

**Recommendation:** do not mount this router as written. If the feature is needed, rebuild it using `hdb/config/db.js`, placeholder parameters for every value (including the ID), a strict field allowlist, integer ID validation, authorization, and controller/service separation. Otherwise delete the dead file after confirming it has no intended teaching purpose.

**Why it works:** parameterized SQL keeps input out of SQL syntax, while allowlisting prevents mass assignment of fields the caller should not control.

**Risks/side effects:** changing table/field assumptions can break a local demo database. Capture the schema and add database integration tests before enabling the route.

### 4. Establish safe configuration and secret handling

**Evidence:** `hdb/config/db.js` hardcodes an empty database password instead of reading a password variable. Only `next/.env.example` exists, although the legacy services require database settings. The root `.gitignore` ignores `.env` but not common variants such as `.env.local`.

**Root cause:** configuration contracts are incomplete and database startup does not fail closed when required values are absent.

**Recommendation:**

- Define per-app `.env.example` files containing names and safe dummy values only; include `DB_PASSWORD` for Handlebars and `MONGODB_URI` for EJS.
- Validate required server variables at startup and terminate with a concise error before accepting traffic. Never log connection strings, credentials, request authorization values, or full sensitive payloads.
- Expand ignore rules for local environment variants while deliberately retaining `!.env.example`.
- Use a non-root, least-privilege database account and a managed secret store in deployed environments; rotate any credential suspected of prior exposure.
- Keep server-only variables free of the `NEXT_PUBLIC_` prefix. Validate `NEXT_PUBLIC_SITE_URL` as an absolute `http:`/`https:` URL rather than only checking that it is non-empty.

**Why it works:** an explicit, validated contract prevents accidental insecure defaults and makes deployment failures immediate rather than partial or silent.

**Risks/side effects:** fail-fast validation changes local startup requirements. Document all variables and provide safe development defaults only where they cannot weaken production.

## Priority 1 — harden service behavior

### 5. Make startup, shutdown, and database failures deterministic

**Evidence:** all Express apps call `listen()` before route setup is complete in source order. EJS logs a MongoDB connection failure and continues serving; Handlebars returns after logging a MySQL connection failure and also continues. Route callbacks throw database errors, which can terminate the process.

**Root cause:** application construction, dependency initialization, and process lifecycle are coupled without a readiness contract.

**Recommendation:** export an app factory for tests, register middleware/routes/error handlers first, await required database connectivity, and only then start the HTTP listener. Add `SIGTERM`/`SIGINT` handling that stops new requests, drains the server, closes database connections, and exits with a bounded timeout. Add separate liveness and readiness checks; readiness must fail when a required dependency is unavailable.

**Why it works:** traffic is accepted only when the service is usable, and controlled shutdown reduces dropped requests and corrupted work during deployments.

**Risks/side effects:** environments that intentionally render without a database must explicitly define fallback behavior; do not silently mix degraded and ready states.

### 6. Add centralized, non-leaking error handling and structured logs

**Evidence:** the EJS data routes concatenate `err.message` into `500` responses, while other routes log raw error objects. Handlebars controllers throw from asynchronous database callbacks. None of the Express apps defines a final 404 or error middleware.

**Root cause:** each route handles failures independently and there is no stable public error contract or logging/redaction policy.

**Recommendation:** forward operational errors to one final error middleware, return generic production messages with a request/correlation ID, and log structured server-side context with explicit redaction. Add a 404 handler after routes. Distinguish expected client/database errors from programmer errors, and configure process-level monitoring rather than attempting to continue after an unknown fatal state.

**Why it works:** centralized policy prevents stack traces and database details from leaking while producing consistent, diagnosable responses.

**Risks/side effects:** generic messages reduce browser-visible debugging detail; retain detailed local logs in development, never in the response.

### 7. Apply web security controls deliberately

**Evidence:** the Express entry points contain no explicit security headers, cache policy, origin policy, abuse protection, or proxy configuration. The site loads Google Fonts from CSS, and media/static files are served with default Express behavior.

**Recommendation:**

- Define a Content Security Policy from an inventory of required sources; self-host fonts where licensing and project goals permit, or narrowly allow the required Google font origins.
- Set appropriate headers including `X-Content-Type-Options`, `Referrer-Policy`, frame protection via CSP `frame-ancestors`, and HSTS only at an HTTPS production edge.
- Set an explicit CORS policy. Same-origin APIs generally should not emit permissive cross-origin headers.
- Add CSRF protection to cookie-authenticated mutations and validate `Origin`/`Host` as an additional signal.
- Rate-limit authentication, contact, search, and mutation endpoints at an infrastructure/shared-store layer; define payload and request timeouts.
- Configure `trust proxy` only for known deployment topology. Set secure, `HttpOnly`, appropriately scoped `SameSite` cookies if sessions are introduced.
- Add conservative caching and immutable fingerprinting for versioned static assets; never cache sensitive responses publicly.

**Why it works:** these controls reduce cross-site attacks, clickjacking, MIME confusion, automated abuse, and accidental data exposure beyond what input validation alone can address.

**Risks/side effects:** an overly strict CSP can block fonts, images, videos, or development tooling. Start in report-only mode, test every variant, then enforce. Incorrect proxy or rate-limit configuration can misidentify all users as one client.

### 8. Make read queries predictable and inexpensive

**Evidence:** EJS home, category, and `/data` handlers call unbounded `find()` queries. The `/data` response returns full Mongoose documents, and bulk updates execute sequentially in loops.

**Recommendation:** select only public fields, add deterministic sorting, enforce server-side pagination and maximum page size, use lean reads where document methods are unnecessary, and avoid exposing internal `_id`/version fields unless the contract requires them. For authorized bulk work, validate the entire batch and use a bounded transaction or bulk write with clear partial-failure semantics.

**Why it works:** bounded query cost resists accidental or malicious resource exhaustion and creates a stable API response contract.

**Risks/side effects:** pagination changes response shape and consumer behavior. Introduce it as a documented API version or migrate callers together.

## Priority 2 — engineering quality and supply chain

### 9. Standardize pnpm without unsafe lockfile churn

**Evidence:** `next/package.json` pins exact versions and declares pnpm, but no `pnpm-lock.yaml` is committed. The legacy packages use version ranges, npm-oriented build scripts, and committed `package-lock.json` files. `README.md` still instructs users to run npm.

**Root cause:** package-manager policy was introduced for Next.js but was not applied consistently across the multi-app repository.

**Recommendation:** plan a reviewed migration to a pnpm workspace with one committed lockfile and exact direct-dependency versions. Replace `"build": "npm install"` with real build commands or remove it, move `nodemon` and Sass to `devDependencies`, and keep production dependencies minimal. Update documentation and CI to use `corepack` plus `pnpm --frozen-lockfile`; never commit `node_modules` or a newly generated `package-lock.json`.

Before changing any dependency, review release age, provenance, maintainers, install scripts, and Socket.dev/GitHub/npm/security advisories. Keep install scripts disabled by default and stop for owner review if pnpm reports an unexpected ignored build script. Automate scheduled audit/update pull requests, but require tests and human approval.

**Why it works:** one immutable dependency graph makes developer and CI builds reproducible and reduces package-manager drift and supply-chain exposure.

**Risks/side effects:** lockfile migration can change transitive versions even without manifest edits. Perform it in an isolated pull request, compare graphs, run every variant, and do not combine it with application changes.

### 10. Add a repository-wide CI quality gate

**Evidence:** only `next/` defines lint, typecheck, and test scripts. The existing environment test imports a TypeScript module from a `.mjs` Node test, which should be verified in the supported Node runtime. No root scripts or CI workflow define required checks.

**Recommendation:** add focused gates in stages:

1. frozen pnpm install and lockfile validation;
2. formatting/linting and `node --check` for legacy JavaScript;
3. Next.js typecheck, unit tests, and production build;
4. route smoke tests for all Express variants with databases mocked or provisioned;
5. integration tests for validation, authorization, 404/500 behavior, and database failure;
6. dependency, secret, and static security scans with reviewed severity policy;
7. accessibility checks and a mobile/desktop performance budget for the canonical UI.

Pin CI actions by immutable commit SHA, grant minimal workflow permissions, avoid exposing secrets to untrusted pull-request code, and retain useful test/build artifacts without retaining secrets.

**Why it works:** repeatable automated gates detect syntax, contract, security, and build regressions before deployment.

**Risks/side effects:** enabling every gate at once can create noisy failures. Record the baseline, fix critical findings first, then ratchet enforcement without blanket suppressions.

### 11. Improve testability and remove dead/duplicate code incrementally

**Evidence:** Express apps instantiate and listen at module load, which makes isolated HTTP tests harder. EJS registers both `bodyParser.json()` and `express.json()`. Several assigned values/imports are unused (`mongoose`, callback `query` values), and Pug declares EJS as its package name and dependency. Generated CSS and source maps are duplicated across variants.

**Recommendation:** separate `createApp()` from `startServer()`, inject data access into controllers, and test handlers without opening a real port. Remove duplicate parsers and unused bindings after tests cover behavior. Correct package metadata and remove genuinely unused dependencies only in a dedicated, audited dependency change. Document whether compiled CSS/maps and duplicated media are intentional artifacts; generate them deterministically rather than editing source and output independently.

**Why it works:** explicit boundaries make unit/integration testing reliable and reduce code paths, dependencies, and artifacts that can drift.

**Risks/side effects:** changing bootstrap exports can affect existing start commands. Preserve `node index.js` behavior and add characterization smoke tests first.

### 12. Define application contracts and parity before feature migration

**Evidence:** route names differ (`/about-us` in legacy variants versus `/about` in Next.js), database naming differs (`products` versus `table_products`), and the Next pages are still migration placeholders. The implementation guide proposes a shared domain contract and parity matrix, but neither is yet present.

**Recommendation:** create versioned domain schemas, route/redirect decisions, status-code/error formats, and a parity matrix before migrating dynamic behavior. Treat Next.js as the production source of truth and legacy variants as reference applications unless a documented decision says otherwise. Add architecture decision records for the database, authentication, deployment platform, and content ownership.

**Why it works:** explicit contracts prevent each rendering implementation from inventing incompatible routes and data semantics.

**Risks/side effects:** redirects and canonical URL changes affect SEO and inbound links. Use permanent redirects only after the destination is stable and update sitemap/canonical metadata together.

## Priority 3 — frontend, accessibility, privacy, and operations

### 13. Build accessibility and privacy into the migration

**Recommendation:** preserve semantic landmarks and heading order; provide meaningful image alternatives; label every form control and error; ensure keyboard access, visible focus, reduced-motion behavior, sufficient contrast, and useful status announcements. Use `type="tel"` rather than the nonstandard `type="phone"`. Test templates and dynamic states with automated tooling plus keyboard/screen-reader review.

Inventory third-party requests (currently including Google Fonts), media, analytics, and form data. Publish retention and consent rules before collecting contact/customer information, minimize collected fields, and avoid logging personal data.

**Why it works:** accessible semantics improve use across assistive technologies, while data minimization reduces both compliance burden and breach impact.

**Risks/side effects:** automated accessibility checks are incomplete, and font self-hosting can affect licensing, caching, or page weight. Include manual acceptance criteria and measure changes.

### 14. Add deployment and incident safeguards

**Recommendation:** use separate development/staging/production credentials and databases; run migrations/seeds as explicit one-off jobs; back up persistent data and test restoration; use non-root runtime users and read-only filesystems where practical; scan the production image and omit dev dependencies. Add structured monitoring for latency, errors, saturation, readiness, and suspicious mutation attempts. Maintain a rollback procedure, ownership/escalation contacts, and post-deploy smoke checks.

**Why it works:** prevention cannot cover every failure; tested recovery, observable services, and limited runtime privileges reduce outage length and blast radius.

**Risks/side effects:** alerts without thresholds create fatigue, and backups that are not restored in drills provide false confidence. Define service-level indicators and exercise the runbook.

## Suggested implementation sequence

1. **Immediately:** prevent public access to EJS mutations; keep the unsafe Handlebars router unmounted; rotate any possibly exposed credentials.
2. **First hardening pull request:** add configuration validation, bounded parsers, centralized errors, startup/readiness behavior, and focused tests without changing page output.
3. **API pull request:** define schemas, authentication/authorization, resource routes, pagination, audit logging, and destructive-operation policy.
4. **Supply-chain pull request:** migrate to a reviewed pnpm workspace/lockfile, exact versions, corrected scripts, and frozen CI installs.
5. **Quality pull requests:** establish CI, route/database tests, security headers, dependency/secret scanning, accessibility checks, and performance budgets.
6. **Migration work:** implement the parity matrix and move production behavior to Next.js route by route, retaining compatibility redirects and rollback capability.

## Definition of done for hardening work

- Anonymous users cannot perform catalog mutations, and authorization tests cover every protected action.
- All request bodies, parameters, and query strings are size-bounded and schema-validated.
- Production errors disclose no stack traces, database messages, secrets, or personal data.
- Services do not become ready before required dependencies, and they shut down gracefully.
- Database accounts and CI/deployment tokens follow least privilege and environment separation.
- A committed pnpm lockfile is used with frozen installs; dependency changes pass advisory and provenance review.
- Lint, syntax, typecheck, unit/integration tests, production build, and smoke tests pass in CI.
- Security headers/CSP are verified against required assets, and critical routes meet documented accessibility and performance targets.
- Restore and rollback procedures have been exercised, not merely documented.
