/**
 * Enhanced Combobox Components
 *
 * A feature-rich, API-driven combobox built on Base UI with shadcn styling.
 * Supports single and multiple selection, form integration, debounced search,
 * grouping, pagination, and more.
 *
 * This version uses shared hooks and components to eliminate duplication
 * between single and multiple selection variants.
 */

import * as React from 'react';
import { useRef, useCallback, useEffect, useState } from 'react';

import {
	Combobox as BaseCombobox,
	ComboboxInputTrigger,
	ComboboxChips,
	ComboboxChip,
	ComboboxChipsInput,
} from '@/components/ui/combobox';
import { useFormsConfig, type FormControlSize } from '@/lib/ui-provider';

import { ComboboxDropdown } from './components/combobox-dropdown';
import { ErrorMessage } from './components/error-message';
import {
	DEFAULT_MIN_SEARCH_LENGTH,
	DEFAULT_SIZE,
	isCreateOption,
	getCreateOptionValue,
} from './constants';

import { useEnhancedComboboxCore } from './hooks/use-enhanced-combobox-core';
import type {
	EnhancedComboboxProps,
	EnhancedComboboxMultipleProps,
	ComboboxSize,
} from './types';

const formControlSizeToComboboxSize: Record<FormControlSize, ComboboxSize> = {
	sm: 'sm',
	base: 'md',
	lg: 'lg',
};

function resolveComboboxSize(
	sizeProp: ComboboxSize | undefined,
	defaultControlSize: FormControlSize | undefined,
): ComboboxSize {
	return sizeProp ?? formControlSizeToComboboxSize[defaultControlSize ?? 'sm'] ?? DEFAULT_SIZE;
}

// ============================================================================
// Single Selection Component
// ============================================================================

export function EnhancedCombobox<T>({
	// Core props
	items,
	selectedValue,
	onSelectedValueChange,
	searchValue,
	onSearchValueChange,
	getItemLabel,
	getItemKey,
	isLoading = false,
	minSearchLength = DEFAULT_MIN_SEARCH_LENGTH,
	strings: stringsProp,
	disabled = false,
	className,
	renderItem,
	portalContainer,

	// Form Integration
	name,
	error,
	required,
	onBlur,

	// Debounced Search
	onSearch,
	debounceMs,

	// Creatable
	creatable,
	onCreate,

	// Grouped Items
	getItemGroup,
	renderGroupLabel,

	// Load More
	hasMore,
	onLoadMore,
	isLoadingMore,

	// Disable individual items
	getItemDisabled,

	// Highlight Match
	highlightMatch,

	// Size
	size: sizeProp,

	// Controlled Open
	open,
	onOpenChange,
}: EnhancedComboboxProps<T>): React.ReactElement {
	const { defaultControlSize } = useFormsConfig();
	const size = resolveComboboxSize(sizeProp, defaultControlSize);

	// Use shared core hook
	const core = useEnhancedComboboxCore({
		items,
		searchValue,
		onSearchValueChange,
		getItemLabel,
		getItemKey,
		isLoading,
		minSearchLength,
		strings: stringsProp,
		renderItem,
		onSearch,
		debounceMs,
		creatable,
		onCreate,
		getItemGroup,
		hasMore,
		onLoadMore,
		isLoadingMore,
		highlightMatch,
		size,
		// Include selected value in items list
		ensuredItems: selectedValue ? [selectedValue] : [],
	});

	// Track open state so we can show the selected label when closed
	const [isOpen, setIsOpen] = useState(false);
	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			setIsOpen(nextOpen);
			if (!nextOpen) {
				// Clear search when closing so next open starts fresh
				onSearchValueChange('');
			}
			onOpenChange?.(nextOpen);
		},
		[onOpenChange, onSearchValueChange],
	);

	// When closed with a selected value, show the label; when open, show search text
	const displayInputValue = isOpen
		? searchValue
		: (selectedValue ? core.itemToStringLabel(selectedValue) : '');

	// Handle value change, including create option
	const handleValueChange = useCallback(
		(value: T | null): void => {
			if (value && isCreateOption(value)) {
				const inputValue = getCreateOptionValue(value);
				onCreate?.(inputValue);
				return;
			}
			onSelectedValueChange(value);
		},
		[onSelectedValueChange, onCreate]
	);

	return (
		<div className="enhanced-combobox--component">
			<BaseCombobox
				items={core.allItems}
				value={selectedValue}
				onValueChange={handleValueChange}
				inputValue={displayInputValue}
				onInputValueChange={(value, { reason }) => {
					if (reason === 'item-press') {
						onSearchValueChange('');
						return;
					}
					onSearchValueChange(value);
				}}
				itemToStringLabel={core.itemToStringLabel}
				disabled={disabled}
				filter={null}
				name={name}
				required={required}
				open={open}
				onOpenChange={handleOpenChange}
			>
				<ComboboxInputTrigger
					placeholder={core.strings.placeholder}
					showClear
					className={className}
					size={size}
					error={!!error}
					aria-invalid={!!error}
					aria-required={required}
					onBlur={onBlur}
				/>

				<ComboboxDropdown
					isLoading={isLoading}
					showStatus={core.showStatus}
					showEmpty={core.showEmpty}
					searchValue={searchValue}
					minSearchLength={minSearchLength}
					items={items}
					groupedItems={core.groupedItems}
					createOptionItem={core.createOptionItem}
					renderItemContent={core.renderItemContent}
					getItemReactKey={core.getItemReactKey}
					getItemDisabled={getItemDisabled}
					renderGroupLabel={renderGroupLabel}
					isLoadingMore={isLoadingMore}
					strings={core.strings}
					size={size}
					portalContainer={portalContainer}
					listRef={core.listRef}
				/>
			</BaseCombobox>

			<ErrorMessage error={error} size={size} />
		</div>
	);
}

