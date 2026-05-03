import { AlertCircle, Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import { Button } from '@/components/base/buttons';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/base/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/base/popover';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import { useFilters } from '../filter-context';
import { interpolateFilterString } from '../filters.strings';
import type { FilterConfig, FilterOption } from '../filters.types';
import { useAsyncOptions } from '../hooks';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AsyncSelectFacetProps {
	filter: FilterConfig;
	value: string[];
	onChange: (value: string[]) => void;
	className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Async Select Filter Facet
 *
 * A TanStack Query-powered filter facet for server-side option loading.
 * Supports:
 * - Live typeahead search with debounce + AbortSignal
 * - Loading, error, empty, min-query-hint states
 * - Preload (fetch default options on open)
 * - Multi-select with maxSelected enforcement
 * - Options label cache for pill display after popover close
 */
export function AsyncSelectFacet({
	filter,
	value,
	onChange,
	className,
}: AsyncSelectFacetProps) {
	const { strings, cacheAsyncOptions, getAsyncOptionLabel } = useFilters();
	const [open, setOpen] = useState(false);
	const [searchInput, setSearchInput] = useState('');

	// Cache resolved option labels so pills can show labels after popover closes
	const labelCacheRef = useRef<Map<string, FilterOption>>(new Map());

	const {
		options,
		isLoading,
		isFetching,
		isError,
		refetch,
		isBelowMinQuery,
		minQueryLength,
	} = useAsyncOptions(filter, searchInput, open);

	// Update label cache when new options arrive
	if (options.length > 0) {
		for (const opt of options) {
			labelCacheRef.current.set(opt.value, opt);
		}
		cacheAsyncOptions(filter.key, options);
	}

	const isMulti = filter.multiple !== false;
	const maxSelected = filter.maxSelected;
	const initialOptions = useMemo(() => filter.options ?? [], [filter.options]);

	// Sort options: selected items first, then the rest.
	// Also include cached selected items that may not be in current search results.
	const sortedOptions = useMemo(() => {
		const selectedSet = new Set(value);
		const optionValueSet = new Set(
			[...initialOptions, ...options].map((o) => o.value),
		);

		// Resolve selected items missing from current results via caches
		const missingSelected: FilterOption[] = [];
		for (const val of value) {
			if (!optionValueSet.has(val)) {
				const cached = labelCacheRef.current.get(val);
				if (cached) {
					missingSelected.push(cached);
				} else {
					const initial = initialOptions.find((o) => o.value === val);
					if (initial) {
						missingSelected.push(initial);
						continue;
					}
					const label = getAsyncOptionLabel(filter.key, val);
					if (label) {
						missingSelected.push({ value: val, label, icon: filter.icon });
					}
				}
			}
		}

		const all = [...missingSelected, ...initialOptions, ...options];
		return all.sort((a, b) => {
			const aSelected = selectedSet.has(a.value) ? 0 : 1;
			const bSelected = selectedSet.has(b.value) ? 0 : 1;
			return aSelected - bSelected;
		});
	}, [initialOptions, options, value, filter.key, filter.icon, getAsyncOptionLabel]);

	const handleSelect = (selectedValue: string) => {
		if (isMulti) {
			if (value.includes(selectedValue)) {
				onChange(value.filter((v) => v !== selectedValue));
			} else {
				if (maxSelected && value.length >= maxSelected) return;
				onChange([...value, selectedValue]);
			}
		} else {
			onChange([selectedValue]);
			if (filter.closeOnSelect !== false) {
				setOpen(false);
			}
		}
	};

	const getOptionLabel = (optionValue: string): string => {
		// Check current options first, then cache
		const fromOptions = options.find((o) => o.value === optionValue);
		if (fromOptions) return fromOptions.label;
		const fromInitialOptions = initialOptions.find((o) => o.value === optionValue);
		if (fromInitialOptions) return fromInitialOptions.label;
		const cached = labelCacheRef.current.get(optionValue);
		if (cached) return cached.label;
		return optionValue;
	};

	const hasSelection = value.length > 0;

	// Determine the empty state message
	const emptyMessage = useMemo(() => {
		if (isLoading || isFetching) {
			return (
				<div className={cn('async-select-facet--component', 'flex items-center justify-center gap-2 py-4')}>
					<Loader2 className="text-muted-foreground size-4 animate-spin" />
					<Text
						tag="span"
						size="xs"
						type="secondary"
					>
						{strings.searching}
					</Text>
				</div>
			);
		}

		if (isError) {
			return (
				<div className="flex flex-col items-center gap-2 py-4">
					<div className="flex items-center gap-1.5">
						<AlertCircle className="text-destructive size-4" />
						<Text
							tag="span"
							size="xs"
							type="secondary"
						>
							{strings.fetchError}
						</Text>
					</div>
					<Button
						variant="secondary"
						buttonStyle="outline"
						size="xs"
						onClick={(e) => {
							e.stopPropagation();
							void refetch();
						}}
					>
						{strings.retryFetch}
					</Button>
				</div>
			);
		}

		if (isBelowMinQuery) {
			return (
				<div className="text-muted-foreground flex items-center justify-center py-4">
					<Text
						tag="span"
						size="xs"
						type="secondary"
					>
						{interpolateFilterString(strings.minQueryHint, {
							min: minQueryLength,
						})}
					</Text>
				</div>
			);
		}

		return (
			<Text
				tag="span"
				size="xs"
				type="secondary"
			>
				{strings.noOptionsFound}
			</Text>
		);
	}, [
		isLoading,
		isFetching,
		isError,
		isBelowMinQuery,
		minQueryLength,
		strings,
		refetch,
	]);

	return (
		<div className={cn('relative', className)}>
			<Popover
				open={open}
				onOpenChange={(next) => {
					setOpen(next);
					if (!next) setSearchInput('');
				}}
			>
				<PopoverTrigger
					render={
						<Button
							variant="secondary"
							buttonStyle="outline"
							role="combobox"
							aria-expanded={open}
							className="w-full justify-between"
						>
							{hasSelection ? (
								value.length === 1 ? (
									<Text
										tag="span"
										size="xs"
										weight="semibold"
										className="truncate"
									>
										{getOptionLabel(value[0])}
									</Text>
								) : (
									<Text
										tag="span"
										size="xs"
										weight="semibold"
									>
										{interpolateFilterString(strings.selected, {
											count: value.length,
											filterLabel:
												(value.length > 1
													? filter.pluralLabel
													: filter.label) ?? filter.label,
										})}
									</Text>
								)
							) : (
								<Text
									tag="span"
									size="xs"
									type="secondary"
								>
									{filter.placeholder ?? strings.select}
								</Text>
							)}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					}
				/>
				<PopoverContent className="w-full min-w-[280px] p-0">
					<Command shouldFilter={false}>
						<CommandInput
							placeholder={interpolateFilterString(
								strings.searchPlaceholder,
								{ filterLabel: filter.label },
							)}
							value={searchInput}
							onValueChange={setSearchInput}
						/>
						<CommandList>
							{sortedOptions.length === 0 ? (
								<CommandEmpty>{emptyMessage}</CommandEmpty>
							) : (
								<CommandGroup>
									{Boolean(isFetching && !isLoading) && (
										<div className="flex items-center gap-1.5 px-2 py-1">
											<Loader2 className="text-muted-foreground size-3 animate-spin" />
											<Text
												tag="span"
												size="xs"
												type="secondary"
											>
												{strings.searching}
											</Text>
										</div>
									)}
									{sortedOptions.map((option) => (
										<CommandItem
											key={option.value}
											value={option.value}
											onSelect={() => handleSelect(option.value)}
											disabled={
												option.disabled ||
												(!!maxSelected &&
													value.length >= maxSelected &&
													!value.includes(option.value))
											}
										>
											<Check
												className={cn(
													'mr-2 h-4 w-4',
													value.includes(option.value)
														? 'opacity-100'
														: 'opacity-0',
												)}
											/>
											{Boolean(option.icon) && (
												<span className="mr-1.5">
													{option.icon}
												</span>
											)}
											<Text
												tag="span"
												size="xs"
											>
												{option.label}
											</Text>
										</CommandItem>
									))}
								</CommandGroup>
							)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}

/**
 * Retrieve the label cache ref from an AsyncSelectFacet instance.
 * This is used by FilterValueDisplay to resolve labels for active async filters.
 */
export type AsyncSelectLabelCache = Map<string, FilterOption>;
