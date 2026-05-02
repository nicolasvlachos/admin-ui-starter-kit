/**
 * The single zustand store backing `<UIProvider>`.
 *
 * Why zustand and not React context:
 *   - Slice-scoped re-renders: `useUIStore(s => s.money)` only re-renders
 *     when the `money` slice changes; consumers of `dates` are untouched.
 *     Plain context re-renders every consumer on any change.
 *   - No nested providers — one store, many selectors.
 *   - Internal `applyUIConfig` for SSR / bootstrap code that runs outside
 *     the React tree. Not part of the public barrel.
 *
 * The store ships with the full `DEFAULT_UI_CONFIG` baked in, so any
 * component using a selector hook works correctly even when `<UIProvider>`
 * is not mounted.
 */
import { create } from 'zustand';

import { mergeStrings, type DeepPartial } from '@/lib/strings';

import { DEFAULT_UI_CONFIG } from './defaults';
import type { ResolvedUIConfig, UIConfig } from './types';

export const useUIStore = create<ResolvedUIConfig>(() => DEFAULT_UI_CONFIG);

/**
 * Internal — applies a partial config into the store. Called exactly
 * once by `<UIProvider>` on first mount. NOT exported from the public
 * barrel: the contract is that the config is locked after app boot;
 * descendants read via selectors and never write.
 *
 * If you genuinely need to bootstrap config from outside React (SSR
 * server entry, tests), import this directly from `./store` — never
 * call it from a React component or render path.
 */
export function applyUIConfig(config: DeepPartial<UIConfig>): void {
    useUIStore.setState((state) =>
        mergeStrings(state, config as DeepPartial<ResolvedUIConfig>),
    );
}

/**
 * Read the current resolved config — read-only snapshot. Useful for
 * tests, debug panels, and one-off lookups outside React. Inside
 * components, use the slice selectors from `./hooks`.
 */
export function getUIConfig(): ResolvedUIConfig {
    return useUIStore.getState();
}

/**
 * Internal — reset the store to the built-in defaults. Used by tests
 * to isolate cases. NOT exported from the public barrel.
 */
export function resetUIConfig(): void {
    useUIStore.setState(DEFAULT_UI_CONFIG, /* replace */ true);
}
