import { Settings2 } from 'lucide-react';
import { Button } from '@/components/base/buttons';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { defaultDataTableStrings } from './table.strings';
import { type ColumnVisibilityToggleProps } from './table.types';

export function ColumnVisibilityToggle<TData>({
    table,
    className,
    align = 'end',
    strings = defaultDataTableStrings,
}: ColumnVisibilityToggleProps<TData>) {
    const columns = table.getAllColumns()
        .filter((column) => column.getCanHide());

    if (columns.length === 0) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={(triggerProps) => (
                    <Button
                        {...triggerProps}
                        variant="secondary"
                        buttonStyle="outline"
                        className={cn(
                            'h-8 flex items-center gap-2',
                             
                            (triggerProps as { className?: string }).className,
                            className,
                        )}
                    >
                        { }
                        {(triggerProps as { children?: React.ReactNode }).children}
                    </Button>
                )}
            >
                <Settings2 className="h-4 w-4" />
                <span className="hidden sm:inline">{strings.columnVisibility.triggerLabel}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} className="w-[200px]">
                <DropdownMenuLabel>{strings.columnVisibility.title}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map((column) => {
                    const header = column.columnDef.header;
                    const columnName = strings.columnVisibility.formatLabel(
                        column.id,
                        typeof header === 'string' ? header : undefined,
                    );

                    return (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(checked) => column.toggleVisibility(!!checked)}
                        >
                            {columnName}
                        </DropdownMenuCheckboxItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

ColumnVisibilityToggle.displayName = 'ColumnVisibilityToggle';
