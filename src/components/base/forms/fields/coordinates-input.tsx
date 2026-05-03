import { useEffect, useMemo, useState, useCallback } from 'react';
import { Label, TextLink } from '@/components/typography';
import { useStrings, type StringsProp } from '@/lib/strings';
import { cn } from '@/lib/utils';
import { DecimalInput } from './decimal-input';

export interface CoordinatesObjectValue {
    lat?: string;
    lng?: string;
}

export type CoordinatesValue = string | CoordinatesObjectValue;

export interface CoordinatesInputStrings {
    /** Above-field label for the latitude input. Empty string hides it. */
    latLabel: string;
    /** Above-field label for the longitude input. Empty string hides it. */
    lngLabel: string;
    /** Placeholder shown in the latitude input. */
    latPlaceholder: string;
    /** Placeholder shown in the longitude input. */
    lngPlaceholder: string;
    /** Anchor text for the Google Maps preview link. Empty string hides it. */
    previewLinkLabel: string;
}

export const defaultCoordinatesInputStrings: CoordinatesInputStrings = {
    latLabel: '',
    lngLabel: '',
    latPlaceholder: '',
    lngPlaceholder: '',
    previewLinkLabel: '',
};

export interface CoordinatesInputProps {
    /** Controlled value */
    value?: CoordinatesValue;

    /** Default value for uncontrolled mode */
    defaultValue?: CoordinatesValue;

    /** Output format */
    format?: 'string' | 'object';

    /** Change handler */
    onChange?: (e: { target: { value: CoordinatesValue } }) => void;

    /** @deprecated Use `strings.latLabel`. */
    latLabel?: string;

    /** @deprecated Use `strings.lngLabel`. */
    lngLabel?: string;

    /** @deprecated Use `strings.latPlaceholder`. */
    latPlaceholder?: string;

    /** @deprecated Use `strings.lngPlaceholder`. */
    lngPlaceholder?: string;

    /** Number of decimal places */
    decimalPlaces?: number;

    /** Show preview link to Google Maps */
    showPreviewLink?: boolean;

    /** @deprecated Use `strings.previewLinkLabel`. */
    previewLinkLabel?: string;

    /** Override default strings (labels + placeholders + preview link). */
    strings?: StringsProp<CoordinatesInputStrings>;

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
    strings: stringsProp,
    invalid,
    className,
    disabled,
}: CoordinatesInputProps) {
    const strings = useStrings(defaultCoordinatesInputStrings, {
        ...(latLabel !== undefined ? { latLabel } : {}),
        ...(lngLabel !== undefined ? { lngLabel } : {}),
        ...(latPlaceholder !== undefined ? { latPlaceholder } : {}),
        ...(lngPlaceholder !== undefined ? { lngPlaceholder } : {}),
        ...(previewLinkLabel !== undefined ? { previewLinkLabel } : {}),
        ...stringsProp,
    });
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
                    {!!strings.latLabel && <Label>{strings.latLabel}</Label>}
                    <DecimalInput
                        placeholder={strings.latPlaceholder || undefined}
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
                    {!!strings.lngLabel && <Label>{strings.lngLabel}</Label>}
                    <DecimalInput
                        placeholder={strings.lngPlaceholder || undefined}
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

            {!!showPreviewLink && !!mapUrl && !!strings.previewLinkLabel && (
                <TextLink href={mapUrl} type="secondary" underline={false}>
                    {strings.previewLinkLabel}
                </TextLink>
              )}
        </div>
    );
}

CoordinatesInput.displayName = 'CoordinatesInput';
