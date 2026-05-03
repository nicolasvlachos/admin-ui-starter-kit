import { Badge } from '@/components/base/badge/badge';
import { SmartCard } from '@/components/base/cards/smart-card';
import { Text } from '@/components/typography/text';
import { cn } from '@/lib/utils';

import type { KanbanMicroBoardProps } from './types';

export function KanbanMicroBoard({ columns, className }: KanbanMicroBoardProps) {
    const totalItems = columns.reduce((sum, col) => sum + col.items.length, 0);

    return (
        <SmartCard
            title="Pipeline Overview"
            titleSuffix={<Badge variant="secondary">{totalItems} items</Badge>}
            className={cn('kanban-board--component', className)}
        >
            <div className="grid grid-cols-4 gap-1.5">
                {columns.map((col, colIdx) => (
                    <div
                        key={col.title}
                        className={cn(
                            'rounded-md p-1.5',
                            colIdx % 2 === 0 ? 'bg-muted/40' : 'bg-muted/20',
                        )}
                    >
                        <div className="mb-1.5 flex items-center justify-between">
                            <Text size="xxs" weight="semibold" className="truncate">
                                {col.title}
                            </Text>
                            <Badge variant="secondary" className="ml-1 !px-1 !py-0 text-xxs">
                                {col.items.length}
                            </Badge>
                        </div>
                        <div className="max-h-20 space-y-1 overflow-y-auto">
                            {col.items.map((item, itemIdx) => (
                                <div
                                    key={`${col.title}-${itemIdx}`}
                                    className="flex items-center gap-1 rounded bg-card px-1.5 py-1 shadow-sm"
                                >
                                    <div
                                        className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                                        style={{ backgroundColor: `var(--color-${item.color})` }}
                                    />
                                    <Text size="xxs" className="truncate">
                                        {item.title}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </SmartCard>
    );
}

KanbanMicroBoard.displayName = 'KanbanMicroBoard';
