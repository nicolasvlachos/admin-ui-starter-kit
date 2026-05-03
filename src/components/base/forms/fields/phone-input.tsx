import * as React from 'react';
import { useState, useCallback, useMemo, memo } from 'react';
import * as baseui from '@/components/ui/select';
import { Text } from '@/components/typography';
import { useStrings, type StringsProp } from '@/lib/strings';
import { useFormsConfig } from '@/lib/ui-provider';
import { cn } from '@/lib/utils';
import { formControlSizeClasses, resolveFormControlSize } from '../form-sizing';
import { Input, type InputProps } from './input';

export interface PhoneInputStrings {
    prefixPlaceholder: string;
}

export const defaultPhoneInputStrings: PhoneInputStrings = {
    prefixPlaceholder: 'Prefix',
};

export interface CountryPrefixOption {
    /** Country code value (e.g., '+1') */
    value: string;

    /** Display label (e.g., 'Bulgaria') */
    label: string;

    /** ISO country code (e.g., 'US') */
    iso: string;
}

/** Country data mapped by ISO code */
export const COUNTRY_PREFIX_MAP: Record<string, CountryPrefixOption> = {
    US: { value: '+1', label: 'United States', iso: 'US' },
    CA: { value: '+1', label: 'Canada', iso: 'CA' },
    AU: { value: '+61', label: 'Australia', iso: 'AU' },
    BG: { value: '+359', label: 'Bulgaria', iso: 'BG' },
    GR: { value: '+30', label: 'Greece', iso: 'GR' },
    GB: { value: '+44', label: 'United Kingdom', iso: 'GB' },
    DE: { value: '+49', label: 'Germany', iso: 'DE' },
    FR: { value: '+33', label: 'France', iso: 'FR' },
    IT: { value: '+39', label: 'Italy', iso: 'IT' },
    ES: { value: '+34', label: 'Spain', iso: 'ES' },
    NL: { value: '+31', label: 'Netherlands', iso: 'NL' },
    BE: { value: '+32', label: 'Belgium', iso: 'BE' },
    AT: { value: '+43', label: 'Austria', iso: 'AT' },
    CH: { value: '+41', label: 'Switzerland', iso: 'CH' },
    PL: { value: '+48', label: 'Poland', iso: 'PL' },
    RO: { value: '+40', label: 'Romania', iso: 'RO' },
    RS: { value: '+381', label: 'Serbia', iso: 'RS' },
    HR: { value: '+385', label: 'Croatia', iso: 'HR' },
    SI: { value: '+386', label: 'Slovenia', iso: 'SI' },
    MK: { value: '+389', label: 'North Macedonia', iso: 'MK' },
    TR: { value: '+90', label: 'Turkey', iso: 'TR' },
    RU: { value: '+7', label: 'Russia', iso: 'RU' },
    UA: { value: '+380', label: 'Ukraine', iso: 'UA' },
    SK: { value: '+421', label: 'Slovakia', iso: 'SK' },
    CZ: { value: '+420', label: 'Czech Republic', iso: 'CZ' },
    HU: { value: '+36', label: 'Hungary', iso: 'HU' },
    PT: { value: '+351', label: 'Portugal', iso: 'PT' },
    IE: { value: '+353', label: 'Ireland', iso: 'IE' },
    SE: { value: '+46', label: 'Sweden', iso: 'SE' },
    NO: { value: '+47', label: 'Norway', iso: 'NO' },
    DK: { value: '+45', label: 'Denmark', iso: 'DK' },
    FI: { value: '+358', label: 'Finland', iso: 'FI' },
    CY: { value: '+357', label: 'Cyprus', iso: 'CY' },
    AL: { value: '+355', label: 'Albania', iso: 'AL' },
    ME: { value: '+382', label: 'Montenegro', iso: 'ME' },
    BA: { value: '+387', label: 'Bosnia and Herzegovina', iso: 'BA' },
    XK: { value: '+383', label: 'Kosovo', iso: 'XK' },
    MD: { value: '+373', label: 'Moldova', iso: 'MD' },
    BY: { value: '+375', label: 'Belarus', iso: 'BY' },
    LT: { value: '+370', label: 'Lithuania', iso: 'LT' },
    LV: { value: '+371', label: 'Latvia', iso: 'LV' },
    EE: { value: '+372', label: 'Estonia', iso: 'EE' },
};

/** Type for prefix input - either ISO code string or full option object */
export type CountryPrefixInput = string | CountryPrefixOption;

/** Default country prefixes - commonly used codes */
export const DEFAULT_COUNTRY_PREFIXES: CountryPrefixInput[] = ['US', 'CA', 'GB', 'DE', 'FR', 'IT', 'ES', 'AU'];

/**
 * Normalize prefix input to CountryPrefixOption
 * Accepts either ISO code ('US') or full object ({ value: '+1', label: 'United States', iso: 'US' })
 */
