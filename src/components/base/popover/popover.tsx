/**
 * Popover — base wrapper around the shadcn `ui/popover` primitive.
 *
 * What this layer adds on top of the primitive:
 *  - Library-default `sideOffset` (6px) and tighter content padding,
 *    consumed via the `--popover-content-pad` CSS variable in App.css.
 *  - A consistent shadow + border treatment matching the rest of the
 *    library (subtle ring, no harsh shadow).
 *  - Re-exports every primitive part untouched so the compound-component
 *    pattern from shadcn keeps working: consumers compose
 *    `<Popover>`, `<PopoverTrigger>`, `<PopoverContent>` exactly as
 *    they would with the primitive.
 *
 * Override at the call site via `className` for one-offs, or override
 * `--popover-content-pad` on a wrapping element for surface-wide
 * density tweaks.
 */
import * as React from 'react';

import {
    Popover as PopoverPrimitive,
    PopoverAnchor,
    PopoverContent as PopoverContentPrimitive,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type PopoverContentBaseProps = React.ComponentProps<typeof PopoverContentPrimitive>;

function PopoverContent({
    className,
    sideOffset = 6,
    style,
    ...props
}: PopoverContentBaseProps) {
    return (
        <PopoverContentPrimitive
            sideOffset={sideOffset}
            className={cn('popover--component', 
                // Tighter than the primitive's `p-4` default, density-tokenized.
                'p-(--popover-content-pad)',
                // Single chrome layer: 1px hairline border + soft shadow. The
                // primitive ships its own `ring-1 ring-foreground/10`; we
                // suppress it so the popover doesn't read as a 2px outline.
                'border border-border/60 shadow-md ring-0',
                className,
            )}
            style={style}
            {...props}
        />
    );
}

export {
    PopoverPrimitive as Popover,
    PopoverAnchor,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
};
