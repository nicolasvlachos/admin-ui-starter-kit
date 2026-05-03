/**
 * DataTableHeader — column-group row, primary header row, sort indicators,
 * and (optionally) resize handles. Sortable columns render as a button with
 * an inline up / down / both arrow icon driven by TanStack `column.getIsSorted()`.
 */
import { flexRender } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { getCellClassName } from './table-helpers';
import { type DataTableHeaderProps } from './table.types';

export function DataTableHeader<TData>(
	{
		table,
		enableResizing = false,
		stickyHeader = false,
		headerClassName = '',
		cellClassName = '',
		stickyFirstColumn = false,
		columnGroups,
		dense = false,
		headerTransparent = false,
	}: DataTableHeaderProps<TData>) {

	const headerGroups = table.getHeaderGroups();

	const getColumnGroup = (columnId: string) => {
		if (!columnGroups) return null;
		return columnGroups.find(group => group.columns.includes(columnId));
	};

	const renderGroupHeaderRow = () => {
		if (!columnGroups || columnGroups.length === 0 || headerGroups.length === 0) {
			return null;
		}

		const headers = headerGroups[0].headers;
		let currentGroup: string | null = null;
		let groupSpan = 0;
		const groupCells: React.ReactNode[] = [];

		headers.forEach((header, index) => {
			const group = getColumnGroup(header.id);
			const groupName = group?.header || '';

			if (groupName !== currentGroup) {
				if (currentGroup !== null && groupSpan > 0) {
					groupCells.push(
						<TableHead
							key={`group-${currentGroup}-${groupCells.length}`}
							colSpan={groupSpan}
							className="text-center border-r border-border/60 last:border-r-0 px-3 py-2 text-xxs font-bold uppercase tracking-widest text-muted-foreground/70 bg-muted/40"
						>
							{currentGroup || ''}
						</TableHead>
					);
				}
				currentGroup = groupName;
				groupSpan = 1;
			} else {
				groupSpan++;
			}

			if (index === headers.length - 1 && groupSpan > 0) {
				groupCells.push(
					<TableHead
						key={`group-${currentGroup}-${groupCells.length}`}
						colSpan={groupSpan}
						className="text-center border-r border-border/60 last:border-r-0 px-3 py-2 text-xxs font-bold uppercase tracking-widest text-muted-foreground/70 bg-muted/40 whitespace-nowrap"
					>
						{currentGroup || ''}
					</TableHead>
				);
			}
		});

		return (
			<TableRow className={cn('table-header--component', 'border-b border-border')}>
				{groupCells}
			</TableRow>
		);
	};

	return (
		<TableHeader
			className={cn(
				stickyHeader &&
					(headerTransparent
						? 'sticky top-[var(--topbar-height)] z-10 bg-background/80 backdrop-blur-md shadow-[0_1px_0_0_var(--border)]'
						: 'sticky top-[var(--topbar-height)] z-10 bg-muted backdrop-blur-md shadow-[0_1px_0_0_var(--border)]'),
				headerClassName,
			)}
		>
			{renderGroupHeaderRow()}
			{headerGroups.map((headerGroup) => (
				<TableRow
					key={headerGroup.id}
					className={cn(
						'border-b border-border',
						headerTransparent
							? 'bg-transparent hover:bg-transparent'
							: 'bg-muted hover:bg-muted',
					)}
				>
					{headerGroup.headers.map((header, index) => {
						const cellClasses = cn(
							getCellClassName(
								header.id,
								null,
								cellClassName,
								stickyFirstColumn,
								index === 0,
							),
							'first:pl-5 last:pr-5',
							dense && 'px-2 py-1.5 first:pl-3 last:pr-3 text-xxs',
							'text-muted-foreground font-medium uppercase tracking-wider whitespace-nowrap',
							'bg-transparent',
						);
						const headerStyle = enableResizing
							? { position: 'relative' as const }
							: undefined;
						const resizeHandler = header.getResizeHandler();
						const isResizing = header.column.getIsResizing();
						const columnLabel = (() => {
							const rawHeader = header.column.columnDef.header;
							if (typeof rawHeader === 'string') {
								return rawHeader;
							}
							return typeof header.id === 'string' ? header.id : 'column';
						})();

						return (
							<TableHead
								key={header.id}
								className={cellClasses}
								style={headerStyle}
							>
								{header.isPlaceholder ? null : (
									<div>
										{(() => {
											const canSort = header.column.getCanSort();
											const sortDir = header.column.getIsSorted();
											const headerNode = flexRender(
												header.column.columnDef.header,
												header.getContext(),
											);
											const SortIcon =
												sortDir === 'asc'
													? ArrowUp
													: sortDir === 'desc'
														? ArrowDown
														: ChevronsUpDown;
											if (!canSort) {
												return <div className="flex items-center">{headerNode}</div>;
											}
											return (
												<button
													type="button"
													onClick={header.column.getToggleSortingHandler()}
													className={cn(
														'group inline-flex items-center gap-1.5 select-none -ml-1 px-1 rounded',
														'hover:text-foreground transition-colors',
														'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
														sortDir && 'text-foreground',
													)}
													aria-label={`Sort ${columnLabel}`}
												>
													{headerNode}
													<SortIcon
														className={cn(
															'size-3 shrink-0 transition-opacity',
															sortDir
																? 'opacity-100'
																: 'opacity-30 group-hover:opacity-70',
														)}
														aria-hidden="true"
													/>
												</button>
											);
										})()}

										{!!enableResizing && (
											<button
												type="button"
												className={cn(
													'absolute top-0 right-0 h-full w-1 cursor-col-resize select-none touch-none bg-foreground bg-opacity-50 opacity-0 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none',
													isResizing &&
														'!bg-primary-600 bg-opacity-100',
												)}
												aria-label={`Resize ${columnLabel}`}
												aria-orientation="vertical"
												onMouseDown={resizeHandler}
												onTouchStart={resizeHandler}
											/>
										)}
									</div>
								)}
							</TableHead>
						);
					})}
				</TableRow>
			))}
		</TableHeader>
	);
}

DataTableHeader.displayName = 'DataTableHeader';
