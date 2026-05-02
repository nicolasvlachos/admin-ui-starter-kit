/**
 * Default empty-state body — shown when the query yields no results.
 * Override entirely via `slots.empty`.
 */
import { Search } from 'lucide-react';

import { Text } from '@/components/typography';

export interface GlobalSearchEmptyStateProps {
    title: string;
    hint: string;
}

export function GlobalSearchEmptyState({ title, hint }: GlobalSearchEmptyStateProps) {
    return (
        <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-3 inline-flex size-10 items-center justify-center rounded-full bg-muted/60">
                <Search className="size-4 text-muted-foreground" aria-hidden="true" />
            </div>
            <Text weight="medium">
                {title}
            </Text>
            <Text size="xs" type="secondary" className="mt-1">
                {hint}
            </Text>
        </div>
    );
}
