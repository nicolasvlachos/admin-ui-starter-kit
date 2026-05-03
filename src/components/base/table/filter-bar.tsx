import { Button } from '@/components/base/buttons';
import { Input } from '@/components/base/forms/fields';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { defaultDataTableStrings } from './table.strings';
import { type DataTableFilterBarProps } from './table.types';

import { cn } from '@/lib/utils';
export function DataTableFilterBar<TData>({
											  table,
											  filterColumn,
											  filterPlaceholder,
											  enableColumnVisibility = false,
											  customContent,
										  strings = defaultDataTableStrings,
									  }: DataTableFilterBarProps<TData>) {
	if (!filterColumn && !enableColumnVisibility && !customContent) {
		return null;
	}

	const searchPlaceholder = filterPlaceholder ?? strings.filter.searchPlaceholder;

	return (
		<div className={cn('filter-bar--component', 'flex items-center justify-between p-4')}>
			<div className="flex flex-1 items-center space-x-2">
				{/* Filter input */}
				{!!filterColumn && (
	     <Input
						placeholder={searchPlaceholder}
						value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''}
						onChange={(event) => {
							const value = event.target.value;
							table.getColumn(filterColumn)?.setFilterValue(value);
						}}
						className="max-w-sm"
					/>
	   )}

				{/* Custom content */}
				{customContent}
			</div>

			{/* Column visibility toggle */}
				{!!enableColumnVisibility && (
					<DropdownMenu>
						<DropdownMenuTrigger
							render={(triggerProps) => (
								<Button
									{...triggerProps}
									variant="secondary"
									buttonStyle="outline"
									className="ml-auto"
								>
									{strings.columnVisibility.triggerLabel}
								</Button>
							)}
						/>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>{strings.columnVisibility.title}</DropdownMenuLabel>
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
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
											onCheckedChange={(checked) =>
												column.toggleVisibility(!!checked)
											}
										>
											{columnName}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				)}
		</div>
	);
}

DataTableFilterBar.displayName = 'DataTableFilterBar';
