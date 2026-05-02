// Main components
export { DataTable, useDataTableSize } from './data-table';
export { DataTableActions } from './table-actions';
export { DataTableBody } from './table-body';
export { DataTableFilterBar } from './filter-bar';
export { DataTableHeader } from './table-header';
export { DataTablePagination } from './table-pagination';
export { Pagination } from './pagination';
export { ColumnVisibilityToggle } from './column-visibility-toggle';
export { DataTableToolbar } from './table-toolbar';

// Partials
export { CellValue } from './partials/cell-value';
export { TableLink } from './partials/table-link';
export {
	StatusCell,
	type StatusCellEntry,
	type StatusCellProps,
	DateCell,
	type DateCellProps,
	CurrencyCell,
	type CurrencyCellProps,
	AvatarCell,
	type AvatarCellProps,
} from './partials/cell-renderers';

// Types
export * from './table.types';

// Strings
export { defaultDataTableStrings, mergeDataTableStrings } from './table.strings';

// Helpers
export {
	handleRowSelectionChange,
	handleSortingChange,
	handleColumnVisibilityChange,
	getRowClassName,
	getCellClassName,
	getSelectedRowsData,
	createRowSelectionCheckbox,
	createHeaderSelectionCheckbox,
	addSelectionColumn,
} from './table-helpers';

// Reusable hooks for custom toolbars / chrome
export {
	useDataTableScrollState,
	usePersistentDensity,
	getDataTableScrollContainer,
	type UseDataTableScrollStateReturn,
} from './hooks';

// Extracted toolbar pieces — use when building a custom toolbar layout
export { DensityToggle, type DensityToggleProps } from './partials/density-toggle';
