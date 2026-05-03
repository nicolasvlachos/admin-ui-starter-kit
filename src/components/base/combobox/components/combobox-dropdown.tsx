/**
 * Shared ComboboxDropdown Component
 *
 * Renders the dropdown content for both single and multiple selection variants.
 * Extracts shared rendering logic to reduce duplication.
 */

import * as React from 'react';

import {
	ComboboxPortal,
	ComboboxPositioner,
	ComboboxPopup,
	ComboboxEmpty,
	ComboboxList,
	ComboboxItem,
	ComboboxStatus,
	ComboboxGroup,
	ComboboxGroupLabel,
	ComboboxCollection,
} from '@/components/ui/combobox';
import { Button } from '@/components/base/buttons';

import { DEFAULT_SIZE } from '../constants';
import type { ComboboxStrings, ComboboxSize } from '../types';
import { LoadingMore } from './loading-more';
import { StatusContent } from './status-content';

export interface ComboboxDropdownProps<T> {
	// Display state
	isLoading: boolean;
	showStatus: boolean;
	showEmpty: boolean;

	// Search
	searchValue: string;
	minSearchLength: number;

	// Items
	items: T[];
	groupedItems: Map<string, T[]> | null;
	createOptionItem: T | null;

	// Rendering
	renderItemContent: (item: T) => React.ReactNode;
	getItemReactKey: (item: T) => string;
	getItemDisabled?: (item: T) => boolean;
	renderGroupLabel?: (group: string) => React.ReactNode;

	// Load more
	isLoadingMore?: boolean;

	// Strings
	strings: ComboboxStrings;

	// Size
	size?: ComboboxSize;

	// Portal
	portalContainer?: React.RefObject<HTMLElement | null>;

	// Refs
	listRef: React.RefObject<HTMLDivElement | null>;

	// Multiple selection anchor
	anchor?: React.RefObject<HTMLElement | null>;

	/** Optional apply / cancel footer for the apply-button workflow. */
	applyFooter?: {
		applyLabel: string;
		cancelLabel: string;
		onApply: () => void;
		onCancel: () => void;
	};
}

export function ComboboxDropdown<T>({
	isLoading,
	showStatus,
	showEmpty,
	searchValue,
	minSearchLength,
	items,
	groupedItems,
	createOptionItem,
	renderItemContent,
	getItemReactKey,
	getItemDisabled,
	renderGroupLabel,
	isLoadingMore,
	strings,
	size = DEFAULT_SIZE,
	portalContainer,
	listRef,
	anchor,
	applyFooter,
}: ComboboxDropdownProps<T>): React.ReactElement {
	const positionerClassName = portalContainer != null ? 'z-[100]' : undefined;

	const content = (
		<ComboboxPositioner
			anchor={anchor}
			className={positionerClassName}
		>
			<ComboboxPopup aria-busy={isLoading || undefined}>
				{/* Status message */}
				{!!showStatus && (
					<ComboboxStatus>
						<StatusContent
							isLoading={isLoading}
							searchValue={searchValue}
							minSearchLength={minSearchLength}
							itemCount={items.length}
							strings={strings}
						/>
					</ComboboxStatus>
				)}

				{/* Empty state */}
				{!!showEmpty && <ComboboxEmpty>{strings.noResults}</ComboboxEmpty>}

				{/* Items list */}
				<ComboboxList ref={listRef}>
					{groupedItems ? (
						<>
							{Array.from(groupedItems.entries()).map(([group, groupItems]) => {
								const groupLabel =
									typeof renderGroupLabel === 'function'
										? renderGroupLabel(group)
										: group;

								return (
									<ComboboxGroup className="combobox-dropdown--component" key={group} items={groupItems}>
										<ComboboxGroupLabel>{groupLabel}</ComboboxGroupLabel>
										<ComboboxCollection>
											{(item: T) => (
												<ComboboxItem
													key={getItemReactKey(item)}
													value={item}
													size={size}
													disabled={getItemDisabled?.(item)}
												>
													{renderItemContent(item)}
												</ComboboxItem>
											)}
										</ComboboxCollection>
									</ComboboxGroup>
								);
							})}

							{createOptionItem != null && (
								<ComboboxItem
									key={getItemReactKey(createOptionItem)}
									value={createOptionItem}
									size={size}
								>
									{renderItemContent(createOptionItem)}
								</ComboboxItem>
							)}
						</>
					) : (
						<ComboboxCollection>
							{(item: T) => (
								<ComboboxItem
									key={getItemReactKey(item)}
									value={item}
									size={size}
									disabled={getItemDisabled?.(item)}
								>
									{renderItemContent(item)}
								</ComboboxItem>
							)}
						</ComboboxCollection>
					)}
				</ComboboxList>

				{/* Loading more indicator */}
				<LoadingMore
					isLoading={!!isLoadingMore}
					text={strings.loadingMore}
				/>

				{/* Apply / cancel footer (multi-select with applyButton). */}
				{!!applyFooter && (
					<div className="flex items-center justify-end gap-2 border-t border-border/60 px-2 py-1.5">
						<Button
							type="button"
							variant="secondary"
							buttonStyle="ghost"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								applyFooter.onCancel();
							}}
						>
							{applyFooter.cancelLabel}
						</Button>
						<Button
							type="button"
							variant="primary"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								applyFooter.onApply();
							}}
						>
							{applyFooter.applyLabel}
						</Button>
					</div>
				)}
			</ComboboxPopup>
		</ComboboxPositioner>
	);

	if (portalContainer) {
		return <ComboboxPortal container={portalContainer}>{content}</ComboboxPortal>;
	}

	return <ComboboxPortal>{content}</ComboboxPortal>;
}

ComboboxDropdown.displayName = 'ComboboxDropdown';
