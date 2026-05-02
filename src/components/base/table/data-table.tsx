/**
 * DataTable — TanStack-powered data table with sorting, row selection, column
 * visibility, server-side pagination, dense mode, sticky header / first column,
 * and pluggable row actions (menu / inline / responsive).
 *
 * Strings are overridable through the `strings` prop and a default set in
 * `./table.strings`. Column visibility and dense mode persist to localStorage
 * when a `storageKey` is provided.
 *
 * Use the cell renderers exported from `./partials/cell-renderers`
 * (`StatusCell`, `DateCell`, `CurrencyCell`, `AvatarCell`) for visually
 * consistent cells across pages.
 */
import {
	getCoreRowModel,
	useReactTable,
	type SortingState,
	type VisibilityState,
	type Updater,
	type ColumnDef,
	type RowSelectionState,
} from '@tanstack/react-table';
import { createContext, useContext, useState, useMemo, useCallback, useRef } from 'react';
import { Table } from '@/components/ui/table';
import { useTableConfig } from '@/lib/ui-provider';
import { cn } from '@/lib/utils';

/**
 * Context exposing the current `<DataTable size>` to descendant cell renderers
 * so consumer-built cells can stay typographically aligned with the table
 * (instead of hardcoding `<Text>` and breaking the unification the
 * `size` prop is supposed to give).
 *
 * Use it from custom cells:
 *   const size = useDataTableSize();
 *   return <Text size={size}>{value}</Text>;
 *
 * The built-in renderers in `partials/cell-renderers` consume this hook.
 */
const DataTableSizeContext = createContext<'xs' | 'sm' | 'base'>('xs');

export function useDataTableSize(): 'xs' | 'sm' | 'base' {
	return useContext(DataTableSizeContext);
}
import { Pagination } from './pagination';
import { DataTableActions } from './table-actions';
import { DataTableBody } from './table-body';
import { DataTableHeader } from './table-header';
import { DataTableToolbar } from './table-toolbar';
import { addSelectionColumn, handleSortingChange, handleColumnVisibilityChange } from './table-helpers';
import { mergeDataTableStrings } from './table.strings';
import { type DataTableProps } from './table.types';
import { Separator } from '@/components/base/display/separator';

// Class applied to the `<table>` element. Cell renderers using
// `<Text size="inherit">` pick up the font-size via CSS inheritance so a
// `<DataTable size="sm">` automatically renders all of its rows at sm.
// We also tighten/loosen the inner padding via descendant selectors so
// the row height actually reflects the chosen density.
const sizeClassByDataTableSize: Record<NonNullable<DataTableProps<object, unknown>['size']>, string> = {
	xs: 'text-xs [&_th]:py-1.5 [&_td]:py-1.5 [&_th]:px-2 [&_td]:px-2 [&_th]:h-8',
	sm: 'text-sm [&_th]:py-2 [&_td]:py-2 [&_th]:px-2.5 [&_td]:px-2.5 [&_th]:h-10',
	base: 'text-base [&_th]:py-3 [&_td]:py-3 [&_th]:px-3 [&_td]:px-3 [&_th]:h-12',
};

