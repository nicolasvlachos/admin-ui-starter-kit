import { Button } from '@/components/base/buttons';
import Text from '@/components/typography/text';
import { defaultDataTableStrings } from './table.strings';
import { type DataTablePaginationProps } from './table.types';

import { cn } from '@/lib/utils';
export function DataTablePagination({ table, selectedRowCount, totalRowCount, strings = defaultDataTableStrings }: DataTablePaginationProps) {
    // Use provided counts or get from table
    const selected = selectedRowCount ?? table.getFilteredSelectedRowModel().rows.length;
    const total = totalRowCount ?? table.getFilteredRowModel().rows.length;
    const summary = strings.selection.summary(selected, total);

    return (
        <div className={cn('table-pagination--component', 'flex items-center justify-end space-x-2 px-4 py-4')}>
            <div className="flex-1">
                <Text type="secondary">
                    {summary}
                </Text>
            </div>
            <Button variant="secondary" buttonStyle="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                {strings.pagination.previous}
            </Button>
            <Button variant="secondary" buttonStyle="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                {strings.pagination.next}
            </Button>
        </div>
    );
}

DataTablePagination.displayName = 'DataTablePagination';
