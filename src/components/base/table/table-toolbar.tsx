import { ChevronLeft, ChevronRight, Columns3, Maximize2, Minimize2 } from 'lucide-react';
import type { Column } from '@tanstack/react-table';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import { type DataTableToolbarProps } from './table.types';

const SCROLL_AMOUNT = 300;

const btnBase = 'inline-flex items-center justify-center h-7 w-7 rounded-none text-muted-foreground/70 hover:bg-muted hover:text-foreground transition-colors duration-150 disabled:opacity-30 disabled:pointer-events-none';

interface ToolbarIconButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
}

function ToolbarIconButton({ label, onClick, disabled, className, children }: ToolbarIconButtonProps) {
    return (
        <button
            type="button"
            aria-label={label}
            className={cn('table-toolbar--component', btnBase, className)}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

/**
 * Finds the actual horizontally-scrollable element inside the table area.
 * The Table primitive renders: <div data-slot="table-container" class="overflow-x-auto">
 */
function getScrollContainer(tableArea: HTMLDivElement | null): HTMLDivElement | null {
    if (!tableArea) return null;
    return tableArea.querySelector<HTMLDivElement>('[data-slot="table-container"]');
}

export function DataTableToolbar<TData>({
    table,
    tableAreaRef,
    dense,
    onDenseChange,
    enableColumnVisibility = false,
    strings = defaultDataTableStrings,
}: DataTableToolbarProps<TData>) {
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const rafRef = useRef(0);
    const cleanupRef = useRef<(() => void) | null>(null);

    // --- Scroll overflow detection ---
    const checkOverflow = useCallback(() => {
        const el = getScrollContainer(tableAreaRef.current);
        if (!el) {
            setCanScrollLeft(false);
            setCanScrollRight(false);
            return;
        }
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setCanScrollLeft(scrollLeft > 1);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }, [tableAreaRef]);

    useEffect(() => {
        // Defer slightly to ensure the Table primitive has rendered its container
        const timerId = window.setTimeout(() => {
            const el = getScrollContainer(tableAreaRef.current);
            if (!el) return;

            // Initial check
            checkOverflow();

            const handleScroll = () => {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = requestAnimationFrame(checkOverflow);
            };

            el.addEventListener('scroll', handleScroll, { passive: true });

            // ResizeObserver to detect when table width changes
            const ro = new ResizeObserver(checkOverflow);
            ro.observe(el);
            if (el.firstElementChild) {
                ro.observe(el.firstElementChild);
            }

            // Store cleanup references
            cleanupRef.current = () => {
                el.removeEventListener('scroll', handleScroll);
                cancelAnimationFrame(rafRef.current);
                ro.disconnect();
            };
        }, 0);

        return () => {
            window.clearTimeout(timerId);
            cleanupRef.current?.();
        };
        // Re-run when dense mode changes (layout shift can affect overflow)

    }, [tableAreaRef, checkOverflow, dense]);

    // --- Scroll handlers ---
    const handleScrollLeft = useCallback(() => {
        getScrollContainer(tableAreaRef.current)?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
    }, [tableAreaRef]);

    const handleScrollRight = useCallback(() => {
        getScrollContainer(tableAreaRef.current)?.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
    }, [tableAreaRef]);

    // --- Dense toggle ---
    const handleDenseToggle = useCallback(() => {
        onDenseChange(!dense);
    }, [dense, onDenseChange]);

    // --- Column visibility ---
    const columns = enableColumnVisibility
        ? table.getAllColumns().filter((column) => column.getCanHide())
        : [];

    const hasScrollArrows = canScrollLeft || canScrollRight;
    const hasColumns = enableColumnVisibility && columns.length > 0;
    const denseToggleLabel = dense
        ? strings.toolbar.comfortable
        : strings.toolbar.dense;

    return (
        <div className="flex items-center rounded-md border border-border bg-card">
            {/* Scroll arrows - only rendered when overflow exists */}
            {!!hasScrollArrows && (
                <>
                    <ToolbarIconButton
                        label={strings.toolbar.scrollLeft}
                        onClick={handleScrollLeft}
                        disabled={!canScrollLeft}
                        className="rounded-l-[calc(theme(borderRadius.md)-1px)]"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                    </ToolbarIconButton>
                    <ToolbarIconButton
                        label={strings.toolbar.scrollRight}
                        onClick={handleScrollRight}
                        disabled={!canScrollRight}
                    >
                        <ChevronRight className="h-3.5 w-3.5" />
                    </ToolbarIconButton>
                    <div className="h-4 w-px bg-border" />
                </>
            )}

            {/* Column visibility dropdown */}
            {!!hasColumns && (
                <>
                    <ColumnVisibilityDropdown
                        columns={columns}
                        strings={strings}
                        roundLeft={!hasScrollArrows}
                    />
                    <div className="h-4 w-px bg-border" />
                </>
            )}

            {/* Dense/compact toggle */}
            <ToolbarIconButton
                label={denseToggleLabel}
                onClick={handleDenseToggle}
                className={cn(
                    'rounded-r-[calc(theme(borderRadius.md)-1px)]',
                    !hasScrollArrows && !hasColumns && 'rounded-l-[calc(theme(borderRadius.md)-1px)]',
                )}
            >
                {dense
                    ? <Maximize2 className="h-3.5 w-3.5" />
                    : <Minimize2 className="h-3.5 w-3.5" />
                }
            </ToolbarIconButton>
        </div>
    );
}

/** Extracted dropdown to keep the parent component clean */
function ColumnVisibilityDropdown<TData>({
    columns,
    strings,
    roundLeft,
}: {
    columns: Array<Column<TData, unknown>>;
    strings: NonNullable<DataTableToolbarProps<TData>['strings']>;
    roundLeft: boolean;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={(triggerProps) => (
                    <button
                        {...triggerProps}
                        type="button"
                        aria-label={strings.toolbar.columns}
                        className={cn(
                            btnBase,
                            (triggerProps as Record<string, unknown>).className as string,
                            roundLeft && 'rounded-l-[calc(theme(borderRadius.md)-1px)]',
                        )}
                    >
                        <Columns3 className="h-3.5 w-3.5" />
                    </button>
                )}
            />
            <DropdownMenuContent align="end" className="w-[200px]">
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

DataTableToolbar.displayName = 'DataTableToolbar';
