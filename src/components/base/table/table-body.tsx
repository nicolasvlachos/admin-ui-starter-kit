/**
 * DataTableBody — body rows, selection highlighting, hover, empty state,
 * and (optional) loading skeleton. Stronger hover + selection contrast than
 * the original implementation so rows feel interactive at a glance.
 */
import { flexRender } from '@tanstack/react-table';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import Text from '@/components/typography/text';
import { cn } from '@/lib/utils';
import {
	getCellClassName,
	getRowClassName,
} from './table-helpers';
import { defaultDataTableStrings } from './table.strings';
import { type DataTableBodyProps } from './table.types';

export function DataTableBody<TData>({
	table,
	onRowClick,
	emptyStateMessage,
	emptyStateAction,
	cellClassName = '',
	rowClassName = '',
	stickyFirstColumn = false,
	striped = false,
	dense = false,
	strings,
}: DataTableBodyProps<TData>) {
	const tableRows = table.getRowModel().rows;
	const resolvedEmptyStateMessage =
		emptyStateMessage ??
		strings?.emptyState.message ??
		defaultDataTableStrings.emptyState.message;

	const handleRowClick = (row: TData) => {
		if (onRowClick) {
			onRowClick(row);
		}
	};

	if (!tableRows.length) {
		return (
			<TableBody>
				<TableRow className="hover:bg-transparent">
					<TableCell
						className="h-24 text-center"
						colSpan={table.getAllColumns().length}
					>
						<div className="flex flex-col items-center justify-center py-12 space-y-2">
							<div className="flex items-center justify-center size-10 rounded-full bg-muted mb-1">
								<svg className="size-5 text-muted-foreground/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25-2.25M12 13.875V7.5M3.75 7.5h16.5" />
								</svg>
							</div>
							<Text
								type="secondary"
								weight="medium"
							>
								{resolvedEmptyStateMessage}
							</Text>
							{!!emptyStateAction && (
								<div className="mt-1">{emptyStateAction}</div>
							)}
						</div>
					</TableCell>
				</TableRow>
			</TableBody>
		);
	}

	return (
		<TableBody>
			{tableRows.map((row, rowIndex) => {
				const isRowSelected = row.getIsSelected();
				const rowCells = row.getVisibleCells();
				const computedRowClassName = getRowClassName(
					row,
					rowIndex,
					rowClassName,
					isRowSelected,
				);
				const handleRowSelection = () => {
					if (onRowClick) {
						handleRowClick(row.original);
					}
				};
				const zebraClass = striped && rowIndex % 2 !== 0 ? 'bg-muted/30' : '';
				const cursorClass = onRowClick ? 'cursor-pointer' : '';
				const rowClasses = cn(
					computedRowClassName,
					zebraClass,
					'transition-colors duration-100',
					'hover:bg-accent/40 data-[state=selected]:bg-primary/5 data-[state=selected]:hover:bg-primary/10',
					cursorClass,
					'border-b border-border last:border-b-0',
				);
				const rowState = isRowSelected ? 'selected' : null;

				return (
					<TableRow
						key={row.id}
						data-state={rowState}
						className={rowClasses}
						onClick={handleRowSelection}
					>
						{rowCells.map((cell, cellIndex) => (
							<TableCell
								key={cell.id}
								className={cn(
									getCellClassName(
										cell.column.id,
										row,
										cellClassName,
										stickyFirstColumn,
										cellIndex === 0,
									),
									dense
										? 'py-1.5 px-2 first:pl-3 last:pr-3 text-xxs leading-3'
										: 'py-2 px-3 first:pl-5 last:pr-5 text-xs',
								)}
							>
								{flexRender(
									cell.column.columnDef.cell,
									cell.getContext(),
								)}
							</TableCell>
						))}
					</TableRow>
				);
			})}
		</TableBody>
	);
}

DataTableBody.displayName = 'DataTableBody';
