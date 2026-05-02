import { X, Plus } from 'lucide-react';
import React, { useState, useCallback, type KeyboardEvent } from 'react';
import { Badge } from '@/components/base/badge';
import { Button } from '@/components/base/buttons';
import { Input } from '@/components/base/forms';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';
import { useFilters } from '../filter-context';
import type { FilterConfig } from '../filters.types';

interface TagsFacetProps {
    filter: FilterConfig;
    value: string[];
    onChange: (value: string[]) => void;
    className?: string;
}

/**
 * Tags Filter Facet
 *
 * This component implements a tags input filter that allows users to:
 * - Enter tags through an input field
 * - Add tags by pressing Enter or clicking the add button
 * - View all selected tags as removable badges
 * - Remove individual tags by clicking the X on each badge
 *
 * The component is ideal for filtering by multiple tags or keywords
 * where users need to see all selected values at once.
 */

function TagsFacetComponent({
    filter,
    value,
    onChange,
    className,
}: TagsFacetProps) {
    const { strings } = useFilters();
    const [inputValue, setInputValue] = useState('');
    // Handle adding a new tag
    const handleAddTag = useCallback(() => {
        const trimmedValue = inputValue.trim();

        // Don't add empty tags or duplicates
        if (!trimmedValue || value.includes(trimmedValue)) {
            return;
        }

        onChange([...value, trimmedValue]);
        setInputValue('');
    }, [inputValue, value, onChange]);

    // Handle removing a tag
    const handleRemoveTag = useCallback(
        (tagToRemove: string) => {
            onChange(value.filter((tag) => tag !== tagToRemove));
        },
        [value, onChange],
    );

    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    // Clear all tags
    const handleClearAll = useCallback(() => {
        onChange([]);
        setInputValue('');
    }, [onChange]);

    const hasTags = value.length > 0;
    const tagCountLabel =
        value.length === 1 ? strings.tag : strings.tags;
    const tagSummary = hasTags ? (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Text tag="span" size="xs" type="secondary">
                    {value.length} {tagCountLabel}
                </Text>
                <Button
                    onClick={handleClearAll}
                    variant="secondary"
                    buttonStyle="ghost"
                    size="xs"
                    className="h-auto px-1 py-0 text-xs text-muted-foreground hover:text-foreground"
                    type="button"
                    aria-label={strings.clearAll}
                >
                    {strings.clearAll}
                </Button>
            </div>
            <div className="flex flex-wrap gap-2">
                {value.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1 py-1 pl-2 pr-1"
                    >
                        <Text tag="span" size="xs">{tag}</Text>
                        <Button
                            onClick={() => handleRemoveTag(tag)}
                            variant="secondary"
                            buttonStyle="ghost"
                            size="icon-xs"
                            className="ml-1 size-4 rounded-full p-0 hover:bg-muted-foreground/20"
                            type="button"
                            aria-label={`${strings.removeTag} ${tag}`}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                ))}
            </div>
        </div>
    ) : null;

    return (
        <div className={cn('space-y-3', className)}>
            {/* Input section */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            filter.placeholder ?? strings.enterTag
                        }
                        className="h-10"
                    />
                </div>
                <Button
                    onClick={handleAddTag}
                    disabled={!inputValue.trim()}
                    className="h-10 px-4"
                    type="button"
                >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">{strings.addTag}</span>
                </Button>
            </div>

            {/* Tags display section */}
            {tagSummary}
        </div>
    );
}

export const TagsFacet = React.memo(TagsFacetComponent);
