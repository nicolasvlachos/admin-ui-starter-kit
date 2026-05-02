/**
 * Hardcoded library-wide defaults.
 *
 * These are the values the store ships with — every component reading via
 * `useFooConfig()` gets these even when no `<UIProvider>` is mounted.
 *
 * The store is locked at app boot. Override defaults by mounting
 * `<UIProvider config={{...}}>` near the React root exactly once.
 * SSR/test entrypoints can call `applyUIConfig({...})` directly from
 * `./store` before mounting the React tree — never from a component.
 */
import { formatDistanceToNow, parseISO } from 'date-fns';

import type { ResolvedUIConfig } from './types';

const defaultFormatRelativeTime = (iso: string): string => {
    if (!iso) return '';
    try {
        return formatDistanceToNow(parseISO(iso), { addSuffix: true });
    } catch {
        return iso;
    }
};

export const DEFAULT_UI_CONFIG: ResolvedUIConfig = {
    money: {
        defaultCurrency: 'USD',
        locale: 'en-US',
        dualPricingEnabled: false,
        displayMode: 'default_only',
        dualPricingDisplay: 'lines',
        formatMode: 'with_code',
    },
    dates: {
        weekStartsOn: 1,
        format: 'dd MMM yyyy',
        locale: 'en-US',
        formatRelativeTime: defaultFormatRelativeTime,
    },
    comments: {
        composerPosition: 'top',
        maxAttachments: 5,
        allowReactions: true,
        allowReplies: true,
        allowAttachments: true,
    },
    filters: {
        debounceMs: 250,
        defaultPageSize: 25,
    },
    forms: {
        defaultControlSize: 'sm',
        defaultLabelSize: 'sm',
    },
    table: {
        defaultSize: 'xs',
    },
    typography: {
        defaultTextSize: 'sm',
    },
    badge: {
        defaultSize: 'xs',
    },
    item: {
        defaultSize: 'sm',
        defaultVariant: 'default',
    },
    button: {
        defaultSize: 'sm',
        defaultButtonStyle: 'solid',
    },
    card: {
        defaultPadding: 'sm',
    },
    toast: {
        duration: 5000,
        position: 'top-right',
    },
    spinner: {
        defaultVariant: 'default',
    },
    media: {
        resolveUrl: (input) => input.url,
        resolveName: (input) => input.name ?? input.key,
    },
};
