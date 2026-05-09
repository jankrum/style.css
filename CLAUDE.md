# style.css

A reusable CSS library for semantic HTML. Ships as a single minified file via npm and CDN. Includes component and full-page examples, and a pa11y accessibility test suite. Default appearance is dark; light mode responds to `prefers-color-scheme`.

## Architecture

### Layer order

```css
@import './reset.css' layer(reset);
@import './tokens.css' layer(tokens);
@import './base.css' layer(base);
@import './layout.css' layer(layout);
@import './components/grid.css' layer(components);
@import './components/button.css' layer(components);
@import './components/card.css' layer(components);
@import './components/form.css' layer(components);
@import './utilities.css' layer(utilities);
```

Source files in `src/` are composed via `@import` into `src/style.css` and bundled by Lightning CSS into `dist/style.css`.

### Directory structure

```
src/             CSS source files
dist/            Built output — do not edit manually
examples/
  index.html     Landing page linking to components and pages
  pages/         Full-page layout demos
test/            Accessibility test runner
```

### Source modules

| File                        | Purpose                                                                                                                                                   |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/style.css`             | Entry point — `@import`s all modules into named layers; defines custom media breakpoints (`--bp-sm` through `--bp-xxl`)                                   |
| `src/reset.css`             | Meyer reset — strips all browser defaults (margins, padding, font sizes, list styles)                                                                     |
| `src/tokens.css`            | Design tokens — CSS custom properties for color, font stacks; dark default with light mode override                                                       |
| `src/base.css`              | Element defaults — restores sensible styles for raw HTML elements using tokens; floor that components override                                            |
| `src/layout.css`            | Page structure — flexbox containers, page-level regions (header, main, footer); sidebar planned                                                           |
| `src/utilities.css`         | Utility classes — current: `.h-centered` (flex column, center align), `.centered` (flex column, center both axes); list grows as useful helpers are added |
| `src/components/grid.css`   | Grid component — single-column default, responsive multi-column at md breakpoint via `.grid`                                                              |
| `src/components/button.css` | Button component — pill buttons; regular (implemented), copy and destructive (planned)                                                                    |
| `src/components/form.css`   | Form component — filled inputs, labels, validation states via `aria-invalid`, field layout                                                                |
| `src/components/card.css`   | Card component — rounded content containers with `--color-bg-alt` shading                                                                                 |

### Scripts

| Command             | Purpose                                                                |
| ------------------- | ---------------------------------------------------------------------- |
| `npm run build`     | Bundle, minify, syntax-lower to dist/                                  |
| `npm run preview`   | Serve project root on :4000, no watching                               |
| `npm run dev`       | Build + watch src + live browser reload                                |
| `npm test`          | Build + run pa11y (with axe runner) over all example pages             |
| `npm run lint`      | Lint CSS and check formatting (CSS + JS + HTML)                        |
| `npm run format`    | Auto-format build.js, test/a11y.js, src/**/\*.css, examples/**/\*.html |
| `npm run typecheck` | Type-check build.js and test/a11y.js via tsc (checkJs, noEmit)         |
| `npm run validate`  | lint + typecheck + test — run before committing                        |

Browser target: `> 0.5%, last 2 versions` via `.browserslistrc`.
All examples import `/dist/style.css` — always the built artifact.

## Design system

### Core principle

Static and structural elements are greyscale. Color is reserved for interactive elements and important messages.

### Color scheme

Dark is the default. Color tokens use `light-dark()` in `oklch` so values flip automatically with `color-scheme`. Icon tokens (SVG data URIs) use a `@media (prefers-color-scheme: light)` override since `light-dark()` cannot be used inside a data URI. `color-scheme: dark light` is set on `:root` so native browser UI (scrollbars, form controls) matches. Component rules are untouched by color scheme.

### Separation

Distinguish regions through background shading, not borders. Adjacent shades used to identify UI components (especially form inputs) must meet 3:1 contrast (WCAG 1.4.11).

### Typography

- Font: `var(--font-sans)`
- Paragraph line length: `max-width: 65ch`
- Text color uses near-black/near-white rather than pure `#000`/`#fff` to reduce halation

### Components

- **Buttons**: pill shape
- **Form inputs**: filled background, no border; input background must contrast 3:1 against surrounding
  background. Validation state is communicated via `aria-invalid="true"` on the input and an always-present
  sibling element linked via `aria-describedby`. That element uses `aria-live="polite"` so screen readers
  announce changes. CSS targets `[aria-invalid="true"]` for visual styling (color + background shift) and
  hides the message element when empty via `:empty { display: none }`. Color is never the sole indicator
  of validation state — an inline icon or text prefix is required.

  Expected markup pattern:

  ```html
  <div class="field">
    <label for="email">Email</label>
    <input type="email" id="email" aria-describedby="email-message" aria-invalid="true" />
    <span id="email-message" aria-live="polite"> Enter a valid email address. </span>
  </div>
  ```

- **Drag/drop zones**: dashed border — the only permitted border
- **Floating elements** (tooltips, dropdowns, popovers): shadow permitted to signal layering
- **Alerts/messages**: icon + color together, never color alone

### Rules

- No borders except drag/drop zones
- No shadows except floating/layered elements
- Rounded corners applied consistently

## Accessibility

- WCAG AA minimum: 4.5:1 normal text, 3:1 large text and UI components
- Color must never be the sole differentiator
- Focus rings: accent color, visible — never removed
- All interactive elements must be keyboard-navigable
- `npm test` must pass zero pa11y violations on every example page
