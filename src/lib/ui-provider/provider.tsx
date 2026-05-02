/**
 * `<UIProvider>` — declarative wrapper that mirrors a config tree into the
 * single zustand store.
 *
 * Usage:
 *
 *     <UIProvider config={{
 *         money: { defaultCurrency: 'EUR', locale: 'en-GB' },
 *         dates: { weekStartsOn: 1 },
 *         comments: { maxAttachments: 3 },
 *     }}>
 *         <App />
 *     </UIProvider>
 *
 * Notes:
 *   - The provider is purely a side-effect bridge — it does NOT introduce
 *     a React context, so there is no nesting tax for adding more slices.
 *   - The first sync happens during render so SSR output reflects the
 *     consumer's overrides on first paint, not just on hydration.
 *   - On config-prop identity change, the new partial is deep-merged in.
 *     The store keeps any defaults the consumer didn't override.
 */
import { useLayoutEffect, useRef, type ReactNode } from 'react';

import type { DeepPartial } from '@/lib/strings';

import { applyUIConfig } from './store';
import type { UIConfig } from './types';

export interface UIProviderProps {
    /** Partial override tree merged over `DEFAULT_UI_CONFIG`. */
    config?: DeepPartial<UIConfig>;
    children: ReactNode;
}

/**
 * `<UIProvider>` is mount-once. The `config` is read on first mount and
 * locked thereafter — descendant components read via selectors and
 * cannot mutate the store. If the `config` prop identity changes after
 * the initial mount, the new value is ignored and a dev warning fires:
 * library-wide defaults are not meant to be runtime-toggled, since that
 * would mid-render every consuming component across the tree.
 *
 * `applyUIConfig` runs in `useLayoutEffect` (synchronous after DOM
 * mutation, before paint) so the override applies on the first visible
 * frame without violating React's render-phase isolation. SSR consumers
 * that need overrides in server-rendered HTML should import
 * `applyUIConfig` directly from `./store` and call it once at module
 * load before the React tree mounts.
 */
export function UIProvider({ config, children }: UIProviderProps) {
    const appliedRef = useRef(false);
    const initialConfigRef = useRef<DeepPartial<UIConfig> | undefined>(config);

    useLayoutEffect(() => {
        if (appliedRef.current) {
            if (
                import.meta.env?.DEV &&
                initialConfigRef.current !== config
            ) {
                 
                console.warn(
                    '[UIProvider] `config` is mount-once. Subsequent ' +
                        'changes to the prop are ignored. Library-wide ' +
                        'defaults should be set at the app root and read ' +
                        'via selectors; per-mount overrides flow as props ' +
                        'on the consuming component.',
                );
            }
            return;
        }
        if (config) applyUIConfig(config);
        appliedRef.current = true;
    }, [config]);

    return <>{children}</>;
}
