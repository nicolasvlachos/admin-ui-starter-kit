import type {
	SortingState,
	RowSelectionState,
	VisibilityState,
	Table,
	Row,
	Updater,
	ColumnDef,
} from '@tanstack/react-table';
import React from 'react';
import { defaultDataTableStrings } from './table.strings';
import type { DataTableStrings } from './table.types';

/**
 * Helper function for handling row selection changes with OnChangeFn compatibility
 */
export const handleRowSelectionChange = (
	updatedSelection: Updater<RowSelectionState>,
	setInternalState: React.Dispatch<React.SetStateAction<RowSelectionState>>,
	externalHandler?: (state: RowSelectionState) => void,
) => {
	// Handle both direct values and updater functions
	if (typeof updatedSelection === 'function') {
		// If it's a function, use setState with function argument
		setInternalState((prevState) => {
			const newState = (
				updatedSelection as (prev: RowSelectionState) => RowSelectionState
			)(prevState);
			if (externalHandler) {
				externalHandler(newState);
			}
			return newState;
		});
	} else {
		// If it's a direct value, just use it
		setInternalState(updatedSelection);
		if (externalHandler) {
			externalHandler(updatedSelection);
		}
	}
};

/**
 * Helper function for handling sorting changes with OnChangeFn compatibility
 */
export const handleSortingChange = (
	updatedSorting: Updater<SortingState>,
	setInternalState: React.Dispatch<React.SetStateAction<SortingState>>,
	externalHandler?: (state: SortingState) => void,
) => {
	// Handle both direct values and updater functions
	if (typeof updatedSorting === 'function') {
		// If it's a function, use setState with function argument
		setInternalState((prevState) => {
			const newState = (updatedSorting as (prev: SortingState) => SortingState)(
				prevState,
			);
			if (externalHandler) {
				externalHandler(newState);
			}
			return newState;
		});
	} else {
		// If it's a direct value, just use it
		setInternalState(updatedSorting);
		if (externalHandler) {
			externalHandler(updatedSorting);
		}
	}
};

/**
 * Helper function for handling column visibility changes
 */
export const handleColumnVisibilityChange = (
	updatedVisibility: Updater<VisibilityState>,
	setInternalState: React.Dispatch<React.SetStateAction<VisibilityState>>,
	externalHandler?: (state: VisibilityState) => void,
) => {
	// Handle both direct values and updater functions
	if (typeof updatedVisibility === 'function') {
		// If it's a function, use setState with function argument
		setInternalState((prevState) => {
			const newState = (
				updatedVisibility as (prev: VisibilityState) => VisibilityState
			)(prevState);
			if (externalHandler) {
				externalHandler(newState);
			}
			return newState;
		});
	} else {
		// If it's a direct value, just use it
		setInternalState(updatedVisibility);
		if (externalHandler) {
			externalHandler(updatedVisibility);
		}
	}
};

/**
 * Get row class name based on selection state and custom function
 */
export const getRowClassName = <TData,>(
	row: Row<TData>,
	index: number,
	rowClassName?: string | ((row: Row<TData>, index: number) => string),
	isSelected?: boolean,
): string => {
	let className = '';

	// Add selected class if the row is selected
	if (isSelected) {
		className += 'bg-primary/5 ';
	}

	// Add custom class name
	if (typeof rowClassName === 'function') {
		className += rowClassName(row, index) + ' ';
	} else if (rowClassName) {
		className += rowClassName + ' ';
	}

	return className.trim();
};

/**
 * Get cell class name including sticky column handling
 */
export const getCellClassName = <TData,>(
	columnId: string,
	row: Row<TData> | null,
	cellClassName?: string | ((column: string, row: Row<TData> | null) => string),
	stickyFirstColumn?: boolean,
	isFirstColumn?: boolean,
): string => {
	let baseClassName = '';

	// Add base class name
	if (typeof cellClassName === 'string') {
		baseClassName = cellClassName;
	} else if (cellClassName && row) {
		baseClassName = cellClassName(columnId, row);
	}

	// Add sticky class if it's the first column and sticky first column is enabled
	if (stickyFirstColumn && isFirstColumn) {
		return `${baseClassName} sticky left-0 z-10 bg-card`;
	}

	return baseClassName;
};

/**
 * Get selected rows data from the table
 */
export const getSelectedRowsData = <T extends object>(table: Table<T>): T[] => {
	return table.getSelectedRowModel().rows.map((row) => row.original);
};

/**
 * Create row selection component for a row
 */
export const createRowSelectionCheckbox = <TData,>(
	row: Row<TData>,
	strings: DataTableStrings = defaultDataTableStrings,
) => (
	<div className="px-1">
		<input
			type="checkbox"
			className="size-3.5 rounded border-border text-primary accent-primary focus-visible:ring-ring focus-visible:ring-offset-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
			checked={row.getIsSelected()}
			disabled={!row.getCanSelect()}
			onChange={row.getToggleSelectedHandler()}
			onClick={(e) => e.stopPropagation()}
			aria-label={strings.selection.row(row.index)}
		/>
	</div>
);

/**
 * Create header selection checkbox
 */
export const createHeaderSelectionCheckbox = <TData,>(
	table: Table<TData>,
	strings: DataTableStrings = defaultDataTableStrings,
) => (
	<div className="px-1">
		<input
			type="checkbox"
			className="size-3.5 rounded border-border text-primary accent-primary focus-visible:ring-ring focus-visible:ring-offset-1 cursor-pointer"
			checked={table.getIsAllPageRowsSelected()}
			onChange={table.getToggleAllPageRowsSelectedHandler()}
			aria-label={strings.selection.selectAll}
		/>
	</div>
);

/**
 * Add selection column to columns
 */
export const addSelectionColumn = <TData, TValue = unknown>(
	columns: ColumnDef<TData, TValue>[],
	strings: DataTableStrings = defaultDataTableStrings,
) => {
	const selectionColumn = {
		id: 'selection',
		header: ({ table }: { table: Table<TData> }) =>
			createHeaderSelectionCheckbox(table, strings),
		cell: ({ row }: { row: Row<TData> }) => createRowSelectionCheckbox(row, strings),
		enableSorting: false,
		enableResizing: false,
		size: 40,
	} as ColumnDef<TData, TValue>;

	return [selectionColumn, ...columns];
};