// ============================================================================
// Multiple Selection Component
// ============================================================================

export function EnhancedComboboxMultiple<T>({
	// Core props
	items,
	selectedValues,
	onSelectedValuesChange,
	searchValue,
	onSearchValueChange,
	getItemLabel,
	getItemKey,
	isLoading = false,
	minSearchLength = DEFAULT_MIN_SEARCH_LENGTH,
	strings: stringsProp,
	disabled = false,
	className,
	renderItem,
	portalContainer,

	// Form Integration
	name,
	error,
	required,
	onBlur,

	// Debounced Search
	onSearch,
	debounceMs,

	// Creatable
	creatable,
	onCreate,

	// Grouped Items
	getItemGroup,
	renderGroupLabel,

	// Load More
	hasMore,
	onLoadMore,
	isLoadingMore,

	// Disable individual items
	getItemDisabled,

	// Highlight Match
	highlightMatch,

	// Size
	size: sizeProp,

	// Controlled Open
	open,
	onOpenChange,

	// Behaviour
	closeOnSelect = false,
	applyButton = false,
	onApply,
	onCancel,
}: EnhancedComboboxMultipleProps<T>): React.ReactElement {
	const { defaultControlSize } = useFormsConfig();
	const size = resolveComboboxSize(sizeProp, defaultControlSize);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const getKey = getItemKey ?? getItemLabel;

	// Draft state — only used in `applyButton` mode. Tracks the user's
	// in-progress selection so we can commit it on Apply or revert on
	// Cancel. When apply mode is OFF, we pass selections through immediately.
	const [draftValues, setDraftValues] = useState<T[]>(selectedValues);
	const [internalOpen, setInternalOpen] = useState(false);
	const isOpenControlled = open !== undefined;
	const resolvedOpen = isOpenControlled ? open : internalOpen;

	useEffect(() => {
		if (applyButton) setDraftValues(selectedValues);
	}, [applyButton, selectedValues]);

	const setOpen = useCallback(
		(next: boolean) => {
			if (!isOpenControlled) setInternalOpen(next);
			onOpenChange?.(next);
		},
		[isOpenControlled, onOpenChange],
	);

	// Use shared core hook
	const core = useEnhancedComboboxCore({
		items,
		searchValue,
		onSearchValueChange,
		getItemLabel,
		getItemKey,
		isLoading,
		minSearchLength,
		strings: stringsProp,
		renderItem,
		onSearch,
		debounceMs,
		creatable,
		onCreate,
		getItemGroup,
		hasMore,
		onLoadMore,
		isLoadingMore,
		highlightMatch,
		size,
		// Include selected values in items list
		ensuredItems: selectedValues,
	});

	// Handle value change, filtering out create options
	const handleValueChange = useCallback(
		(values: T[]): void => {
			const regularValues: T[] = [];
			let createValue: string | null = null;

			for (const value of values) {
				if (isCreateOption(value)) {
					createValue = getCreateOptionValue(value);
				} else {
					regularValues.push(value);
				}
			}

			if (createValue) {
				onCreate?.(createValue);
			}

			const next = (regularValues.length !== values.length || !createValue) ? regularValues : null;
			if (next) {
				if (applyButton) {
					setDraftValues(next);
				} else {
					onSelectedValuesChange(next);
				}
			}

			if (closeOnSelect) {
				setOpen(false);
			}
		},
		[onSelectedValuesChange, onCreate, applyButton, closeOnSelect, setOpen],
	);

	const handleApply = useCallback(() => {
		if (applyButton) onSelectedValuesChange(draftValues);
		onApply?.();
		setOpen(false);
	}, [applyButton, draftValues, onApply, onSelectedValuesChange, setOpen]);

	const handleCancel = useCallback(() => {
		if (applyButton) setDraftValues(selectedValues);
		onCancel?.();
		setOpen(false);
	}, [applyButton, selectedValues, onCancel, setOpen]);

	const visibleValues = applyButton ? draftValues : selectedValues;
	const chipsPlaceholder = visibleValues.length > 0 ? undefined : core.strings.placeholder;

	return (
		<div>
			<BaseCombobox
				items={core.allItems}
				multiple
				value={visibleValues}
				onValueChange={handleValueChange}
				inputValue={searchValue}
				onInputValueChange={(value, { reason }) => {
					if (reason === 'item-press') {
						onSearchValueChange('');
						return;
					}
					onSearchValueChange(value);
				}}
				itemToStringLabel={core.itemToStringLabel}
				disabled={disabled}
				filter={null}
				name={name}
				required={required}
				open={resolvedOpen}
				onOpenChange={(next) => {
					// In apply-button mode, closing without committing should
					// revert the draft so the next open starts clean.
					if (!next && applyButton) setDraftValues(selectedValues);
					setOpen(next);
				}}
			>
				<ComboboxChips
					ref={containerRef}
					className={className}
					size={size}
					error={!!error}
				>
					{visibleValues.map((item) => (
						<ComboboxChip key={getKey(item)}>
							{getItemLabel(item)}
						</ComboboxChip>
					))}
					<ComboboxChipsInput
						placeholder={chipsPlaceholder}
						aria-invalid={!!error}
						aria-required={required}
						onBlur={onBlur}
					/>
				</ComboboxChips>

				<ComboboxDropdown
					isLoading={isLoading}
					showStatus={core.showStatus}
					showEmpty={core.showEmpty}
					searchValue={searchValue}
					minSearchLength={minSearchLength}
					items={items}
					groupedItems={core.groupedItems}
					createOptionItem={core.createOptionItem}
					renderItemContent={core.renderItemContent}
					getItemReactKey={core.getItemReactKey}
					getItemDisabled={getItemDisabled}
					renderGroupLabel={renderGroupLabel}
					isLoadingMore={isLoadingMore}
					strings={core.strings}
					size={size}
					portalContainer={portalContainer}
					listRef={core.listRef}
					anchor={containerRef}
					applyFooter={applyButton ? {
						applyLabel: core.strings.apply,
						cancelLabel: core.strings.cancel,
						onApply: handleApply,
						onCancel: handleCancel,
					} : undefined}
				/>
			</BaseCombobox>

			<ErrorMessage error={error} size={size} />
		</div>
	);
}

// ============================================================================
// Legacy Aliases
// ============================================================================

/** @deprecated Use EnhancedCombobox instead */
export const ApiCombobox = EnhancedCombobox;

/** @deprecated Use EnhancedComboboxMultiple instead */
export const ApiComboboxMultiple = EnhancedComboboxMultiple;

EnhancedCombobox.displayName = 'EnhancedCombobox';
EnhancedComboboxMultiple.displayName = 'EnhancedComboboxMultiple';
