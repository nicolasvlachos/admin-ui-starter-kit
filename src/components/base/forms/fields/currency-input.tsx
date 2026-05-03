import { useState, useCallback, useMemo, memo, forwardRef, type ForwardedRef } from 'react';
import * as baseui from '@/components/ui/select';
import { Label } from '@/components/typography';
import { cn } from '@/lib/utils';
import { DecimalInput, type DecimalInputProps } from './decimal-input';

export interface CurrencyOption {
    value: string;
    label: string;
}

export interface CurrencyInputProps extends Omit<DecimalInputProps, 'label' | 'hint' | 'helperText' | 'error'> {
    /** Current currency value */
    currency?: string;

    /** Default currency if uncontrolled */
    defaultCurrency?: string;

    /** List of available currencies (simple strings or objects with value/label) */
    currencies?: (string | CurrencyOption)[];

    /** Callback when currency changes */
    onCurrencyChange?: (currency: string) => void;

    /** Position of currency dropdown */
    currencyPosition?: 'start' | 'end';

    /** Disable currency selection */
    disableCurrencySelector?: boolean;

    /** Placeholder for currency dropdown */
    currencyPlaceholder?: string;

    /** Width of the currency dropdown */
    currencyWidth?: string;

    /** Label for currency field (sub-label) */
    currencyLabel?: string;

    /** Error state for styling (passed from FormField) */
    invalid?: boolean;

    /** Called when the input is misconfigured (mismatched currency/defaultCurrency
     *  while the selector is disabled, missing currency, etc.). The library
     *  also DEV-logs the same message to the console. */
    onConfigError?: (
        message: string,
        details: { currency?: string; defaultCurrency?: string; disableCurrencySelector?: boolean },
    ) => void;
}

// Common currency symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    BGN: 'лв',
    JPY: '¥',
    CNY: '¥',
    CHF: 'CHF',
    CAD: 'C$',
    AUD: 'A$',
};

const normalizeCurrencies = (currencies?: (string | CurrencyOption)[]): CurrencyOption[] => {
    if (!currencies || currencies.length === 0) return [];

    return currencies.map((currency) => {
        if (typeof currency === 'string') {
            const symbol = CURRENCY_SYMBOLS[currency] || currency;
            return {
                value: currency,
                label: `${symbol} ${currency}`,
            };
        }
        return currency;
    });
};

function CurrencyInputImpl(
    {
        currency: controlledCurrency,
        defaultCurrency,
        currencies,
        onCurrencyChange,
        currencyPosition = 'start',
        disableCurrencySelector = false,
        currencyPlaceholder,
        currencyWidth = 'w-28',
        currencyLabel,
        invalid,
        disabled,
        onConfigError,
        ...decimalInputProps
    }: CurrencyInputProps,
    forwardedRef: ForwardedRef<HTMLInputElement>,
) {
    // Dev warnings (only in development)
    if (import.meta.env?.DEV) {
        const selected = controlledCurrency ?? defaultCurrency;
        if (
            disableCurrencySelector &&
            typeof controlledCurrency === 'string' &&
            typeof defaultCurrency === 'string' &&
            controlledCurrency.trim() !== '' &&
            defaultCurrency.trim() !== '' &&
            controlledCurrency !== defaultCurrency
        ) {
            const message = '[CurrencyInput] currency/defaultCurrency mismatch while selector is disabled.';
            console.warn(message, { currency: controlledCurrency, defaultCurrency });
            onConfigError?.(message, { currency: controlledCurrency, defaultCurrency, disableCurrencySelector });
        }

        if (disableCurrencySelector && typeof selected === 'string' && selected.trim().length === 0) {
            const message = '[CurrencyInput] disableCurrencySelector is enabled but no currency is provided.';
            console.warn(message);
            onConfigError?.(message, { currency: controlledCurrency, defaultCurrency, disableCurrencySelector });
        }
    }

    // Memoize normalized currencies
    const normalizedCurrencies = useMemo(() => normalizeCurrencies(currencies), [currencies]);

    // Internal state for uncontrolled currency
    const [internalCurrency, setInternalCurrency] = useState(
        defaultCurrency ?? normalizedCurrencies[0]?.value ?? ''
    );

    // Determine if currency is controlled
    const isCurrencyControlled = controlledCurrency !== undefined;
    const selectedCurrency = isCurrencyControlled ? controlledCurrency : internalCurrency;

    // Handle currency change
    const handleCurrencyChange = useCallback(
        (newCurrency: string | null) => {
            if (newCurrency === null) return;
            if (!isCurrencyControlled) {
                setInternalCurrency(newCurrency);
            }
            onCurrencyChange?.(newCurrency);
        },
        [isCurrencyControlled, onCurrencyChange]
    );

    // Memoize trigger class names
    const triggerClassName = useMemo(
        () =>
            cn(
                'h-9 border-input bg-transparent',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                currencyWidth,
                disabled && 'opacity-50 cursor-not-allowed'
            ),
        [currencyWidth, disabled]
    );

    // Currency selector component
    const currencySelector = (
        <div className="space-y-2">
            {!!currencyLabel && <Label className="leading-6">{currencyLabel}</Label>}
            <baseui.Select
                value={selectedCurrency}
                onValueChange={(value) => handleCurrencyChange(value)}
                disabled={disabled || disableCurrencySelector}
            >
                <baseui.SelectTrigger aria-invalid={invalid || undefined} className={triggerClassName}>
                    <baseui.SelectValue placeholder={currencyPlaceholder ?? ''} />
                </baseui.SelectTrigger>
                <baseui.SelectContent>
                    <baseui.SelectGroup>
                        {normalizedCurrencies.map((curr) => (
                            <baseui.SelectItem key={curr.value} value={curr.value}>
                                {curr.label}
                            </baseui.SelectItem>
                        ))}
                    </baseui.SelectGroup>
                </baseui.SelectContent>
            </baseui.Select>
        </div>
    );

    return (
        <div className="flex items-start gap-2">
            {currencyPosition === 'start' && currencySelector}

            <div className="flex-1">
                <DecimalInput
                    ref={forwardedRef}
                    decimalPlaces={2}
                    allowNegative={false}
                    disabled={disabled}
                    invalid={invalid}
                    {...decimalInputProps}
                />
            </div>

            {currencyPosition === 'end' && currencySelector}
        </div>
    );
}

// forwardRef + memo: forward to the underlying decimal input so consumers
// can focus/measure programmatically.
export const CurrencyInput = memo(forwardRef<HTMLInputElement, CurrencyInputProps>(CurrencyInputImpl));
CurrencyInput.displayName = 'CurrencyInput';
