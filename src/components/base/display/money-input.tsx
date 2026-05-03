import { AlertTriangle, Info } from 'lucide-react';
import { useCallback, useMemo, type ReactNode } from 'react';

import { MoneyInput as BaseMoneyInput, type MoneyInputProps as BaseMoneyInputProps } from '@/components/base/forms/fields/money-input';
import { FormField } from '@/components/base/forms/form-field';
import { Text } from '@/components/typography';
import { Alert, AlertDescription } from '@/components/base/display/alert';
import { cn } from '@/lib/utils';
import type { CurrencyCode } from '@/lib/ui-provider';

/** Optional money payload for migration hints. Consumers map their domain
 *  shape into this — `formatted` is the consumer's pre-rendered display
 *  string for the alternate currency leg. */
export interface MoneyData {
    amount?: number | string | null;
    currency?: string | null;
    /** Optional original/record currency that triggered a migration warning. */
    recordCurrency?: string | null;
    /** Optional secondary leg the consumer formatted for display. */
    pair?: { formatted?: string | null } | null;
}

export interface MoneyInputData {
    amount: number;
    currency: CurrencyCode;
}

export interface MoneyInputProps extends Omit<BaseMoneyInputProps, 'invalid'> {
    /** Optional money payload for migration hints */
    money?: MoneyData | null;
    /** Display label */
    label?: string;
    /** Hint next to label */
    hint?: string;
    /** Helper text below input */
    helperText?: string;
    /** Error message */
    error?: string;
    /** Required indicator */
    required?: boolean;
    /** Invalid state override */
    invalid?: boolean;
    /** Optional change handler for combined data */
    onChangeData?: (data: MoneyInputData) => void;
    /** Record currency for migration detection */
    recordCurrency?: CurrencyCode;
    /** Show migration warning block */
    showMigrationWarning?: boolean;
    /** Custom migration warning message */
    migrationWarningMessage?: ReactNode;
    /** Show original currency hint */
    showOriginalHint?: boolean;
}

const defaultEmptyFormatted = '—';

const resolveFormatted = (formatted: unknown): string =>
    typeof formatted === 'string' ? formatted.trim() : '';

export function MoneyInput({
    money,
    currency = 'EUR',
    onChangeData,
    recordCurrency: recordCurrencyProp,
    label,
    hint,
    helperText,
    error,
    required,
    invalid,
    showMigrationWarning = true,
    migrationWarningMessage,
    showOriginalHint = true,
    className,
    onChange,
    onCurrencyChange,
    ...props
}: MoneyInputProps) {
    const recordCurrency = recordCurrencyProp ?? money?.recordCurrency ?? undefined;

    const willMigrate = useMemo(
        () => recordCurrency !== undefined && recordCurrency !== currency,
        [recordCurrency, currency],
    );

    const otherFormatted = useMemo(() => {
        if (!showOriginalHint) return '';
        return resolveFormatted(money?.pair?.formatted);
    }, [showOriginalHint, money?.pair?.formatted]);

    const showOriginalHintBlock = otherFormatted.length > 0 && !error;
    const showMigrationBlock = willMigrate && showMigrationWarning;

    const handleAmountChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e);
            const parsed = Number.parseFloat(e.target.value);
            const safeAmount = Number.isFinite(parsed) ? parsed : 0;
            onChangeData?.({ amount: safeAmount, currency });
        },
        [onChange, onChangeData, currency],
    );

    const handleCurrencyChange = useCallback(
        (nextCurrency: CurrencyCode) => {
            onCurrencyChange?.(nextCurrency);
            const parsedValue = Number.parseFloat(String(props.value ?? ''));
            const safeAmount = Number.isFinite(parsedValue) ? parsedValue : 0;
            onChangeData?.({ amount: safeAmount, currency: nextCurrency });
        },
        [onCurrencyChange, onChangeData, props.value],
    );

    const isInvalid = invalid ?? Boolean(error);

    const inputNode = (
        <BaseMoneyInput
            {...props}
            currency={currency}
            onChange={handleAmountChange}
            onCurrencyChange={handleCurrencyChange}
            invalid={isInvalid}
        />
    );

    const hasChrome = Boolean(label || hint || helperText || error || required);
    const renderedInput = hasChrome ? (
        <FormField
            label={label}
            hint={hint}
            helperText={helperText}
            error={error}
            required={required}
        >
            {inputNode}
        </FormField>
    ) : inputNode;

    return (
        <div className={cn('money-input--component', 'space-y-2', className)}>
            {renderedInput}

            {!!showOriginalHintBlock && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Info className="h-3.5 w-3.5 shrink-0" />
                    <Text size="xs" type="secondary">
                        {otherFormatted || defaultEmptyFormatted}
                    </Text>
                </div>
            )}

            {!!showMigrationBlock && (
                <Alert className="border-warning/50 bg-warning/5 py-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <AlertDescription className="text-warning-foreground text-xs">
                        {migrationWarningMessage ??
                            `Currency will be converted from ${recordCurrency ?? ''} to ${currency}.`}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}

MoneyInput.displayName = 'MoneyInput';