const normalizePrefixInput = (input: CountryPrefixInput): CountryPrefixOption | null => {
    if (typeof input === 'string') {
        // It's an ISO code - look it up
        const upperInput = input.toUpperCase();
        return COUNTRY_PREFIX_MAP[upperInput] ?? null;
    }
    // It's already a full object
    return input;
};

/**
 * Normalize array of prefix inputs to CountryPrefixOption[]
 */
const normalizePrefixes = (inputs: CountryPrefixInput[]): CountryPrefixOption[] => {
    return inputs.map(normalizePrefixInput).filter((p): p is CountryPrefixOption => p !== null);
};

export interface PhoneInputProps extends Omit<InputProps, 'type' | 'startAddon' | 'strings'> {
    /** Normalize phone number on blur. Defaults to true */
    normalizeOnBlur?: boolean;

    /** Current country prefix value (dial code like '+1' or ISO code like 'US') */
    prefix?: string;

    /** Default prefix if uncontrolled (dial code like '+1' or ISO code like 'US') */
    defaultPrefix?: string;

    /** List of available country prefixes - ISO codes ('US', 'GR') or full objects */
    prefixes?: CountryPrefixInput[];

    /** Callback when prefix changes - returns dial code (e.g., '+1') */
    onPrefixChange?: (prefix: string) => void;

    /** Disable prefix selection */
    disablePrefixSelector?: boolean;

    /** Placeholder for prefix dropdown */
    prefixPlaceholder?: string;

    /** Width of the prefix dropdown */
    prefixWidth?: string;

    /** Show country name in dropdown. Defaults to true */
    showCountryName?: boolean;

    /** Show prefix in dropdown items. Defaults to true */
    showPrefixInDropdown?: boolean;

    /** String overrides (e.g. prefix dropdown placeholder). */
    strings?: StringsProp<PhoneInputStrings>;
}

const normalizePhone = (value: string, selectedPrefix?: string): string => {
    let normalized = value
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[^\d ()+-]/g, '');

    // Strip the selected prefix from the input if the user typed it redundantly
    if (selectedPrefix && normalized.startsWith(selectedPrefix)) {
        normalized = normalized.slice(selectedPrefix.length).replace(/^[\s-]+/, '');
    }

    // Strip leading zero from national numbers when a prefix is selected (e.g., 0877... → 877...)
    if (selectedPrefix && normalized.startsWith('0')) {
        normalized = normalized.slice(1);
    }

    return normalized;
};

/**
 * Resolve a prefix string (ISO code or dial code) to dial code
 */
const resolvePrefixToDialCode = (prefix: string | undefined, normalizedPrefixes: CountryPrefixOption[]): string => {
    if (!prefix) return normalizedPrefixes[0]?.value ?? '';

    // Check if it's already a dial code (starts with +)
    if (prefix.startsWith('+')) {
        return prefix;
    }

    // It's an ISO code - look it up
    const upperPrefix = prefix.toUpperCase();
    const found = COUNTRY_PREFIX_MAP[upperPrefix];
    return found?.value ?? prefix;
};

