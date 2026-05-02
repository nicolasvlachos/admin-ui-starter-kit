import { useEffect, useMemo, useState, useCallback } from 'react';
import { Label, TextLink } from '@/components/typography';
import { cn } from '@/lib/utils';
import { DecimalInput } from './decimal-input';

export interface CoordinatesObjectValue {
    lat?: string;
    lng?: string;
}

export type CoordinatesValue = string | CoordinatesObjectValue;

export interface CoordinatesInputProps {
    /** Controlled value */
    value?: CoordinatesValue;

    /** Default value for uncontrolled mode */
    defaultValue?: CoordinatesValue;

    /** Output format */
    format?: 'string' | 'object';

    /** Change handler */
    onChange?: (e: { target: { value: CoordinatesValue } }) => void;

    /** Label for latitude field */
    latLabel?: string;

    /** Label for longitude field */
    lngLabel?: string;

    /** Placeholder for latitude field */
    latPlaceholder?: string;

    /** Placeholder for longitude field */
    lngPlaceholder?: string;

    /** Number of decimal places */
    decimalPlaces?: number;

    /** Show preview link to Google Maps */
    showPreviewLink?: boolean;

    /** Label for preview link */
    previewLinkLabel?: string;

    /** Error state for styling (passed from FormField) */
    invalid?: boolean;

    /** Additional class names */
    className?: string;

    /** Disabled state */
    disabled?: boolean;
}

const parseValue = (
    value: CoordinatesValue | undefined,
    format: 'string' | 'object'
): { lat: string; lng: string } => {
    if (!value) {
        return { lat: '', lng: '' };
    }

    if (format === 'string' && typeof value === 'string') {
        const [lat, lng] = value.split(',').map((part) => part.trim());
        return { lat: lat ?? '', lng: lng ?? '' };
    }

    if (format === 'object' && typeof value === 'object') {
        return { lat: value.lat ?? '', lng: value.lng ?? '' };
    }

    return { lat: '', lng: '' };
};

const formatValue = (lat: string, lng: string, format: 'string' | 'object'): CoordinatesValue => {
    if (format === 'string') {
        return `${lat},${lng}`;
    }
    return { lat, lng };
};

const isFiniteNumberInRange = (value: string, min: number, max: number): boolean => {
    if (!value) return false;
    const num = Number(value);
    return Number.isFinite(num) && num >= min && num <= max;
};

export function CoordinatesInput({
    value: controlledValue,
    defaultValue,
    format = 'object',
    onChange,
    latLabel,
    lngLabel,
    latPlaceholder,
    lngPlaceholder,
    decimalPlaces = 6,
    showPreviewLink = true,
    previewLinkLabel,
    invalid,
    className,
    disabled,
}: CoordinatesInputProps) {
    const isControlled = controlledValue !== undefined;

    const initialParsed = parseValue(isControlled ? controlledValue : defaultValue, format);
    const [internalLat, setInternalLat] = useState(initialParsed.lat);
    const [internalLng, setInternalLng] = useState(initialParsed.lng);

    const parsedControlled = parseValue(controlledValue, format);
    const lat = isControlled ? parsedControlled.lat : internalLat;
    const lng = isControlled ? parsedControlled.lng : internalLng;

    useEffect(() => {
        if (isControlled) {
            setInternalLat(parsedControlled.lat);
            setInternalLng(parsedControlled.lng);
        }
    }, [isControlled, parsedControlled.lat, parsedControlled.lng]);

    const update = useCallback(
        (nextLat: string, nextLng: string) => {
            if (!isControlled) {
                setInternalLat(nextLat);
                setInternalLng(nextLng);
            }

            onChange?.({ target: { value: formatValue(nextLat, nextLng, format) } });
        },
        [isControlled, onChange, format]
    );

    const mapUrl = useMemo(() => {
        const hasValidLat = isFiniteNumberInRange(lat, -90, 90);
        const hasValidLng = isFiniteNumberInRange(lng, -180, 180);
        if (!hasValidLat || !hasValidLng) return null;
        return `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}`;
    }, [lat, lng]);

    return (
        <div className={cn('space-y-3', className)}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-2">
                    {!!latLabel && <Label>{latLabel}</Label>}
                    <DecimalInput
                        placeholder={latPlaceholder}
                        value={lat}
                        onChange={(e) => update(e.target.value, lng)}
                        decimalPlaces={decimalPlaces}
                        allowNegative
                        min={-90}
                        max={90}
                        invalid={invalid}
                        disabled={disabled}
                    />
                </div>
                <div className="space-y-2">
                    {!!lngLabel && <Label>{lngLabel}</Label>}
                    <DecimalInput
                        placeholder={lngPlaceholder}
                        value={lng}
                        onChange={(e) => update(lat, e.target.value)}
                        decimalPlaces={decimalPlaces}
                        allowNegative
                        min={-180}
                        max={180}
                        invalid={invalid}
                        disabled={disabled}
                    />
                </div>
            </div>

            {!!showPreviewLink && !!mapUrl && !!previewLinkLabel && (
                <TextLink href={mapUrl} size="sm" type="secondary" underline={false}>
                    {previewLinkLabel}
                </TextLink>
              )}
        </div>
    );
}

CoordinatesInput.displayName = 'CoordinatesInput';
