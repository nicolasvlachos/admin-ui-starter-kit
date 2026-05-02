/**
 * MentionPicker — popover content for the mention/reference picker.
 *
 * Pure UI: takes the state from `useMentions` (or any equivalent hook)
 * and renders kind tabs + a cmdk search list. Wrapped in `<Popover>` by
 * the consumer:
 *
 *   <Popover open={mentions.pickerOpen} onOpenChange={mentions.setPickerOpen}>
 *     <PopoverTrigger ... />
 *     <MentionPicker ... />
 *   </Popover>
 */
import { Loader2 } from 'lucide-react';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/base/command';
import { PopoverContent } from '@/components/base/popover';
import { Text } from '@/components/typography';
import { useStrings, type StringsProp } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
    defaultMentionPickerStrings,
    type MentionPickerStrings,
} from '../mentions.strings';
import type {
    MentionResource,
    MentionSuggestion,
} from '../mentions.types';

export type { MentionPickerStrings };

export interface MentionPickerProps<TResource extends string = string> {
    open: boolean;
    activeKind: TResource | null;
    setActiveKind: (kind: TResource | null) => void;
    kinds: ReadonlyArray<TResource>;
    resources?: Partial<Record<TResource, MentionResource<TResource>>>;
    query: string;
    setQuery: (query: string) => void;
    suggestions: ReadonlyArray<MentionSuggestion<TResource>>;
    isLoading: boolean;
    onSelect: (suggestion: MentionSuggestion<TResource>) => void;
    strings?: StringsProp<MentionPickerStrings>;
    className?: string;
}

export function MentionPicker<TResource extends string = string>({
    open,
    activeKind,
    setActiveKind,
    kinds,
    resources,
    query,
    setQuery,
    suggestions,
    isLoading,
    onSelect,
    strings: stringsProp,
    className,
}: MentionPickerProps<TResource>) {
    const strings = useStrings(defaultMentionPickerStrings, stringsProp);
    if (!open) return null;

    return (
        <PopoverContent
            align="start"
            className={cn('w-72 overflow-hidden p-0', className)}
        >
            <div className="border-b border-border/60 px-3 py-2">
                <Text
                    size="xxs"
                    type="secondary"
                    weight="medium"
                    className="uppercase tracking-wide"
                >
                    {strings.title}
                </Text>
                {kinds.length > 1 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {kinds.map((kind) => {
                            const cfg = resources?.[kind];
                            const Icon = cfg?.icon;
                            const active = kind === activeKind;
                            return (
                                <button
                                    key={kind}
                                    type="button"
                                    onClick={() => setActiveKind(kind)}
                                    className={cn(
                                        'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xxs font-medium ring-1 ring-inset transition-colors',
                                        active
                                            ? 'bg-primary text-primary-foreground ring-primary'
                                            : 'bg-muted text-muted-foreground ring-border/60 hover:bg-muted/80',
                                    )}
                                >
                                    {Icon ? <Icon className="size-3" /> : null}
                                    <span>{cfg?.label ?? String(kind)}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <Command shouldFilter={false}>
                <CommandInput
                    placeholder={strings.searchPlaceholder}
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    {isLoading ? (
                        <div className="text-muted-foreground flex items-center justify-center gap-2 py-3">
                            <Loader2 className="size-3.5 animate-spin" aria-hidden />
                            <Text tag="span" size="xs" type="secondary">
                                {strings.loading}
                            </Text>
                        </div>
                    ) : null}
                    <CommandEmpty>{strings.empty}</CommandEmpty>
                    <CommandGroup>
                        {suggestions.map((suggestion) => {
                            const kind = suggestion.kind ?? activeKind ?? '';
                            return (
                                <CommandItem
                                    key={`${kind}:${suggestion.id}`}
                                    value={`${kind}:${suggestion.id}`}
                                    onSelect={() => onSelect(suggestion)}
                                >
                                    <div className="flex min-w-0 flex-1 flex-col leading-tight">
                                        <Text tag="span" size="xs" weight="medium" className="truncate">
                                            {suggestion.label}
                                        </Text>
                                        {suggestion.description ? (
                                            <Text
                                                tag="span"
                                                size="xxs"
                                                type="secondary"
                                                className="mt-0.5 truncate"
                                            >
                                                {suggestion.description}
                                            </Text>
                                        ) : null}
                                    </div>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    );
}
