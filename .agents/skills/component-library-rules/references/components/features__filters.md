---
id: features/filters
title: "Filters"
description: "Composable filter system. Search + multi-select stay always visible; the rest collapse behind a Filters button. Provider-driven so it works with any data source."
layer: features
family: "Search & filter"
sourcePath: src/components/features/filters
examples:
  - Default
imports:
  - @/components/features/filters
  - @/preview/_mocks
tags:
  - features
  - search
  - filter
  - filters
  - composable
  - system
  - multi
  - select
---

# Filters

Composable filter system. Search + multi-select stay always visible; the rest collapse behind a Filters button. Provider-driven so it works with any data source.

**Layer:** `features`  
**Source:** `src/components/features/filters`

## Examples

```tsx
import { useMemo, useState } from 'react';
import { BadgeCheck, Search, User } from 'lucide-react';

import {
	type ActiveFilter,
	type FilterConfig,
	type FilterOption,
	FilterLayout,
	FilterProvider,
	FilterType,
} from '@/components/features/filters';
import { mockListCustomers } from '@/preview/_mocks';

export function Default() {
	const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

	const filters = useMemo<FilterConfig[]>(
		() => [
			{
				key: 'q',
				label: 'Search',
				type: FilterType.SEARCH,
				placeholder: 'Search orders…',
				icon: <Search className="size-4" />,
				displayConfig: { display: 'always' },
			},
			{
				key: 'status',
				label: 'Status',
				type: FilterType.MULTI_SELECT,
				icon: <BadgeCheck className="size-4" />,
				displayConfig: { display: 'always' },
				options: [
					{ label: 'Pending', value: 'pending', icon: null },
					{ label: 'Paid', value: 'paid', icon: null },
					{ label: 'Shipped', value: 'shipped', icon: null },
					{ label: 'Cancelled', value: 'cancelled', icon: null },
				],
			},
			{
				key: 'customer',
				label: 'Customer',
				type: FilterType.ASYNC_SELECT,
				icon: <User className="size-4" />,
				displayConfig: { display: 'collapsed' },
				multiple: true,
				fetchOptions: async (): Promise<FilterOption[]> => {
					const customers = await mockListCustomers();
					return customers.map((c) => ({
						label: c.name,
						value: c.id,
						description: c.email,
						icon: null,
					}));
				},
			},
		],
		[],
	);

	return (
		<FilterProvider
			filters={filters}
			activeFilters={activeFilters}
			onFilterChange={setActiveFilters}
		>
			<FilterLayout showClearFilters />
		</FilterProvider>
	);
}
```

## Example exports

- `Default`

