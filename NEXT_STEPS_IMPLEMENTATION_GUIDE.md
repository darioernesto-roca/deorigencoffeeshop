# Next.js Step-2 Implementation Guide

## Purpose

This document defines a practical, architecture-first roadmap to evolve this repository into a **deployable Next.js implementation** while preserving and enhancing the existing four versions for comparison and learning.

Current versions in this repository:

1. `html/` (static baseline)
2. `pug/` (Express + Pug)
3. `hdb/` (Express + Handlebars)
4. `ejs/` (Express + EJS + data endpoints)

The goal is to keep these four versions, but make them more structured and production-oriented.

---

## Target Outcome

- Keep all current versions in the repo.
- Introduce a **Next.js implementation as the production-ready/deployable target**.
- Maintain a parity model so all versions can be compared consistently.
- Create a clear migration path from template-based Express apps to a modern app architecture.

---

## Recommended Architecture Principles

## 1) Single deployable canonical app

Use Next.js as the canonical deployable app (frontend + BFF API routes).

- SEO, metadata, routing, image optimization handled in Next.
- Dynamic operations (contact forms, data mutation endpoints) handled through Next server runtime.
- The other versions remain as references and learning variants.

## 2) Shared domain contract across versions

Define common domain models and API semantics before implementation:

- `Product`
- `Category`
- `ContactRequest`
- (optional) `StoreInfo`, `HeroBanner`, `FAQ`

For each model specify:

- required fields
- optional fields
- validation rules
- identifier strategy (`id`, `_id`, `slug`)
- date fields and timezone strategy

This prevents divergence between versions.

## 3) Rendering strategy by route

Decide route-by-route render mode in Next:

- **SSG/ISR**: home, about, categories overview
- **ISR + dynamic params**: product/category detail pages
- **Dynamic/Server actions/API**: contact form, admin operations

Define revalidation windows (e.g., 5 min/15 min/1 hour) based on expected update frequency.

## 4) Data-source strategy

Choose one primary data approach:

1. Managed database (Mongo/Postgres)
2. Headless CMS
3. Hybrid (recommended for many small business sites)

Hybrid example:

- catalog data fetched statically or via ISR
- contact and operational flows dynamic
- media assets in CDN/object storage

## 5) Observability and operations by design

From the beginning, include:

- structured logs
- error monitoring
- uptime checks
- basic analytics
- environment separation (`dev`, `staging`, `prod`)

---

## Repository Strategy

## Keep and enhance four versions

Define explicit role of each version:

- `html/`: static UX baseline and fallback reference.
- `pug/`: server-side templating reference.
- `hdb/`: alternate templating architecture reference.
- `ejs/`: data-oriented Express reference.

Add a new folder when implementation starts:

- `next/`: canonical deployable app.

> Note: Once `next/` is stable, it becomes the source of truth for production behavior.

## Add a parity matrix document

Create and maintain a parity matrix (future file suggestion: `docs/parity-matrix.md`):

Dimensions to track:

- page coverage
- data behavior
- SEO tags
- accessibility checks
- responsiveness
- performance budget
- error states

This matrix should be updated for each milestone.

---

## Suggested Implementation Phases

## Phase 0 — Architecture Decisions (Now)

Deliverables:

- architecture decision record (ADR)
- route map and information architecture
- domain model definitions
- data-flow diagrams
- deployment target decision

Exit criteria:

- team agrees on canonical stack and constraints
- no unresolved backend/data ownership questions

## Phase 1 — Foundation

Deliverables:

- initialize `next/`
- base layout, typography, design tokens
- shared navigation/footer
- environment variable schema and config strategy

Exit criteria:

- app boots in dev and preview
- lint/typecheck/test baseline defined

## Phase 2 — Static Content Migration

Deliverables:

- migrate Home, About, Contact shell, Categories list
- migrate shared assets and optimize images
- define metadata/SEO templates

Exit criteria:

- static pages match existing UX and content
- Lighthouse baseline recorded

## Phase 3 — Data Layer and API

Deliverables:

- implement canonical data access in Next
- route handlers/server actions for data operations
- schema validation for inbound/outbound payloads

Exit criteria:

- data endpoints behave per contract
- robust input validation and error responses

## Phase 4 — Dynamic UX and Hardening

Deliverables:

- contact form end-to-end flow
- error boundaries/loading states
- caching/revalidation tuning
- security headers and basic abuse protection

Exit criteria:

- no critical runtime errors in staging
- performance and accessibility targets met

## Phase 5 — Deployment & Cutover

Deliverables:

- production deployment pipeline
- rollback plan
- runbook (incidents, env variables, smoke checks)

Exit criteria:

- successful production deploy
- monitoring and alerts active

---

## Non-Functional Requirements (NFRs)

## Performance

- Define Lighthouse targets (mobile and desktop).
- Set image size and font loading budgets.
- Track Web Vitals in production.

## Accessibility

- Keyboard navigability for all interactive elements.
- Semantic headings and landmarks.
- Adequate contrast ratios.

## Security

- Input validation everywhere.
- Rate limiting on mutation endpoints.
- Environment variable hygiene (no secret leakage).
- Dependency update policy.

## Reliability

- Error boundaries and graceful fallbacks.
- Health endpoint(s) for uptime monitoring.
- Basic disaster/rollback procedure.

---

## Deployment Blueprint (Recommended)

- Host: Vercel/Render/Fly (choose one; avoid multiple early on)
- Environment strategy:
  - local
  - preview
  - production
- CI gates:
  - install
  - lint
  - typecheck
  - tests
  - build
- Post-deploy smoke checks:
  - homepage loads
  - category list loads
  - contact form submit works
  - key API endpoint returns expected schema

---

## Governance and Documentation Cadence

For each milestone, update:

1. Architecture decisions (ADRs)
2. Parity matrix
3. Deployment/runbook notes
4. Known issues and follow-ups

Use small iterative releases instead of big-bang migrations.

---

## Risk Register (Initial)

1. **Data model drift** across legacy versions and Next.
   - Mitigation: contract-first schemas and parity tests.

2. **Inconsistent UX during migration**.
   - Mitigation: visual QA checklist + snapshot comparisons.

3. **Over-complexity in early phases**.
   - Mitigation: defer non-critical features until Phase 4+.

4. **Environment/config instability**.
   - Mitigation: explicit env schema and staging validation.

---

## Immediate Next Actions Checklist

- [ ] Confirm Next.js as canonical deploy target.
- [ ] Decide data strategy (DB, CMS, hybrid).
- [ ] Write domain model draft (`Product`, `Category`, `ContactRequest`).
- [ ] Define route rendering strategy (SSG/ISR/dynamic).
- [ ] Create parity matrix template.
- [ ] Define NFR targets (performance/accessibility/security).
- [ ] Select deployment provider and CI gates.
- [ ] Start Phase 1 implementation branch.

---

## Definition of Done for “Step 2 Implemented”

Step 2 is considered complete when:

- `next/` is production-deployed.
- Core pages and data flows are fully operational.
- Monitoring, logging, and rollback procedures exist.
- Parity matrix shows acceptable alignment with the four preserved versions.
- Future contributors can continue work using this guide + ADRs.

