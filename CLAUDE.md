# style.css

A reusable CSS library for semantic HTML. Ships as a single minified file via npm and CDN. Includes full-page examples and a pa11y accessibility test suite. Default appearance is dark; light mode responds to `prefers-color-scheme`.

## Architecture

### Import order

```css
@import './bulma.css';
@import './theme.css';
@import './overrides.css';
```

Bulma is imported first so our files come later in the cascade and win. `src/bulma.css` is a gitignored local cache populated by `npm run cache:bulma`. Source files are bundled by Lightning CSS into `dist/style.css`.

### Directory structure

```
src/             CSS source files
dist/            Built output — do not edit manually
examples/
  index.html     Landing page
  <name>/        Full-page layout demos (each is index.html inside a named dir)
  scripts/       JS files for example pages
test/            Accessibility test runner
```

### Theme switching

Set `data-theme` on `<html>` to override the OS preference:

| Value      | Effect                        |
| ---------- | ----------------------------- |
| `"light"`  | Force light mode              |
| `"dark"`   | Force dark mode               |
| _(absent)_ | Follow `prefers-color-scheme` |

### Source modules

| File                | Purpose                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| `src/style.css`     | Entry point — imports Bulma then our customization files                                             |
| `src/theme.css`     | CSS custom property assignments — global (`:root`) and scoped to selectors; no direct property rules |
| `src/overrides.css` | Direct CSS property rules for things Bulma doesn't expose as a variable                              |

### Scripts

| Command             | Purpose                                                                                             |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| `npm run cache`     | Download all vendored assets (Bulma, Montserrat, InstantClick)                                      |
| `npm run build`     | Bundle, minify, syntax-lower to dist/                                                               |
| `npm run preview`   | Serve project root on :4000, no watching                                                            |
| `npm run dev`       | Build + watch src + live browser reload                                                             |
| `npm test`          | Build + run pa11y (with axe runner) over all example pages                                          |
| `npm run lint`      | Lint CSS and check formatting (CSS + JS + HTML + JSON)                                              |
| `npm run format`    | Auto-format build.js, test/a11y.js, examples/scripts/\*\*/\*.js, src/**/\*.css, examples/**/\*.html |
| `npm run typecheck` | Type-check build.js, test/a11y.js, examples/scripts/\*\*/\*.js via tsc                              |
| `npm run validate`  | lint + typecheck + test — run before committing                                                     |

Browser target: `> 0.5%, last 2 versions` via `.browserslistrc`.
All examples import `/dist/style.css` — always the built artifact.

## Design system

1. **Regions are separated by shade, not borders** — background shading is the primary structural tool
2. **Use as few shades as reasonable**
3. **Static elements are greyscale** — a subtle hue is permitted
4. **Color is reserved for interactive elements and important messages** — in complex layouts, color may also aid readability
5. **Buttons contrast by inversion, not color**
6. **Rounded corners throughout; buttons are pills**
7. **No borders** — exception: drag/drop zones use a dashed border
8. **No shadows** — exception: small elements where shadow is needed for contrast
9. **High x-height fonts**

## Accessibility

- WCAG AA minimum: 4.5:1 normal text, 3:1 large text and UI components
- Color must never be the sole differentiator
- Focus rings: accent color, visible — never removed
- All interactive elements must be keyboard-navigable
- `npm test` must pass zero pa11y violations on every example page
