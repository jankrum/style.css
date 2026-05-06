# style.css

A reusable CSS library for semantic HTML. Ships as a single minified file via npm and CDN. Includes component and full-page examples, and an axe-core accessibility test suite. Default appearance is dark; light mode responds to `prefers-color-scheme`.

## Architecture

### Layer order

```css
@layer reset, tokens, base, layout, components, utilities;
```

Source files in `src/` are composed via `@import` into `src/style.css` and bundled by Lightning CSS into `dist/style.css`.

### Directory structure

```
src/             CSS source files
dist/            Built output — do not edit manually
examples/
  components/    Single-component demos
  pages/         Full-page layout demos
test/            Accessibility test runner
```

### Source modules

| File                        | Purpose                                                                                                        |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `src/style.css`             | Entry point — declares layer order and `@import`s all modules                                                  |
| `src/reset.css`             | Meyer reset — strips all browser defaults (margins, padding, font sizes, list styles)                          |
| `src/tokens.css`            | Design tokens — CSS custom properties for color, font stacks; dark default with light mode override            |
| `src/base.css`              | Element defaults — restores sensible styles for raw HTML elements using tokens; floor that components override |
| `src/layout.css`            | Page structure — grid/flexbox containers, page-level regions (header, main, sidebar, footer)                   |
| `src/utilities.css`         | Utility classes — single-purpose helpers (spacing, alignment, visibility) applied inline to any element        |
| `src/components/button.css` | Button component — rounded buttons, variants (primary, secondary, destructive), segmented controls             |
| `src/components/form.css`   | Form component — filled inputs, labels, validation states via `aria-invalid`, field layout                     |
| `src/components/card.css`   | Card component — rounded content containers with `--color-bg-alt` shading                                      |

### Scripts

| Command           | Purpose                                         |
| ----------------- | ----------------------------------------------- |
| `npm run build`   | Bundle, minify, syntax-lower to dist/           |
| `npm run preview` | Serve project root on :4000, no watching        |
| `npm run dev`     | Build + watch src + live browser reload         |
| `npm test`        | Build + run axe-core over all example pages     |
| `npm run lint`    | Lint CSS and check formatting (CSS + JS + HTML) |
| `npm run format`  | Auto-format build.js and examples/\*_/_.html    |

Browser target: `> 0.5%, last 2 versions` via `.browserslistrc`.
All examples import `/dist/style.css` — always the built artifact.

## Design system

### Core principle

Static and structural elements are greyscale. Color is reserved for interactive elements and important messages.

### Color scheme

Dark is the default. Light mode is a `@media (prefers-color-scheme: light)` override that re-maps token values only — component rules are untouched. `color-scheme: dark light` is set on `:root` so native browser UI (scrollbars, form controls) matches.

### Separation

Distinguish regions through background shading, not borders. Adjacent shades used to identify UI components (especially form inputs) must meet 3:1 contrast (WCAG 1.4.11).

### Typography

- Font: `var(--font-sans)`
- Paragraph line length: `max-width: 65ch`
- Text color uses near-black/near-white rather than pure `#000`/`#fff` to reduce halation

### Components

- **Buttons**: pill shape; segmented control arrays are the exception
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
- `npm test` must pass zero axe-core violations on every example page
