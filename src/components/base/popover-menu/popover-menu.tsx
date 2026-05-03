/**
 * PopoverMenu — composed wrapper around `base/popover` + `base/command`.
 *
 * Captures the recurring "trigger → optional header → search → command list"
 * pattern used by filter facets, operator selects, and similar pickers
 * across the library.
 *
 * Slots (all optional):
 *   - `header`   — rendered above the search input / list
 *   - `footer`   — rendered below the list (e.g. confirm/clear buttons)
 *   - `empty`    — replaces the default empty-state copy
 *   - `loading`  — rendered above the list when `loading` is true
 *
 * Render-prop:
 *   - `renderItem={(item, ctx) => ReactNode}` — full control over a row
 *
 * Strings:
 *   - `strings={{ searchPlaceholder, empty, loading }}` — merged with defaults
 *
 * For headless usage (custom UI against the same selection state),
 * compose `base/popover` + `base/command` directly.
 */
import { Loader2 } from 'lucide-react';
import * as React from 'react';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/base/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/base/popover';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import {
    defaultPopoverMenuStrings,
    type PopoverMenuItem,
    type PopoverMenuStrings,
} from './popover-menu.types';

export interface PopoverMenuRenderItemContext {
    /** True when the item is the user's currently-active match (cmdk highlight). */
    isHighlighted: boolean;
}

export interface PopoverMenuProps<T = unknown> {
    /** Trigger element. The popover anchors to it. Pass any clickable. */
    trigger: React.ReactNode;
    /** Items to render in the list. */
    items: ReadonlyArray<PopoverMenuItem<T>>;
    /** Selection callback — fires on row click / Enter. */
    onSelect: (item: PopoverMenuItem<T>) => void;

    /** Controlled open state. Omit for uncontrolled. */
    open?: boolean;
    /** Open-state callback for controlled / uncontrolled flows. */
    onOpenChange?: (open: boolean) => void;

    /** Show the search input above the list. Default: true. */
    search?: boolean;
    /** Search input value (controlled). */
    searchValue?: string;
    /** Search input change callback. */
    onSearchChange?: (value: string) => void;

    /** Async loading flag — shows the loading slot above the list. */
    loading?: boolean;

    /** Optional pre-list slot (e.g. a label / eyebrow). */
    header?: React.ReactNode;
    /** Optional post-list slot (e.g. confirm / clear buttons). */
    footer?: React.ReactNode;
    /** Override empty-state slot (defaults to `strings.empty`). */
    empty?: React.ReactNode;
    /** Override loading slot (defaults to spinner + `strings.loading`). */
    loadingSlot?: React.ReactNode;

    /** Per-item render override. */
    renderItem?: (
        item: PopoverMenuItem<T>,
        ctx: PopoverMenuRenderItemContext,
    ) => React.ReactNode;

    /** Override copy. Deep-merged over defaults. */
    strings?: Partial<PopoverMenuStrings>;

    /** Popover content positioning props (forwarded). */
    align?: React.ComponentProps<typeof PopoverContent>['align'];
    sideOffset?: React.ComponentProps<typeof PopoverContent>['sideOffset'];

    /** Width override for the popover content. Default: w-56. */
    contentClassName?: string;
}

export function PopoverMenu<T = unknown>({
    trigger,
    items,
    onSelect,
    open,
    onOpenChange,
    search = true,
    searchValue,
    onSearchChange,
    loading = false,
    header,
    footer,
    empty,
    loadingSlot,
    renderItem,
    strings: stringsProp,
    align = 'start',
    sideOffset,
    contentClassName,
}: PopoverMenuProps<T>) {
    const strings: PopoverMenuStrings = {
        ...defaultPopoverMenuStrings,
        ...stringsProp,
    };

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger render={trigger as React.ReactElement} />
            <PopoverContent
                align={align}
                sideOffset={sideOffset}
                className={cn('popover-menu--component', 'w-56 p-0 overflow-hidden', contentClassName)}
            >
                <Command shouldFilter={!onSearchChange}>
                    {!!header && (
                        <div className="border-b border-border/60 px-3 py-2">
                            {header}
                        </div>
                    )}

                    {!!search && (
                        <CommandInput
                            placeholder={strings.searchPlaceholder}
                            value={searchValue}
                            onValueChange={onSearchChange}
                        />
                    )}

                    <CommandList>
                        {!!loading && (
                            loadingSlot ?? (
                                <div className="flex items-center justify-center gap-2 py-3 text-muted-foreground">
                                    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                                    <Text tag="span" size="xs" type="secondary">
                                        {strings.loading}
                                    </Text>
                                </div>
                            )
                        )}

                        <CommandEmpty>{empty ?? strings.empty}</CommandEmpty>

                        {items.length > 0 && (
                            <CommandGroup>
                                {items.map((item) => (
                                    <CommandItem
                                        key={item.value}
                                        value={item.searchValue ?? item.value}
                                        onSelect={() => onSelect(item)}
                                        disabled={item.disabled}
                                        data-checked={item.selected || undefined}
                                        className="data-[checked=true]:**:[svg]:text-primary"
                                    >
                                        {renderItem
                                            ? renderItem(item, { isHighlighted: false })
                                            : (
                                                <>
                                                    {!!item.icon && (
                                                        <span className="text-muted-foreground shrink-0">
                                                            {item.icon}
                                                        </span>
                                                    )}
                                                    <div className="flex min-w-0 flex-1 flex-col leading-tight">
                                                        <Text
                                                            tag="span"
                                                            size="xs"
                                                            weight={item.selected ? 'medium' : 'regular'}
                                                            className="truncate"
                                                        >
                                                            {item.label}
                                                        </Text>
                                                        {!!item.description && (
                                                            <Text
                                                                tag="span"
                                                                size="xxs"
                                                                type="secondary"
                                                                className="mt-0.5 truncate"
                                                            >
                                                                {item.description}
                                                            </Text>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>

                    {!!footer && (
                        <div className="border-t border-border/60 px-3 py-2">
                            {footer}
                        </div>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
}

PopoverMenu.displayName = 'PopoverMenu';
