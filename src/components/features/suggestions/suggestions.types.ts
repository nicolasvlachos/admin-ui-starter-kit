import type { ReactNode } from 'react';
import type { StringsProp } from '@/lib/strings';

import type { SuggestionsStrings } from './suggestions.strings';

export type MaybePromise<T> = T | Promise<T>;

export interface UseSuggestionsConfig<T> {
	fetchData: (query: string) => MaybePromise<T[]>;
	minQueryLength?: number;
	debounceMs?: number;
	requestDelay?: number;
	preload?: boolean;
	/** Fires on fetcher rejection — consumer wires telemetry / toasts here. */
	onError?: (error: unknown, query: string) => void;
}

export interface UseSuggestionsResult<T> {
	items: T[];
	isLoading: boolean;
	searchValue: string;
	setSearchValue: (value: string) => void;
	selectedValue: T | null;
	setSelectedValue: (value: T | null) => void;
	open: boolean;
	setOpen: (value: boolean) => void;
}

export interface SuggestionsComboboxProps<T> extends UseSuggestionsConfig<T> {
	itemKey: (item: T) => string | number;
	itemText: (item: T) => string;
	onValueChange?: (value: T | null) => void;
	renderItem?: (item: T) => ReactNode;
	allowClear?: boolean;
	clearInputOnClose?: boolean;
	disabled?: boolean;
	/** Per-instance string overrides (deep-merged over `defaultSuggestionsStrings`). */
	strings?: StringsProp<SuggestionsStrings>;
}
