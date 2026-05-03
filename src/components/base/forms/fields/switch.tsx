/**
 * Switch — base wrapper around the shadcn switch primitive.
 *
 * Two flavors:
 *  - `Switch` — emits `ImitationEvent` (`{ target: { name, value } }`) so it
 *    plugs into form-field bindings and synthetic onChange handlers.
 *  - `ToggleSwitch` — emits a plain `boolean` for simpler controlled flows.
 *
 * Both forward refs to the underlying button so consumers can focus / measure
 * the switch programmatically.
 */
import type { ComponentProps } from 'react';
import { forwardRef, useCallback, useMemo } from 'react';
import { Switch as SwitchPrimitive } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export interface ImitationEvent {
    target: {
        name: string;
        value: boolean;
    };
}

type BaseSwitchProps = ComponentProps<typeof SwitchPrimitive>;
type SwitchElement = React.ElementRef<typeof SwitchPrimitive>;

export interface SwitchProps extends Omit<BaseSwitchProps, 'onCheckedChange'> {
    /** Event-style change handler for form compatibility. */
    onCheckedChange?: (event: ImitationEvent) => void;
    /** Error state for styling (passed from FormField). */
    invalid?: boolean;
}

export const Switch = forwardRef<SwitchElement, SwitchProps>(function Switch(
    { onCheckedChange, invalid, className, ...rest },
    ref,
) {
    const name = useMemo(() => {
        if (rest.name) return String(rest.name);
        if (rest.id) return String(rest.id);
        return String(new Date().getTime());
    }, [rest.id, rest.name]);

    const resolvedId = rest.id ?? name;

    const handleChange = useCallback(
        (checked: boolean) => {
            onCheckedChange?.({
                target: { name, value: checked },
            });
        },
        [name, onCheckedChange]
    );

    return (
        <SwitchPrimitive
            ref={ref}
            {...rest}
            onCheckedChange={handleChange}
            id={resolvedId}
            name={name}
            aria-invalid={invalid || undefined}
            className={cn('switch--component', 
                invalid && 'data-[state=unchecked]:border-destructive',
                className
            )}
        />
    );
});

Switch.displayName = 'Switch';

export type ToggleSwitchProps = Omit<BaseSwitchProps, 'onCheckedChange'> & {
    onCheckedChange?: (checked: boolean) => void;
    invalid?: boolean;
};

export const ToggleSwitch = forwardRef<SwitchElement, ToggleSwitchProps>(function ToggleSwitch(
    { onCheckedChange, invalid, className, ...props },
    ref,
) {
    return (
        <SwitchPrimitive
            ref={ref}
            {...props}
            onCheckedChange={(checked) => onCheckedChange?.(checked)}
            aria-invalid={invalid || undefined}
            className={cn(invalid && 'data-[state=unchecked]:border-destructive', className)}
        />
    );
});

ToggleSwitch.displayName = 'ToggleSwitch';
