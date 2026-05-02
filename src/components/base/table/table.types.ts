import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	type RowSelectionState,
	type Table,
	type Row,
} from '@tanstack/react-table';
import type React from 'react';
import { type PaginationLabels, type PaginationType } from '@/types/pagination.types';

export type PageChangeHandler = (page: number, url: string, currentUrl: string) => void;

export interface ServerPaginationProps {
	pagination: PaginationType;
	onPageChange?: PageChangeHandler;
	pageQueryKey?: string;
	labels?: PaginationLabels;
}

export type ActionVariant =
	| 'default'
	| 'destructive'
	| 'outline'
	| 'secondary'
	| 'ghost'
	| 'link';

export interface ActionItem<TData> {
	/** Optional stable identifier for keys */
	id?: string;
	/** Visible label */
	label: string;
	/**
	 * Optional href the consumer wants to associate with the action. The
	 * library does NOT navigate on its own — supply `onClick` and route in
	 * your framework's router (Tanstack Router `navigate(href)`, Inertia
	 * `router.visit(href)`, Next `router.push(href)`, etc.). `href` is kept
	 * as data so the consumer can read it inside `onClick` and so you can
	 * render `<a href={action.href}>` if you swap in a custom action shell.
	 */
	href?: string;
	/** Optional click handler receiving the row */
	onClick?: (row: TData) => void;
	/** Visual variant hint */
	variant?: ActionVariant;
	/** Static disabled flag */
	disabled?: boolean;
	/** Optional icon node */
	icon?: React.ReactNode;
	/** Controls visibility: static boolean or predicate */
	isVisible?: boolean | ((row: TData) => boolean);
	/** Controls disabled state: static boolean or predicate */
	isDisabled?: boolean | ((row: TData) => boolean);
}

// Event handler types
export type RowSelectionHandler = (selection: RowSelectionState) => void;
export type SortingHandler = (sorting: SortingState) => void;
export type RowClickHandler<TData> = (row: TData) => void;
export type ColumnVisibilityHandler = (visibility: VisibilityState) => void;
export type ColumnFiltersHandler = (filters: ColumnFiltersState) => void;

export interface ColumnGroup {
	header: string;
	columns: string[]; // column IDs that belong to this group
}

export interface DataTablePaginationStrings extends Required<PaginationLabels> {
	ariaLabel: string;
	showing: string;
	to: string;
}

export interface DataTableStrings {
	emptyState: {
		message: string;
	};
	actions: {
		triggerLabel: string;
		srLabel: string;
	};
	filter: {
		searchPlaceholder: string;
		columnsButton: string;
	};
	columnVisibility: {
		title: string;
		triggerLabel: string;
		formatLabel: (columnId: string, currentLabel?: string | null) => string;
	};
	toolbar: {
		scrollLeft: string;
		scrollRight: string;
		columns: string;
		dense: string;
		comfortable: string;
	};
	pagination: DataTablePaginationStrings;
	selection: {
		summary: (selected: number, total: number) => string;
		row: (index: number) => string;
		selectAll: string;
	};
}

export type DataTableStringsOverride = Partial<{
	emptyState: Partial<DataTableStrings['emptyState']>;
	actions: Partial<DataTableStrings['actions']>;
	filter: Partial<DataTableStrings['filter']>;
	columnVisibility: Partial<DataTableStrings['columnVisibility']>;
	toolbar: Partial<DataTableStrings['toolbar']>;
	pagination: Partial<DataTableStrings['pagination']>;
	selection: Partial<DataTableStrings['selection']>;
}>;

export interface ColumnVisibilityToggleProps<TData> {
	table: Table<TData>;
	className?: string;
	align?: 'start' | 'center' | 'end';
	strings?: DataTableStrings;
}

export interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	/** Ref to the wrapper div that contains the Table primitive (the toolbar finds the scroll container inside) */
	tableAreaRef: React.RefObject<HTMLDivElement | null>;
	/** Whether dense mode is currently active */
	dense: boolean;
	/** Toggle dense mode */
	onDenseChange: (dense: boolean) => void;
	/** Whether column visibility toggle is enabled */
	enableColumnVisibility?: boolean;
	strings?: DataTableStrings;
}

/**
 * Visual density / typography size of the entire table. Applied at the
 * `<table>` element so all cells inherit via CSS — overrides apply to header,
 * body, and footer at once. Default is `xs` (compact admin density).
 */
export type DataTableSize = 'xs' | 'sm' | 'base';

// Component props
export interface DataTableProps<TData extends object, TValue> {
	/** Typography size for the table; cells inherit. Default `xs`. */
	size?: DataTableSize;
	// Core data
	/**
	 * Column definitions for the table.
	 *
	 * Supports two patterns:
	 * 1. Regular array: `columns={myColumns}`
	 * 2. Tuple pattern with auto-memoization: `columns={[getColumns(t, actions), [t, actions]]}`
	 *
	 * The tuple pattern eliminates the need for manual useMemo on the page level.
	 *
	 * @example
	 * // Pattern 1: Regular (requires manual memoization)
	 * const columns = useMemo(() => getColumns(t), [t]);
	 * <DataTable columns={columns} />
	 *
	 * @example
	 * // Pattern 2: Tuple (auto-memoized internally)
	 * <DataTable columns={[getColumns(t, actions), [t, actions]]} />
	 */
	columns: ColumnDef<TData, TValue>[] | [ColumnDef<TData, TValue>[], React.DependencyList];
	data: TData[];
	columnGroups?: ColumnGroup[];