function PhoneInputImpl(
    {
        normalizeOnBlur = true,
        onBlur,
        onChange,
        prefix: controlledPrefix,
        defaultPrefix,
        prefixes = DEFAULT_COUNTRY_PREFIXES,
        onPrefixChange,
        disablePrefixSelector = false,
        prefixPlaceholder,
        prefixWidth = 'w-[120px]',
        showCountryName = true,
        showPrefixInDropdown = true,
        invalid,
        disabled,
        className,
        size: sizeProp,
        strings: stringsProp,
        ...props
    }: PhoneInputProps,
    forwardedRef: React.ForwardedRef<HTMLInputElement>,
) {
    const { defaultControlSize } = useFormsConfig();
    const size = resolveFormControlSize(sizeProp, defaultControlSize);
    const strings = useStrings(defaultPhoneInputStrings, stringsProp);
    // Normalize prefix options from mixed input (ISO codes or full objects)
    const normalizedPrefixes = useMemo(() => normalizePrefixes(prefixes), [prefixes]);

    // Resolve controlled/default prefix to dial code
    const resolvedDefaultPrefix = useMemo(
        () => resolvePrefixToDialCode(defaultPrefix, normalizedPrefixes),
        [defaultPrefix, normalizedPrefixes]
    );

    // Internal state for uncontrolled prefix (always stores dial code)
    const [internalPrefix, setInternalPrefix] = useState(resolvedDefaultPrefix);

    // Determine if prefix is controlled
    const isPrefixControlled = controlledPrefix !== undefined;
    const selectedPrefix = isPrefixControlled
        ? resolvePrefixToDialCode(controlledPrefix, normalizedPrefixes)
        : internalPrefix;

    // Find current prefix option for display
    const currentPrefixOption = useMemo(
        () => normalizedPrefixes.find((p) => p.value === selectedPrefix),
        [normalizedPrefixes, selectedPrefix]
    );

    // Handle prefix change
    const handlePrefixChange = useCallback(
        (newPrefix: string | null) => {
            if (newPrefix === null) return;
            if (!isPrefixControlled) {
                setInternalPrefix(newPrefix);
            }
            onPrefixChange?.(newPrefix);
        },
        [isPrefixControlled, onPrefixChange]
    );

    // Handle phone change — strip redundant prefix on every keystroke/autofill
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            if (!onChange) return;

            const raw = event.target.value;

            // Strip the selected prefix if the value starts with it (autofill, paste, manual typing)
            if (selectedPrefix && raw.startsWith(selectedPrefix)) {
                const stripped = raw.slice(selectedPrefix.length).replace(/^[\s-]+/, '');
                // Also strip leading zero from national part
                const national = stripped.startsWith('0') ? stripped.slice(1) : stripped;
                if (national !== raw) {
                    const syntheticEvent = {
                        ...event,
                        target: { ...event.target, value: national },
                        currentTarget: { ...event.currentTarget, value: national },
                    } as unknown as React.ChangeEvent<HTMLInputElement>;
                    onChange(syntheticEvent);
                    return;
                }
            }

            onChange(event);
        },
        [onChange, selectedPrefix]
    );

    // Handle phone blur with normalization
    const handleBlur: React.FocusEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            if (normalizeOnBlur && typeof onChange === 'function') {
                const nextValue = normalizePhone(event.target.value, selectedPrefix);
                if (nextValue !== event.target.value) {
                    const syntheticEvent = {
                        ...event,
                        target: { ...event.target, value: nextValue },
                        currentTarget: { ...event.currentTarget, value: nextValue },
                    } as unknown as React.ChangeEvent<HTMLInputElement>;

                    onChange(syntheticEvent);
                }
            }

            onBlur?.(event);
        },
        [normalizeOnBlur, onChange, onBlur, selectedPrefix]
    );

    // If no prefixes or disabled, render simple input with prefix display
    if (normalizedPrefixes.length === 0 || disablePrefixSelector) {
        const staticPrefix = selectedPrefix || defaultPrefix;

        if (!staticPrefix) {
            return (
                <Input
                    ref={forwardedRef}
                    size={size}
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={invalid}
                    disabled={disabled}
                    className={className}
                    {...props}
                />
            );
        }

        return (
            <div className="flex items-start gap-2">
                <div
                    aria-invalid={invalid || undefined}
                    className={cn(
                        'flex items-center justify-center rounded-md border border-input bg-muted px-3',
                        formControlSizeClasses[size],
                        disabled && 'opacity-50',
                        'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20'
                    )}
                >
                    <Text tag="span" type="secondary" weight="medium">
                        {staticPrefix}
                    </Text>
                </div>
                <div className="flex-1">
                    <Input
                        ref={forwardedRef}
                        size={size}
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={invalid}
                        disabled={disabled}
                        className={className}
                        {...props}
                    />
                </div>
            </div>
        );
    }

    // Render with prefix selector
    return (
        <div className="flex items-start gap-2">
            {/* Prefix selector */}
            <baseui.Select
                value={selectedPrefix}
                onValueChange={(value) => handlePrefixChange(value)}
                disabled={disabled}
            >
                <baseui.SelectTrigger
                    aria-invalid={invalid || undefined}
                    className={cn(
                        'border-input bg-transparent shrink-0',
                        formControlSizeClasses[size],
                        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                        prefixWidth,
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    <baseui.SelectValue placeholder={prefixPlaceholder ?? strings.prefixPlaceholder}>
                        {!!currentPrefixOption && (
                            <Text tag="span" weight="medium">
                                {currentPrefixOption.value}
                            </Text>
                          )}
                    </baseui.SelectValue>
                </baseui.SelectTrigger>
                <baseui.SelectContent>
                    <baseui.SelectGroup>
                        {normalizedPrefixes.map((prefixOption) => (
                            <baseui.SelectItem key={prefixOption.value} value={prefixOption.value}>
                                <div className="flex items-center gap-2">
                                    {!!showPrefixInDropdown && (
                                        <Text tag="span" weight="medium" className="min-w-[50px]">
                                            {prefixOption.value}
                                        </Text>
                                      )}
                                    {!!showCountryName && (
                                        <Text tag="span" type="secondary" lineHeight="tight">
                                            {prefixOption.label}
                                        </Text>
                                      )}
                                </div>
                            </baseui.SelectItem>
                        ))}
                    </baseui.SelectGroup>
                </baseui.SelectContent>
            </baseui.Select>

            {/* Phone number input */}
            <div className="flex-1">
                <Input
                    ref={forwardedRef}
                    size={size}
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={invalid}
                    disabled={disabled}
                    className={className}
                    {...props}
                />
            </div>
        </div>
    );
}

// forwardRef + memo: forward to the underlying phone input so consumers can
// focus/measure programmatically (RHF Controller, parent imperative refs).
export const PhoneInput = memo(React.forwardRef<HTMLInputElement, PhoneInputProps>(PhoneInputImpl));
PhoneInput.displayName = 'PhoneInput';
