/**
 * MoneyInput (forms/fields) — `CurrencyInput` preset with a small default
 * currency list for back-compat and a callback shape that matches the
 * library's `CurrencyCode` typing.
 *
 * For the richer `MoneyInputData`-shaped helper with migration warnings and
 * form-field chrome, use `@/components/base/display/money-input` instead.
 */
import { forwardRef, useCallback } from 'react';

import { CurrencyInput, type CurrencyInputProps } from './currency-input';
import type { CurrencyCode } from '@/lib/ui-provider';

export interface MoneyInputProps extends Omit<CurrencyInputProps, 'currency' | 'defaultCurrency' | 'currencies' | 'onCurrencyChange'> {
    /** Current currency value (ISO 4217 code, e.g. 'USD'). */
    currency?: CurrencyCode;
    /** Default currency if uncontrolled. */
    defaultCurrency?: CurrencyCode;
    /** Available currencies for the inline picker. Defaults to `['USD', 'EUR']`
     *  — pass your own list or wire `useMoneyConfig` at the consumer site for
     *  real production use. */
    currencies?: CurrencyCode[];
    /** Callback when the user changes the currency in the inline picker. */
    onCurrencyChange?: (currency: CurrencyCode) => void;
}

const DEFAULT_CURRENCIES: CurrencyCode[] = ['USD', 'EUR'];

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(function MoneyInput(
    { currencies = DEFAULT_CURRENCIES, onCurrencyChange, currency, defaultCurrency, ...props },
    ref,
) {
    const handleCurrencyChange = useCallback(
        (nextCurrency: string) => {
            onCurrencyChange?.(nextCurrency);
        },
        [onCurrencyChange]
    );

    return (
        <CurrencyInput className="money-input--component"
            ref={ref}
            currencies={currencies}
            currency={currency}
            defaultCurrency={defaultCurrency}
            onCurrencyChange={handleCurrencyChange}
            {...props}
        />
    );
});

MoneyInput.displayName = 'MoneyInput';
