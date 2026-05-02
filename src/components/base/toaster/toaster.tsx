/**
 * Toaster — base wrapper around the shadcn `ui/sonner` `<Toaster>` that
 * applies library-wide defaults from `<UIProvider>`:
 *
 *   - `toast.duration` → default lifetime in ms
 *   - `toast.position` → default screen corner
 *
 * Per-mount props (`duration`, `position`) on this component still win
 * over the store, so a single `<Toaster duration={10_000} />` continues
 * to override the global default.
 */
import type { ToasterProps } from 'sonner';

import { Toaster as PrimitiveToaster } from '@/components/ui/sonner';
import { useToastConfig } from '@/lib/ui-provider';

export type { ToasterProps };

export function Toaster(props: ToasterProps) {
    const { duration, position } = useToastConfig();

    const resolvedDuration = props.duration ?? duration;
    const resolvedPosition = props.position ?? position;

    return (
        <PrimitiveToaster
            {...props}
            duration={resolvedDuration}
            position={resolvedPosition}
        />
    );
}

Toaster.displayName = 'Toaster';
