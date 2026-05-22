# style.css

A reusable CSS library working towards full support for semantic HTML. Requirements are actively being gathered from dependent projects — the current implementation is not yet fully semantic.

## Install

```sh
npm install @jankrum/style.css
```

**CDN:**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@jankrum/style.css/dist/style.css" />
```

## Theme switching

Set `data-theme` on `<html>` to override the OS preference:

| Value      | Effect                        |
| ---------- | ----------------------------- |
| `"light"`  | Force light mode              |
| `"dark"`   | Force dark mode               |
| _(absent)_ | Follow `prefers-color-scheme` |

## Repo structure

| Path        | Purpose                             |
| ----------- | ----------------------------------- |
| `src/`      | CSS source files                    |
| `dist/`     | Built output — do not edit manually |
| `examples/` | Full-page layout demos              |
| `test/`     | pa11y accessibility test runner     |

## Scripts

| Command            | Purpose                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------- |
| `npm run cache`    | Download all vendored assets (Bulma, Montserrat, InstantClick) — required before first build |
| `npm run dev`      | Build, watch for changes, and live-reload the browser                                        |
| `npm run validate` | Lint, typecheck, and run pa11y tests — run before committing                                 |
| `npm run format`   | Auto-format all source files                                                                 |