export function DataTable<TData extends object, TValue = unknown>({
	size,
	columns,
	data,
	columnGroups,
	rowActions,
	rowActionsMenuLabel,
	rowActionsDisplayMode,
	rowActionsBreakpoint,
	enableSorting = false,
	manualSorting = false,
	enableColumnVisibility = false,
	enableRowSelection = false,
	enableMultiRowSelection = true,
	enableSubRowSelection = false,
	pagination,
	pageQueryKey,
	onPageChange,
	onSort,
	onRowClick,
	onRowSelectionChange,
	stickyHeader = false,
	stickyFirstColumn = false,
	emptyStateMessage,
	emptyStateAction,
	className = '',
	rowClassName = '',
	cellClassName = '',
	headerClassName = '',
	wrapperClassName = '',
	innerClassName = 'overflow-hidden',
	tableContainerClassName = '',
	getRowId,
	rowSelection: controlledRowSelection,
	initialState,
	onColumnVisibilityChange,
	strings: stringsOverride,
	topbarContent,
	storageKey,
}: DataTableProps<TData, TValue>) {
	const { defaultSize } = useTableConfig();
	const resolvedSize: NonNullable<DataTableProps<TData, TValue>['size']> =
		size ?? defaultSize ?? 'xs';

	const strings = useMemo(
		() => mergeDataTableStrings(stringsOverride),
		[stringsOverride],
	);

	const tableRowClasses = cn('bg-card', rowClassName)
	const resolvedEmptyStateMessage = emptyStateMessage ?? strings.emptyState.message;
	const resolvedRowActionsMenuLabel =
		rowActionsMenuLabel ?? strings.actions.triggerLabel;
	const resolvedPageQueryKey = pageQueryKey ?? 'page';

		// --- Detect and resolve tuple pattern for columns ---
		const resolvedColumns = (() => {
			// Tuple pattern detected: [columns, deps]
			if (Array.isArray(columns) && columns.length === 2 && Array.isArray(columns[1])) {
				return columns[0] as ColumnDef<TData, TValue>[];
			}

			// Regular pattern: just columns array
			return columns as ColumnDef<TData, TValue>[];
		})();

	// --- Format storage key internally ---
	const formattedStorageKey = useMemo(() => {
		return storageKey ? `dt.${storageKey}.columns` : null;
	}, [storageKey]);

	// --- Dense mode storage key ---
	const denseStorageKey = useMemo(() => {
		return storageKey ? `dt.${storageKey}.dense` : null;
	}, [storageKey]);

	// --- Load initial column visibility from localStorage if persistence enabled ---
	const initialColumnVisibility = useMemo<VisibilityState>(() => {
		// If persistence is disabled or we're in SSR, use initialState or empty object
		if (!formattedStorageKey || typeof window === 'undefined') {
			return initialState?.columnVisibility || {};
		}

		try {
			const stored = window.localStorage.getItem(formattedStorageKey);
			const parsed = stored ? (JSON.parse(stored) as VisibilityState) : {};
			// Merge with initialState if provided
			return { ...parsed, ...(initialState?.columnVisibility || {}) };
		} catch {
			// If parsing fails, fall back to initialState
			return initialState?.columnVisibility || {};
		}
	}, [formattedStorageKey, initialState?.columnVisibility]);

	// --- Load initial dense mode from localStorage ---
	const initialDense = useMemo(() => {
		if (!denseStorageKey || typeof window === 'undefined') return false;
		try {
			return window.localStorage.getItem(denseStorageKey) === '1';
		} catch {
			return false;
		}
	}, [denseStorageKey]);

	// --- State for sorting, visibility, and dense mode ---
	const [sorting, setSorting] = useState<SortingState>(initialState?.sorting || []);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		initialColumnVisibility,
	);
	const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>(
		initialState?.rowSelection || {},
	);
	const [dense, setDense] = useState(initialDense);
	const rowSelection = controlledRowSelection ?? internalRowSelection;

	// --- Refs ---
	const tableAreaRef = useRef<HTMLDivElement>(null);

	// --- Callbacks ---
	const handleSortingChangeCallback = useCallback(
		(updater: Updater<SortingState>) => {
			handleSortingChange(updater, setSorting, onSort);
		},
		[onSort],
	);

	const handleVisibilityChangeCallback = useCallback(
		(updater: Updater<VisibilityState>) => {
			handleColumnVisibilityChange(
				updater,
				setColumnVisibility,
				(newState) => {
					// Persist to localStorage if enabled
					if (formattedStorageKey && typeof window !== 'undefined') {
						try {
							window.localStorage.setItem(
								formattedStorageKey,
								JSON.stringify(newState),
							);
						} catch {
							// Silent fail - quota exceeded or other localStorage errors
						}
					}

					// Call user-provided handler
					if (onColumnVisibilityChange) {
						onColumnVisibilityChange(newState);
					}
				},
			);
		},
		[formattedStorageKey, onColumnVisibilityChange],
	);

	const handleRowSelectionChangeCallback = useCallback(
		(updater: Updater<RowSelectionState>) => {
			const nextRowSelection =
				typeof updater === 'function' ? updater(rowSelection) : updater;

			if (controlledRowSelection === undefined) {
				setInternalRowSelection(nextRowSelection);
			}

			onRowSelectionChange?.(nextRowSelection);
		},
		[controlledRowSelection, onRowSelectionChange, rowSelection],
	);

	const handleDenseChange = useCallback(
		(value: boolean) => {
			setDense(value);
			if (denseStorageKey && typeof window !== 'undefined') {
				try {
					window.localStorage.setItem(denseStorageKey, value ? '1' : '0');
				} catch {
					// Silent fail
				}
			}
		},
		[denseStorageKey],
	);

	const columnsWithActions = useMemo<ColumnDef<TData, TValue>[]>(() => {
		const baseColumns = enableRowSelection
			? addSelectionColumn<TData, TValue>(resolvedColumns, strings)
			: resolvedColumns;

		// if no actions, leave cols untouched
		if (!rowActions) {
			return baseColumns;
		}

		// otherwise append a fixed Actions column:
		const actionCol: ColumnDef<TData, TValue> = {
			id: 'actions',
			header: strings.actions.triggerLabel,
			// NOTE: just hand `rowActions` array, not a call
			cell: ({ row }: { row: { original: TData } }) => (
				<DataTableActions
					row={row.original}
					actions={rowActions}
					menuLabel={resolvedRowActionsMenuLabel}
					displayMode={rowActionsDisplayMode}
					responsiveBreakpoint={rowActionsBreakpoint}
					strings={strings}
				/>
			),
			enableSorting: false,
			enableHiding: false,
			size: 40,
		};

		return [...baseColumns, actionCol];
	}, [
		resolvedColumns,
		enableRowSelection,
		rowActions,
		resolvedRowActionsMenuLabel,
		rowActionsBreakpoint,
		rowActionsDisplayMode,
		strings,
	]);

	// --- Configure table ---
	const table = useReactTable({
		data,
		columns: columnsWithActions,
		state: { sorting, columnVisibility, rowSelection },
		enableSorting,
		manualSorting,
		enableRowSelection,
		enableMultiRowSelection,
		enableSubRowSelection,
		onSortingChange:
			enableSorting && manualSorting ? handleSortingChangeCallback : undefined,
		onRowSelectionChange:
			enableRowSelection ? handleRowSelectionChangeCallback : undefined,
		onColumnVisibilityChange: handleVisibilityChangeCallback,
		getCoreRowModel: getCoreRowModel(),
		getRowId,
	});

	// --- Determine server pagination ---
	const shouldShow = pagination && pagination.last_page > 1;

	const Provider = DataTableSizeContext.Provider;

	return (
		<Provider value={resolvedSize}>
		<div className={cn(
			dense
				? 'fixed inset-0 z-50 bg-background flex flex-col overflow-hidden p-6'
				: `w-full ${wrapperClassName} rounded-xl overflow-hidden border border-border bg-card shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]`,
		)}>
			{!!(topbarContent || enableColumnVisibility) && (
				<div className="relative">

                    <div className={cn(
                        'data-table-topbar flex items-end justify-between gap-4 px-5 py-3.5',
                        dense ? 'mb-3 shrink-0' : 'mb-0',
                    )}>
                        <div className="data-table-topbar-left flex-1">{topbarContent}</div>
                        <div className="data-table-topbar-right flex items-center justify-end">
                            <DataTableToolbar
                                table={table}
                                tableAreaRef={tableAreaRef}
                                dense={dense}
                                onDenseChange={handleDenseChange}
                                enableColumnVisibility={enableColumnVisibility}
                                strings={strings}
                            />
                        </div>

                    </div>
                    <Separator />
                </div>
			)}


			<div
				ref={tableAreaRef}
				className={cn(
					'',
					dense ? 'flex-1 overflow-auto min-h-0' : innerClassName,
				)}
			>

				<Table className={cn(
					'relative',
					sizeClassByDataTableSize[resolvedSize],
					className,
				)} containerClassName={tableContainerClassName}>
					<DataTableHeader
						table={table}
						stickyHeader={stickyHeader}
						headerClassName={headerClassName}
						cellClassName={cellClassName}
						stickyFirstColumn={stickyFirstColumn}
						columnGroups={columnGroups}
						dense={dense}
					/>
					<DataTableBody
						table={table}
						onRowClick={onRowClick}
						emptyStateMessage={resolvedEmptyStateMessage}
						emptyStateAction={emptyStateAction}
						cellClassName={cellClassName}
						rowClassName={tableRowClasses}
						stickyFirstColumn={stickyFirstColumn}
						strings={strings}
						dense={dense}
					/>
				</Table>
			</div>
			{!!shouldShow && (
				<>
                    <Separator />
                    <Pagination
                        pagination={pagination}
                        onPageChange={onPageChange}
                        pageQueryKey={resolvedPageQueryKey}
                        labels={strings.pagination}
                    />
                </>
			)}
		</div>
		</Provider>
	);
}

DataTable.displayName = 'DataTable';
