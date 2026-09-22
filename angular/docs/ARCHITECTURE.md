# Angular architecture

## Scope

The Angular folder is an independent client-rendered application and a framework comparison. It consumes no backend API and does not alter the runtime behavior of any existing implementation.

## Decisions

- **Standalone components:** avoid an application NgModule and keep every component's dependencies explicit.
- **Lazy route components:** page code is loaded on demand through `loadComponent`; shared navigation and footer stay mounted in the root shell.
- **Signals and computed state:** local interaction state remains close to the component using it, without introducing a global state package.
- **OnPush change detection:** all components use `ChangeDetectionStrategy.OnPush` to make update boundaries predictable.
- **Angular Forms:** the contact demonstration uses template-driven forms because its state and validation are small and local. A complex production workflow may justify typed reactive forms.
- **No component library:** semantic HTML and CSS preserve the existing visual approach without an unnecessary UI dependency.
- **Shared media:** a tracked symlink exposes the existing `html/` media through Angular's public asset pipeline. The asset glob explicitly follows symlinks.

## Route map

| Path | Page | Notes |
| --- | --- | --- |
| `/` | Home | Brand, philosophy, featured products, visit call to action. |
| `/categories` | Menu | Category overview and signal-based product search. |
| `/about` | Our Story | Origin story and operating values. |
| `/about-us` | Redirect | Compatibility with legacy repository URLs. |
| `/contact` | Visit | Details and a non-persisting demonstration form. |
| `**` | Not Found | Friendly unknown-route response. |

Route titles are declared alongside routes. Browser Back/Forward behavior and scroll restoration are provided by Angular Router.

## Data flow

`data/catalog.ts` owns readonly typed seed content and the pure `filterProducts` function. Route components read it directly because no remote data source currently exists. The Menu page stores the raw query in a signal and exposes filtered results as computed state. Product cards accept a required typed input.

If a backend is introduced, move transport behavior into injectable services, validate external responses at the boundary, represent loading/empty/error states explicitly, and keep presentational components free of HTTP details.

## Assets and privacy

The build follows `public/assets` to the existing `html/` directory. Removing the symlink or renaming legacy assets breaks the referenced images and video. Production should provide responsive AVIF/WebP images and an appropriately sized mobile video or poster.

The global stylesheet currently requests DM Sans and Newsreader from Google Fonts. That third-party request needs a privacy and Content Security Policy review; self-host licensed font files if policy requires it.

The contact form intentionally makes no network request. A real endpoint requires server-side validation, request limits, origin/CSRF analysis, rate limiting, spam controls, reliable delivery or persistence, privacy/retention rules, and observable accessible failure states.

## Testing and quality gates

The production quality gate is `pnpm build`, which runs the Angular compiler's strict TypeScript and template checks and enforces bundle budgets. Extend the test target with focused component tests for navigation, search, no-results feedback, native form validation, submission states, and unknown routes. Add browser-level tests for direct URLs, host rewrites, mobile navigation, keyboard use, responsive layouts, and accessibility.

## Tradeoffs

- Client rendering does not emit route-specific content at the initial HTTP response.
- The catalog and location details are illustrative source-controlled content.
- Shared assets avoid repository duplication but couple this app to the `html/` media paths.
- Template-driven forms are intentionally limited to the present demonstration.
- Angular carries more framework and build-system surface than the React comparison, in exchange for integrated routing, forms, dependency injection, and compiler conventions.