	// Feature flags
	enableSorting?: boolean;
	enableFiltering?: boolean;
	enablePagination?: boolean;
	enableResizing?: boolean;
	enableRowSelection?: boolean;
	enableMultiRowSelection?: boolean;
	enableSubRowSelection?: boolean;
	enableColumnVisibility?: boolean;
	manualPagination?: boolean;
	manualSorting?: boolean;
	debugMode?: boolean;

	// UI Customization
	stickyHeader?: boolean;
	stickyFirstColumn?: boolean;
	emptyStateMessage?: string;
	emptyStateAction?: React.ReactNode;
	className?: string;
	rowClassName?: string | ((row: Row<TData>, index: number) => string);
	cellClassName?: string | ((column: string, row: Row<TData> | null) => string);
	headerClassName?: string;
	wrapperClassName?: string;
	innerClassName?: string;
	tableContainerClassName?: string;
	strings?: DataTableStringsOverride;

	// Filter options
	filterColumn?: string;
	filterPlaceholder?: string;

	// Custom content
	topbarContent?: React.ReactNode;
	footerContent?: React.ReactNode;
	/**
	 * Row actions configuration. Accepts a static array or a factory that receives the row
	 * and returns the actions for that row. Existing static arrays continue to work.
	 */
	rowActions?: ActionItem<TData>[] | ((row: TData) => ActionItem<TData>[]);
	/** Optional label for the row actions trigger */
	rowActionsMenuLabel?: string;
	/** Display mode for row actions. Default: 'menu' (preserve existing) */
	rowActionsDisplayMode?: 'menu' | 'inline' | 'auto';
	/** Breakpoint in px for auto display mode. Default: 1040. */
	rowActionsBreakpoint?: number;

	// Server-side pagination
	pagination?: PaginationType;
	pageQueryKey?: string;

	// Event handlers
	onRowClick?: RowClickHandler<TData>;
	onRowSelectionChange?: RowSelectionHandler;
	onSort?: SortingHandler;
	onPageChange?: PageChangeHandler;
	onColumnVisibilityChange?: ColumnVisibilityHandler;
	onColumnFiltersChange?: ColumnFiltersHandler;

	// Advanced options
	getRowId?: (row: TData, index: number) => string;
	rowSelection?: RowSelectionState;
	initialState?: {
		sorting?: SortingState;
		rowSelection?: RowSelectionState;
		columnVisibility?: VisibilityState;
		columnFilters?: ColumnFiltersState;
		pagination?: {
			pageIndex: number;
			pageSize: number;
		};
	};

	/**
	 * Storage key for persisting table state (column visibility, etc.) to localStorage.
	 * Pass a simple module name and DataTable handles the internal formatting.
	 *
	 * Internally formatted as: `dt.{storageKey}.columns`
	 *
	 * When enabled, the DataTable will:
	 * - Load initial column visibility from localStorage
	 * - Automatically save changes to localStorage
	 * - Handle SSR safely (no errors on server)
	 * - Gracefully handle quota exceeded errors
	 *
	 * @example
	 * <DataTable
	 *   storageKey="bookings"  // Stored as "dt.bookings.columns"
	 *   enableColumnVisibility={true}
	 * />
	 *
	 * @example
	 * <DataTable storageKey="vendors" />  // Stored as "dt.vendors.columns"
	 */
	storageKey?: string;
}

// Sub-component props
export interface DataTableFilterBarProps<TData> {
	table: Table<TData>;
	filterColumn?: string;
	filterPlaceholder?: string;
	enableColumnVisibility?: boolean;
	customContent?: React.ReactNode;
	strings?: DataTableStrings;
}

export interface DataTablePaginationProps {
	table: Table<unknown>;
	selectedRowCount?: number;
	totalRowCount?: number;
	strings?: DataTableStrings;
}

export interface DataTableActionsProps<TData> {
	/** the row this menu is attached to */
	row: TData;
	/** static actions or a factory for per-row actions */
	actions: ActionItem<TData>[] | ((row: TData) => ActionItem<TData>[]);
	/** Optional menu label (defaults to strings.actions.triggerLabel) */
	menuLabel?: string;
	/** Display mode: always menu, always inline, or auto by breakpoint (default: 'menu' to preserve behavior) */
	displayMode?: 'menu' | 'inline' | 'auto';
	/** Breakpoint for auto mode (px). Default 1040. */
	responsiveBreakpoint?: number;
	strings?: DataTableStrings;
}

export interface DataTableBodyProps<TData> {
	table: Table<TData>;
	onRowClick?: RowClickHandler<TData>;
	emptyStateMessage?: string;
	emptyStateAction?: React.ReactNode;
	cellClassName?: string | ((column: string, row: Row<TData> | null) => string);
	rowClassName?: string | ((row: Row<TData>, index: number) => string);
	stickyFirstColumn?: boolean;
	strings?: DataTableStrings;
	striped?: boolean;
	dense?: boolean;
}

export interface DataTableHeaderProps<TData> {
	table: Table<TData>;
	enableResizing?: boolean;
	stickyHeader?: boolean;
	headerClassName?: string;
	cellClassName?: string | ((column: string, row: Row<TData> | null) => string);
	stickyFirstColumn?: boolean;
	columnGroups?: ColumnGroup[];
	dense?: boolean;
}
