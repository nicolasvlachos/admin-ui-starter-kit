import { useMemo } from 'react';

import { EnhancedCombobox } from '@/components/base/combobox';
import { useStrings } from '@/lib/strings';

import { useSuggestions } from './hooks';
import { defaultSuggestionsStrings } from './suggestions.strings';
import type { SuggestionsComboboxProps } from './suggestions.types';

export function SuggestionsCombobox<T>(props: SuggestionsComboboxProps<T>) {
	const {
		fetchData,
		itemKey,
		itemText,
		onValueChange,
		renderItem,
		minQueryLength = 1,
		debounceMs = 250,
		requestDelay = 0,
		preload = false,
		allowClear: _allowClear = true,
		clearInputOnClose = false,
		disabled = false,
		onError,
		strings: stringsProp,
	} = props;

	const strings = useStrings(defaultSuggestionsStrings, stringsProp);

	const {
		items,
		isLoading,
		searchValue,
		setSearchValue,
		selectedValue,
		setSelectedValue,
		open,
		setOpen,
	} = useSuggestions<T>({
		fetchData,
		minQueryLength,
		debounceMs,
		requestDelay,
		preload,
		onError,
	});

	const comboboxStrings = useMemo(
		() => ({
			placeholder: strings.placeholder,
			noResults: strings.emptyMessage,
			searching: strings.loadingMessage,
			typeToSearch: strings.startTypingMessage,
		}),
		[strings],
	);

	return (
		<EnhancedCombobox<T>
			items={items}
			searchValue={searchValue}
			onSearchValueChange={setSearchValue}
			selectedValue={selectedValue}
			onSelectedValueChange={(value) => {
				setSelectedValue(value);
				onValueChange?.(value);
			}}
			getItemLabel={itemText}
			getItemKey={(item) => String(itemKey(item))}
			renderItem={renderItem}
			minSearchLength={minQueryLength}
			isLoading={isLoading}
			strings={comboboxStrings}
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen && clearInputOnClose) {
					setSearchValue('');
				}
			}}
			disabled={disabled}
		/>
	);
}

SuggestionsCombobox.displayName = 'SuggestionsCombobox';
