# Changelog

All notable changes to **admin-ui-starter-kit** are documented here. The
format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] — 2026-05-02

Initial public release.

### Added

- **Layered architecture** — `ui/` (shadcn primitives, never edited) →
  `base/` (typography-aware wrappers) → `composed/` (domain rows + cards) →
  `features/` (callback-driven feature surfaces) → `layout/` (app shells).
  Cross-layer imports enforced by `npm run lint:architecture`.
- **`<UIProvider>`** — single zustand store for library-wide display
  defaults. Slice-scoped subscriptions, locked-once at boot, slices for
  `money`, `dates`, `comments`, `filters`, `forms`, `table`, `typography`,
  `badge`, `item`, `button`, `card`, `toast`, `spinner`, `media`.
- **`useStrings()`** — deep-merge i18n hook every component routes
  user-facing copy through. Library imports zero i18n packages; consumers
  wire any backend they like at the call site.
- **`<Item>` family** — canonical row primitive (`ItemGroup`, `Item`,
  `ItemSeparator`, `ItemMedia`, `ItemContent`, `ItemTitle`,
  `ItemDescription`, `ItemActions`, `ItemHeader`, `ItemFooter`). 24 row
  surfaces migrated onto it for density consistency.
- **`<FormField>` / `<ControlledFormField>`** — canonical form-row
  primitive. Handles label + control + error/hint + react-hook-form
  binding. Backend errors override validation messages.
- **Base layer** — `Button`, `Text`, `Heading`, `Label`, `Badge`, `Item`,
  `SmartCard`, `Combobox`, `Command`, `Copyable`, `CurrencyDisplay`,
  `DatePicker`, `Display`, `EventCalendar`, `Forms`, `Map`, `Navigation`,
  `Popover`, `PopoverMenu`, `Spinner`, `Table`, `Toaster`.
- **Composed layer** — `admin/*`, `ai/*`, `analytics/*`, `cards/*`,
  `commerce/*`, `dark-surfaces/*`, `data-display/*`, `navigation/*`,
  `timelines/*`.
- **Features layer** — `activities`, `card`, `comments`, `event-log`,
  `filters`, `global-search`, `mentions`, `overlays`, `rich-text-editor`,
  `suggestions`, `sync`.
- **Layout layer** — `containers`, `page`, `header`, `sidebar`, `hooks`.
- **Build pipeline** — Vite library mode emits both ESM (`.js`) and CJS
  (`.cjs`) for every entrypoint, plus matching `.d.ts` via
  `vite-plugin-dts`. Tailwind v4 CLI compiles `src/App.css` → minified
  `dist/style.css`.
- **`exports` map** — 50+ entrypoints with `types` / `import` / `require`
  conditions per Node spec.
- **Peer-dependency split** — only `react`, `react-dom`, `tailwindcss`,
  and `lucide-react` are required peers; everything else (`recharts`,
  `@tiptap/*`, `leaflet`, `react-hook-form`, `sonner`, `cmdk`,
  `@tanstack/react-table`, `@dnd-kit/*`, `react-day-picker`, `qrcode`,
  `culori`, `axios`) is `peerDependenciesMeta.optional`. Consumers only
  install what they actually import.
- **Rules skill** at `.claude/skills/component-library-rules/SKILL.md`
  with deep-guides under `references/` (new-feature, strings-pattern,
  ui-provider, base-wrapper, item-pattern, form-field-pattern,
  preview-pages, consumer-wiring, import-paths, visual-eval).
- **Verify pipeline** — `npm run verify` runs `lint:architecture` +
  `test:exports` + `typecheck` + `lint` + `vitest run`. 44 tests cover
  base wrappers, mentions search, filters, rich-text-editor partials.
- **`publish:skill` script** — copies the rules skill into
  `~/.claude/skills/` and `~/.agents/skills/` for cross-project use.
- **Showcase** — in-repo preview app at `src/preview/` with 80+ pages
  covering UI primitives, base wrappers, composed surfaces, features,
  and layout shells. US-flavored sample data throughout.

### Notes

- **License:** MIT. See [LICENSE](LICENSE).
- **Tested with:** React 18 + 19, Tailwind v4, Node 20+.
- **What this is not:** a marketing-site UI kit. Built for admin panels
  and SaaS dashboards.

[Unreleased]: https://github.com/nicolasvlachos/admin-ui-starter-kit/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/nicolasvlachos/admin-ui-starter-kit/releases/tag/v0.1.0
