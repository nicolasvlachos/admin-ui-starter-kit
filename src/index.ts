/**
 * Library root entry — the namespace import for `admin-ui-starter-kit`.
 *
 *   import { Base, Composed, Features, Layout, UIProvider } from 'admin-ui-starter-kit';
 *
 * Most consumers import per-entrypoint (`admin-ui-starter-kit/base/item`,
 * `admin-ui-starter-kit/composed/cards`, …) — that's the recommended path
 * because it tree-shakes cleanly and only pulls the optional peers you
 * actually use. The namespace export above is the convenience surface
 * for callers who want `Base.Button`, `Composed.ContactCard`, etc.
 *
 * Adding a new layer? Re-export it here AND add an `exports` map entry
 * in `package.json` AND an entry in `vite.lib.config.ts`'s entry table.
 */
export * as Base from './components/base';
export * as Composed from './components/composed';
export * as Features from './components/features';
export * as Layout from './components/layout';
export * from './lib/ui-provider';
