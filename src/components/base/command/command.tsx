/**
 * Command — base wrapper around the shadcn `ui/command` (cmdk) primitive.
 *
 * What this layer adds on top of the primitive:
 *  - Density-aware list-row padding via `var(--row-py)`.
 *  - `xs` typography by default for items (admin-density), with the
 *    primitive's typography preserved as a `density="default"` variant.
 *  - Tighter `Command` root padding aligned to the popover content pad.
 *  - Re-exports every primitive part untouched so the compound-component
 *    pattern keeps working: consumers compose
 *    `<Command><CommandList><CommandGroup><CommandItem/></CommandGroup></CommandList></Command>`.
 *
 * For the recurring "popover-with-command-list" pattern, prefer
 * `base/popover-menu/` which composes both wrappers and adds slots.
 */
import * as React from 'react';

import {
    Command as CommandPrimitive,
    CommandEmpty as CommandEmptyPrimitive,
    CommandGroup as CommandGroupPrimitive,
    CommandInput,
    CommandList as CommandListPrimitive,
    CommandSeparator,
    CommandShortcut,
    CommandItem as CommandItemPrimitive,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

type CommandRootProps = React.ComponentProps<typeof CommandPrimitive>;

function Command({ className, ...props }: CommandRootProps) {
    return (
        <CommandPrimitive
            className={cn('command--component', 
                // Tighter than the primitive; popover-content already pads the outer.
                'rounded-md! p-0 bg-transparent',
                className,
            )}
            {...props}
        />
    );
}

type CommandListProps = React.ComponentProps<typeof CommandListPrimitive>;

function CommandList({ className, ...props }: CommandListProps) {
    return (
        <CommandListPrimitive
            className={cn('max-h-72 px-1 py-1', className)}
            {...props}
        />
    );
}

type CommandGroupProps = React.ComponentProps<typeof CommandGroupPrimitive>;

function CommandGroup({ className, ...props }: CommandGroupProps) {
    return (
        <CommandGroupPrimitive
            className={cn(
                'p-0 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-1.5 [&_[cmdk-group-heading]]:pb-0.5 [&_[cmdk-group-heading]]:text-[length:var(--text-xxs)] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground',
                className,
            )}
            {...props}
        />
    );
}

type CommandItemProps = React.ComponentProps<typeof CommandItemPrimitive>;

function CommandItem({ className, ...props }: CommandItemProps) {
    return (
        <CommandItemPrimitive
            className={cn(
                // Density-tokenized vertical padding; xs typography for admin density.
                'px-2 py-(--row-py) gap-2 rounded-md text-[length:var(--text-xs)]',
                className,
            )}
            {...props}
        />
    );
}

type CommandEmptyProps = React.ComponentProps<typeof CommandEmptyPrimitive>;

function CommandEmpty({ className, ...props }: CommandEmptyProps) {
    return (
        <CommandEmptyPrimitive
            className={cn('py-4 text-center text-[length:var(--text-xs)] text-muted-foreground', className)}
            {...props}
        />
    );
}

export {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
};
