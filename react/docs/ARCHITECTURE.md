# React application architecture

## Decision summary

This implementation uses React 19 with Vite and deliberately keeps the dependency surface small. React provides component composition and local interaction state; Vite provides development and production builds. A custom, small history adapter handles the five static routes because the current site does not need nested routes, guarded routes, loaders, or other features that justify a routing package.

This is a comparison implementation, not a replacement for `next/`. The Next.js application remains the stronger production direction when server-side rendering, backend-for-frontend handlers, metadata per route, or incremental static regeneration are required.

## Runtime flow

1. `index.html` loads `src/main.jsx`.
2. `main.jsx` mounts `App` into `#root` under React Strict Mode.
3. `App` normalizes the current URL and maps it to a page component.
4. Internal `RouterLink` clicks update the History API without reloading the document.
5. `popstate` keeps the rendered page synchronized with browser Back and Forward actions.
6. Shared `Header` and `Footer` components remain mounted while route-level content changes.

## Routes

| URL | Component | Purpose |
| --- | --- | --- |
| `/` | `HomePage` | Brand introduction and featured menu items. |
| `/categories` | `CategoriesPage` | Menu categories, products, and client-side search. |
| `/about` | `AboutPage` | Story and operating values. |
| `/about-us` | `AboutPage` | Compatibility alias for legacy implementations. |
| `/contact` | `ContactPage` | Location, hours, contact links, and demonstration form. |
| Any other path | `NotFoundPage` | In-app not-found guidance. |

Production static hosting must rewrite application paths to `index.html`. Without this rule, direct navigation or refresh on `/about` may return the host's 404 before React runs.

## State boundaries

- `App` owns only the current client-side route.
- `Header` owns the mobile-menu disclosure state.
- `CategoriesPage` owns its search query and derives filtered results from the pure `filterProducts` function.
- `ContactPage` owns form fields and local success feedback.
- Product and category content remains immutable in `src/data/catalog.js`.

Keeping state close to its consumer avoids a global state dependency. If authenticated user state, a shopping cart, or server caching is introduced, reassess this decision rather than extending prop passing indefinitely.

## Styling and responsive behavior

`styles.css` defines color, typography, spacing, and component rules with CSS custom properties. Layouts collapse at 860px and 560px. The design provides visible keyboard focus, labeled controls, semantic landmarks, and a reduced-motion mode that removes the decorative autoplay video.

The stylesheet requests DM Sans and Newsreader from Google Fonts. This creates a third-party request and may be inappropriate under some privacy or Content Security Policy requirements. A production privacy review should either approve and declare that request or replace it with licensed, self-hosted files and update the font stack.

## Assets

Imports intentionally point to `../../html/img` and `../../html/vids` instead of copying the repository's large source media. Vite includes referenced assets in the build with content hashes. The coupling is explicit: renaming the legacy assets requires updating these imports.

Images use lazy loading below the fold. The home video is decorative, muted, looping, and hidden when the user requests reduced motion. For a production launch, encode responsive images (AVIF/WebP plus appropriate sizes) and a smaller mobile video or poster to reduce transfer cost.

## Contact form limitation

The form is a UI demonstration. Submission performs no network request and stores no data. This prevents the implementation from suggesting an insecure public endpoint. A real form needs server-side validation, request-size limits, origin/CSRF analysis, rate limiting, spam controls, reliable email or persistence, privacy rules, and observable error handling.

## Testing strategy

The initial automated tests cover pure catalog behavior and required data because these rules can run reliably without browser dependencies. Before production use, add browser tests for:

- navigation, direct URLs, Back/Forward behavior, and host rewrite configuration;
- mobile navigation and keyboard operation;
- search empty/results/no-results states;
- form validation, success, failure, and duplicate-submission behavior;
- automated accessibility checks plus manual keyboard and screen-reader review;
- responsive screenshots and performance budgets.

## Known tradeoffs

- Client-side rendering provides weaker route-specific SEO than Next.js server rendering.
- The hand-written router is intentionally narrow and should not grow into a general framework.
- Catalog values and contact details are illustrative, not a connected source of truth.
- Imported legacy media is large; production optimization remains necessary.
- The success message makes clear that the demonstration does not send data.
