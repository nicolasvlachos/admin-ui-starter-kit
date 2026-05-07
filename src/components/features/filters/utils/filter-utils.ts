import type { ReactNode } from 'react';
import type { FilterConfig, FilterDependency } from '../filters.types';

/**
 * Gets the label for a filter option
 */
export function getFilterOptionLabel(
	filter: FilterConfig,
	value: string,
): string | undefined {
	return filter.options?.find((opt) => opt.value === value)?.label;
}

/**
 * Gets the icon for a filter option
 */
export function getFilterOptionIcon(
	filter: FilterConfig,
	value: string,
): ReactNode | undefined {
	return filter.options?.find((opt) => opt.value === value)?.icon;
}

/**
 * Validates a filter value against the filter configuration
 *
 * @param filter - The filter configuration to validate against
 * @param value - The value to validate
 * @param t
 * @returns true if valid, or an error message string if invalid
 */
export function validateFilterValue(
	filter: FilterConfig,
	value: unknown,
	t: (key: string) => string,
): boolean | string {
	// Special case for date filters - always allow date strings
	if (filter.type === 'date') {
		// If the value is a date string array, it's valid
		if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
			return true;
		}
	}

	// Require if marked as required
	if (
		filter.validation?.required &&
		(!value || (Array.isArray(value) && value.length === 0))
	) {
		return t('validation.required');
	}

	// Only check min/max for numeric values
	if (typeof value === 'number') {
		if (
			filter.validation?.min !== undefined &&
			value < filter.validation.min
		) {
			return t('validation.minValue').replace(
				'{min}',
				String(filter.validation.min),
			);
		}

		if (
			filter.validation?.max !== undefined &&
			value > filter.validation.max
		) {
			return t('validation.maxValue').replace(
				'{max}',
				String(filter.validation.max),
			);
		}
	}

	// Pattern validation for strings only
	if (filter.validation?.pattern && typeof value === 'string') {
		const regex = new RegExp(filter.validation.pattern);
		if (!regex.test(value)) {
			return t('validation.invalidFormat');
		}
	}

	// Custom validation if provided
	if (filter.validation?.custom) {
		const customValidation = filter.validation.custom(value);
		if (typeof customValidation === 'string' || !customValidation) {
			return customValidation;
		}
	}

	// If we got here, the value is valid
	return true;
}

/**
 * Formats a filter value for display using either the format function provided
 * in the filter config, or by looking up option labels
 *
 * @param filter - The filter configuration
 * @param value - The value to format
 * @returns Formatted string representation of the value
 */
export function formatFilterValue(
	filter: FilterConfig,
	value: unknown,
): string {
	// Use custom format function if provided in filter config
	if (filter.format && typeof filter.format === 'function') {
		try {
			return filter.format(value);
		} catch (error) {
			if (import.meta.env?.DEV) {
				console.error(
					`Error using custom format function for filter ${filter.key}:`,
					error,
				);
			}
			// Fall back to default formatting
		}
	}

	// Default formatting behavior
	if (Array.isArray(value)) {
		return value
			.map((v) => getFilterOptionLabel(filter, String(v)) ?? String(v))
			.join(', ');
	}

	return getFilterOptionLabel(filter, String(value)) ?? String(value);
}

/**
 * Gets the values of dependent filters
 */
export function getDependentFilterValues(
	dependencies: FilterDependency[],
	filterState: Record<string, string[]>,
): Record<string, string[]> {
	return dependencies.reduce(
		(acc, dep) => {
			const values = filterState[dep.key] || [];
			if (values.length > 0) {
				acc[dep.key] = values;
			}
			return acc;
		},
		{} as Record<string, string[]>,
	);
}

/**
 * Determines if a filter should be shown based on its dependencies
 */
export function shouldShowFilter(
	filter: FilterConfig,
	filterState: Record<string, string[]>,
): boolean {
	if (!filter.dependencies || filter.dependencies.length === 0) {
		return true;
	}

	return filter.dependencies.every((dep) => {
		const values = filterState[dep.key] || [];
		if (values.length === 0) return false;

		switch (dep.operator) {
			case 'equals':
				return values.includes(dep.value as string);
			case 'contains':
				return values.some((v) => (dep.value as string).includes(v));
			case 'in':
				return Array.isArray(dep.value)
					? values.some((v) => (dep.value as string[]).includes(v))
					: values.includes(dep.value);
			default:
				return false;
		}
	});
}

export function extractFilterDefaults<T extends string = string>(
	filters: FilterConfig[],
): Record<T, string> {
	return filters.reduce(
		(acc, filter) => {
			// Force the default value to be treated as a string
			acc[filter.key as T] = (filter.defaultValue as string) || '';
			return acc;
		},
		{} as Record<T, string>,
	);
}
