/**
 * `useCurrency` — sugar over the `money` slice of `<UIProvider>`.
 *
 * Reads currency display settings from the global `UIConfig.money` store
 * (initialized with `DEFAULT_UI_CONFIG.money`), optionally overridden
 * per-call via `useCurrency({ ... })`. Returns formatting helpers that
 * compose the `Intl` APIs against the resolved settings.
 *
 * To change library-wide defaults: mount `<UIProvider config={{ money: {
 * defaultCurrency: 'EUR', formatMode: 'with_symbol' } }}>` near the root.
 * To change a single call site only: pass `useCurrency({ formatMode: ... })`.
 */
import { useMemo } from 'react';

import { useMoneyConfig } from '@/lib/ui-provider';
import type {
    MoneyConfig,
    MoneyDisplayMode,
    MoneyDualLayout,
    MoneyFormatMode,
} from '@/lib/ui-provider';

/**
 * Local-call override shape. Mirrors `MoneyConfig` keys, all optional.
 * Kept as a separate type so the public surface of `useCurrency` doesn't
 * depend directly on the UIConfig types.
 */
export type CurrencyOverrides = Partial<MoneyConfig>;

/**
 * @deprecated Kept as an alias for back-compat. Prefer importing
 *  `MoneyConfig` from `@/lib/ui-provider` directly.
 */
export type CurrencyConfig = MoneyConfig;

/**
 * @deprecated Use `<UIProvider config={{ money: {...} }}>` instead.
 *  This export is retained as a no-op shim during migration.
 */
export function CurrencyConfigProvider({
    children,
}: {
    config?: Partial<MoneyConfig>;
    children: React.ReactNode;
}): React.ReactElement {
    return children as React.ReactElement;
}

/** Hook returning resolved currency settings + formatting helpers. */
export function useCurrency(overrides?: CurrencyOverrides) {
    const fromStore = useMoneyConfig();

    const resolved = useMemo<Required<Pick<MoneyConfig,
        'defaultCurrency' | 'dualPricingEnabled' | 'displayMode' |
        'dualPricingDisplay' | 'formatMode'
    >> & { displayCurrency: string; locale?: string }>(() => {
        const merged: MoneyConfig = { ...fromStore, ...overrides };
        const defaultCurrency = merged.defaultCurrency ?? 'USD';
        return {
            defaultCurrency,
            displayCurrency: merged.displayCurrency ?? defaultCurrency,
            locale: merged.locale,
            dualPricingEnabled: merged.dualPricingEnabled ?? false,
            displayMode:
                merged.displayMode ?? ('default_only' as MoneyDisplayMode),
            dualPricingDisplay:
                merged.dualPricingDisplay ?? ('lines' as MoneyDualLayout),
            formatMode: merged.formatMode ?? ('with_code' as MoneyFormatMode),
        };
    }, [fromStore, overrides]);

    const {
        defaultCurrency,
        displayCurrency,
        locale,
        dualPricingEnabled,
        displayMode,
        dualPricingDisplay,
        formatMode,
    } = resolved;

    const shouldShowDualPricing = () => {
        if (!dualPricingEnabled) return false;
        return displayMode === 'dual';
    };

    const formatAmount = (
        value: string | number,
        currency: string,
        symbol?: string,
    ): string => {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (!Number.isFinite(numValue)) {
            return currency ? `${String(value)} ${currency}`.trim() : String(value);
        }

        const formattedNumber = new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numValue);

        switch (formatMode) {
            case 'decimal':
                return formattedNumber;
            case 'with_code':
                return currency ? `${formattedNumber} ${currency}` : formattedNumber;
            case 'with_symbol':
                return symbol
                    ? `${symbol}${formattedNumber}`
                    : currency
                        ? `${formattedNumber} ${currency}`
                        : formattedNumber;
            case 'locale_aware':
                if (!currency) return formattedNumber;
                try {
                    return new Intl.NumberFormat(locale, {
                        style: 'currency',
                        currency,
                    }).format(numValue);
                } catch {
                    return `${formattedNumber} ${currency}`;
                }
            default:
                return currency ? `${formattedNumber} ${currency}` : formattedNumber;
        }
    };

    const getCurrencySymbol = (currency: string): string => {
        const symbols: Record<string, string> = {
            BGN: 'лв',
            EUR: '€',
            USD: '$',
            GBP: '£',
            JPY: '¥',
        };
        return symbols[currency] ?? currency;
    };

    return {
        defaultCurrency,
        displayCurrency,
        dualPricingEnabled,
        displayMode,
        dualPricingDisplay,
        formatMode,
        shouldShowDualPricing,
        formatAmount,
        getCurrencySymbol,
    };
}

/**
 * @deprecated Use `DEFAULT_UI_CONFIG.money` from `@/lib/ui-provider`.
 *  Retained for back-compat during migration.
 */
export const defaultCurrencyConfig: MoneyConfig = {
    defaultCurrency: 'USD',
    dualPricingEnabled: false,
    displayMode: 'default_only',
    dualPricingDisplay: 'lines',
    formatMode: 'with_code',
};

export default useCurrency;
