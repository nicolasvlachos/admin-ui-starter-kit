---
id: base/combobox
title: "Combobox"
description: "EnhancedCombobox and EnhancedComboboxMultiple — searchable, optionally grouped, with apply / close-on-select behaviours, async fetchers, custom rendering, and form integration."
layer: base
family: "Forms & inputs"
sourcePath: src/components/base/combobox
examples:
  - Default
  - SingleSelect
  - SingleHighlightMatch
  - SingleCreatable
  - MultipleSelect
  - MultipleApplyButton
  - MultipleCloseOnSelect
  - MultipleGrouped
  - GroupedTeamByRole
  - AsyncCustomers
  - AsyncDebouncedSearch
  - AsyncWithLoadMore
  - CustomItemRendering
  - CustomGroupLabels
  - SizeSm
  - SizeMd
  - SizeLg
  - Disabled
  - Invalid
  - MinSearchLength
  - RealisticCustomerPicker
imports:
  - @/components/base/badge
  - @/components/base/combobox
  - @/components/typography
  - @/components/ui/avatar
tags:
  - base
  - forms
  - inputs
  - combobox
  - enhancedcombobox
  - enhancedcomboboxmultiple
  - searchable
  - optionally
---

# Combobox

EnhancedCombobox and EnhancedComboboxMultiple — searchable, optionally grouped, with apply / close-on-select behaviours, async fetchers, custom rendering, and form integration.

**Layer:** `base`  
**Source:** `src/components/base/combobox`

## Examples

```tsx
import { useEffect, useMemo, useState } from 'react';
import { EnhancedCombobox, EnhancedComboboxMultiple } from '@/components/base/combobox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/base/badge';
import { Text } from '@/components/typography';
import {
	MOCK_CUSTOMERS,
	MOCK_ORDERS,
	MOCK_TEAM,
	mockListCustomers,
	mockListTeam,
} from '@/preview/_mocks';

type Fruit = { id: string; name: string; group?: string };

const ALL: Fruit[] = [
	{ id: 'apple', name: 'Apple', group: 'Pomes' },
	{ id: 'pear', name: 'Pear', group: 'Pomes' },
	{ id: 'banana', name: 'Banana', group: 'Tropical' },
	{ id: 'mango', name: 'Mango', group: 'Tropical' },
	{ id: 'kiwi', name: 'Kiwi', group: 'Tropical' },
	{ id: 'cherry', name: 'Cherry', group: 'Stone' },
	{ id: 'peach', name: 'Peach', group: 'Stone' },
	{ id: 'plum', name: 'Plum', group: 'Stone' },
];

function useFiltered(search: string) {
	return useMemo(() => {
		const q = search.toLowerCase().trim();
		if (!q) return ALL;
		return ALL.filter((f) => f.name.toLowerCase().includes(q));
	}, [search]);
}

// =====================================================================
// Single
// =====================================================================

export function Default() {
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<Fruit | null>(null);
	const filtered = useFiltered(search);
	return (
		<div className="flex flex-col gap-2 w-72">
			<EnhancedCombobox
				items={filtered}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValue={selected}
				onSelectedValueChange={setSelected}
				getItemLabel={(f) => f.name}
				getItemKey={(f) => f.id}
				minSearchLength={0}
			/>
			<Text size="xs" type="secondary">value: {selected?.name ?? '—'}</Text>
		</div>
	);
}

export function SingleSelect() {
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<Fruit | null>(null);
	const filtered = useFiltered(search);
	return (
		<div className="flex flex-col gap-2 w-72">
			<EnhancedCombobox
				items={filtered}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValue={selected}
				onSelectedValueChange={setSelected}
				getItemLabel={(f) => f.name}
				getItemKey={(f) => f.id}
				minSearchLength={0}
			/>
		</div>
	);
}

export function SingleHighlightMatch() {
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<Fruit | null>(null);
	const filtered = useFiltered(search);
	return (
		<div className="flex flex-col gap-2 w-72">
			<EnhancedCombobox
				items={filtered}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValue={selected}
				onSelectedValueChange={setSelected}
				getItemLabel={(f) => f.name}
				getItemKey={(f) => f.id}
				minSearchLength={0}
				highlightMatch
				strings={{ placeholder: 'Type "an" or "ea"…' }}
			/>
		</div>
	);
}

export function SingleCreatable() {
	const [search, setSearch] = useState('');
	const [items, setItems] = useState<Fruit[]>(ALL);
	const [selected, setSelected] = useState<Fruit | null>(null);
	const filtered = useMemo(() => {
		const q = search.toLowerCase().trim();
		if (!q) return items;
		return items.filter((f) => f.name.toLowerCase().includes(q));
	}, [items, search]);
	return (
		<div className="flex flex-col gap-2 w-72">
			<EnhancedCombobox
				items={filtered}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValue={selected}
				onSelectedValueChange={setSelected}
				getItemLabel={(f) => f.name}
				getItemKey={(f) => f.id}
				minSearchLength={0}
				creatable
				onCreate={(value) => {
					const next: Fruit = { id: value.toLowerCase(), name: value };
					setItems((prev) => [...prev, next]);
					setSelected(next);
					setSearch('');
				}}
				strings={{ placeholder: 'Pick or create…', createNew: 'Create' }}
			/>
			<Text size="xs" type="secondary">items: {items.length}</Text>
		</div>
	);
}

// =====================================================================
// Multiple
// =====================================================================

export function MultipleSelect() {
	const [search, setSearch] = useState('');
	const [selectedMany, setSelectedMany] = useState<Fruit[]>([]);
	const filtered = useFiltered(search);
	return (
		<div className="flex flex-col gap-2 w-72">
			<EnhancedComboboxMultiple
				items={filtered}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValues={selectedMany}
				onSelectedValuesChange={setSelectedMany}
				getItemLabel={(f) => f.name}
				getItemKey={(f) => f.id}
				minSearchLength={0}
				strings={{ placeholder: 'Find a fruit…', noResults: 'Nothing matches' }}
			/>
			<Text size="xs" type="secondary">
				selected: {selectedMany.map((s) => s.name).join(', ') || '—'}
			</Text>
		</div>
	);
}

export function MultipleApplyButton() {
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<Fruit[]>([]);
	const filtered = useFiltered(search);
	return (
		<div className="flex flex-col gap-2 w-72">
			<EnhancedComboboxMultiple
				items={filtered}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValues={selected}
				onSelectedValuesChange={setSelected}
				getItemLabel={(f) => f.name}
				getItemKey={(f) => f.id}
				minSearchLength={0}
				applyButton
				strings={{ placeholder: 'Pick fruits…' }}
			/>
			<Text size="xs" type="secondary">
				committed: {selected.map((s) => s.name).join(', ') || '—'}
			</Text>
		</div>
	);
}

export function MultipleCloseOnSelect() {
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<Fruit[]>([]);
	const filtered = useFiltered(search);
	return (
		<div className="flex flex-col gap-2 w-72">
			<EnhancedComboboxMultiple
				items={filtered}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValues={selected}
				onSelectedValuesChange={setSelected}
				getItemLabel={(f) => f.name}
				getItemKey={(f) => f.id}
				minSearchLength={0}
				closeOnSelect
				strings={{ placeholder: 'Add a fruit…' }}
			/>
		</div>
	);
}

// =====================================================================
// Grouped
// =====================================================================

export function MultipleGrouped() {
	const [search, setSearch] = useState('');
	const [selectedMany, setSelectedMany] = useState<Fruit[]>([]);
	const filtered = useFiltered(search);
	return (
		<div className="flex flex-col gap-2 w-72">
			<EnhancedComboboxMultiple
				items={filtered}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValues={selectedMany}
				onSelectedValuesChange={setSelectedMany}
				getItemLabel={(f) => f.name}
				getItemKey={(f) => f.id}
				getItemGroup={(f) => f.group ?? 'Other'}
				minSearchLength={0}
			/>
		</div>
	);
}

export function GroupedTeamByRole() {
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<typeof MOCK_TEAM[number] | null>(null);
	const filtered = useMemo(() => {
		const q = search.toLowerCase().trim();
		if (!q) return MOCK_TEAM;
		return MOCK_TEAM.filter((t) => t.name.toLowerCase().includes(q) || t.role.toLowerCase().includes(q));
	}, [search]);
	return (
		<div className="flex flex-col gap-2 w-80">
			<EnhancedCombobox
				items={filtered}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValue={selected}
				onSelectedValueChange={setSelected}
				getItemLabel={(t) => t.name}
				getItemKey={(t) => t.id}
				getItemGroup={(t) => t.role}
				minSearchLength={0}
				strings={{ placeholder: 'Pick a teammate…' }}
			/>
		</div>
	);
}

// =====================================================================
// Async / fetcher
// =====================================================================

export function AsyncCustomers() {
	const [search, setSearch] = useState('');
	const [items, setItems] = useState<typeof MOCK_CUSTOMERS>([]);
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState<typeof MOCK_CUSTOMERS[number] | null>(null);
	useEffect(() => {
		let active = true;
		setLoading(true);
		mockListCustomers().then((data) => {
			if (!active) return;
			setItems(data);
			setLoading(false);
		});
		return () => { active = false; };
	}, []);
	const filtered = useMemo(() => {
		const q = search.toLowerCase().trim();
		if (!q) return items;
		return items.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
	}, [items, search]);
	return (
		<div className="flex flex-col gap-2 w-80">
			<EnhancedCombobox
				items={filtered}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValue={selected}
				onSelectedValueChange={setSelected}
				getItemLabel={(c) => `${c.name} — ${c.email}`}
				getItemKey={(c) => c.id}
				isLoading={loading}
				minSearchLength={0}
				strings={{ placeholder: 'Search customers…', searching: 'Loading customers…' }}
			/>
		</div>
	);
}

export function AsyncDebouncedSearch() {
	const [search, setSearch] = useState('');
	const [results, setResults] = useState<typeof MOCK_TEAM>([]);
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<typeof MOCK_TEAM[number] | null>(null);
	const handleSearch = (value: string) => {
		setLoading(true);
		mockListTeam().then((data) => {
			const q = value.toLowerCase().trim();
			setResults(q ? data.filter((t) => t.name.toLowerCase().includes(q)) : data);
			setLoading(false);
		});
	};
	return (
		<div className="flex flex-col gap-2 w-80">
			<EnhancedCombobox
				items={results}
				searchValue={search}
				onSearchValueChange={setSearch}
				onSearch={handleSearch}
				debounceMs={250}
				selectedValue={selected}
				onSelectedValueChange={setSelected}
				getItemLabel={(t) => t.name}
				getItemKey={(t) => t.id}
				isLoading={loading}
				minSearchLength={2}
				strings={{
					placeholder: 'Type a name…',
					typeMore: 'Type at least 2 characters',
					searching: 'Searching…',
				}}
			/>
		</div>
	);
}

export function AsyncWithLoadMore() {
	const PAGE = 4;
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [loadingMore, setLoadingMore] = useState(false);
	const [selected, setSelected] = useState<typeof MOCK_CUSTOMERS[number] | null>(null);
	const slice = MOCK_CUSTOMERS.slice(0, page * PAGE);
	const hasMore = slice.length < MOCK_CUSTOMERS.length;
	const handleLoadMore = () => {
		setLoadingMore(true);
		setTimeout(() => {
			setPage((p) => p + 1);
			setLoadingMore(false);
		}, 350);
	};
	return (
		<div className="flex flex-col gap-2 w-80">
			<EnhancedCombobox
				items={slice}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValue={selected}
				onSelectedValueChange={setSelected}
				getItemLabel={(c) => c.name}
				getItemKey={(c) => c.id}
				hasMore={hasMore}
				onLoadMore={handleLoadMore}
				isLoadingMore={loadingMore}
				minSearchLength={0}
				strings={{ placeholder: 'Scroll for more…', loadingMore: 'Loading more…' }}
			/>
			<Text size="xs" type="secondary">page {page} • {slice.length}/{MOCK_CUSTOMERS.length}</Text>
		</div>
	);
}

// =====================================================================
// Custom rendering
// =====================================================================

export function CustomItemRendering() {
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<typeof MOCK_CUSTOMERS[number] | null>(null);
	const filtered = useMemo(() => {
		const q = search.toLowerCase().trim();
		if (!q) return MOCK_CUSTOMERS;
		return MOCK_CUSTOMERS.filter((c) => c.name.toLowerCase().includes(q));
	}, [search]);
	return (
		<div className="flex flex-col gap-2 w-96">
			<EnhancedCombobox
				items={filtered}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValue={selected}
				onSelectedValueChange={setSelected}
				getItemLabel={(c) => c.name}
				getItemKey={(c) => c.id}
				minSearchLength={0}
				renderItem={(c) => (
					<div className="flex items-center gap-2.5 w-full">
						<Avatar className="h-7 w-7">
							<AvatarFallback>{c.name.split(' ').map((p) => p[0]).join('')}</AvatarFallback>
						</Avatar>
						<div className="flex flex-col min-w-0 flex-1">
							<Text weight="semibold">{c.name}</Text>
							<Text size="xs" type="secondary">{c.email}</Text>
						</div>
						<Badge variant="secondary">{c.country}</Badge>
					</div>
				)}
				strings={{ placeholder: 'Pick a customer…' }}
			/>
		</div>
	);
}

export function CustomGroupLabels() {
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<typeof MOCK_ORDERS[number] | null>(null);
	const filtered = useMemo(() => {
		const q = search.toLowerCase().trim();
		if (!q) return MOCK_ORDERS;
		return MOCK_ORDERS.filter((o) => o.number.toLowerCase().includes(q));
	}, [search]);
	return (
		<div className="flex flex-col gap-2 w-80">
			<EnhancedCombobox
				items={filtered}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValue={selected}
				onSelectedValueChange={setSelected}
				getItemLabel={(o) => o.number}
				getItemKey={(o) => o.id}
				getItemGroup={(o) => o.status}
				renderGroupLabel={(group) => (
					<div className="flex items-center gap-2">
						<Text size="xxs" type="secondary" weight="semibold" className="uppercase tracking-wide">
							{group}
						</Text>
					</div>
				)}
				minSearchLength={0}
				strings={{ placeholder: 'Find an order…' }}
			/>
		</div>
	);
}

// =====================================================================
// Sizes
// =====================================================================

export function SizeSm() {
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<Fruit | null>(null);
	const filtered = useFiltered(search);
	return (
		<div className="flex flex-col gap-2 w-72">
			<EnhancedCombobox
				size="sm"
				items={filtered}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValue={selected}
				onSelectedValueChange={setSelected}
				getItemLabel={(f) => f.name}
				getItemKey={(f) => f.id}
				minSearchLength={0}
			/>
		</div>
	);
}

export function SizeMd() {
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<Fruit | null>(null);
	const filtered = useFiltered(search);
	return (
		<div className="flex flex-col gap-2 w-72">
			<EnhancedCombobox
				size="md"
				items={filtered}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValue={selected}
				onSelectedValueChange={setSelected}
				getItemLabel={(f) => f.name}
				getItemKey={(f) => f.id}
				minSearchLength={0}
			/>
		</div>
	);
}

export function SizeLg() {
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<Fruit | null>(null);
	const filtered = useFiltered(search);
	return (
		<div className="flex flex-col gap-2 w-72">
			<EnhancedCombobox
				size="lg"
				items={filtered}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValue={selected}
				onSelectedValueChange={setSelected}
				getItemLabel={(f) => f.name}
				getItemKey={(f) => f.id}
				minSearchLength={0}
			/>
		</div>
	);
}

// =====================================================================
// States
// =====================================================================

export function Disabled() {
	const [search, setSearch] = useState('');
	return (
		<div className="flex flex-col gap-2 w-72">
			<EnhancedCombobox
				items={ALL}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValue={ALL[0] ?? null}
				onSelectedValueChange={() => {}}
				getItemLabel={(f) => f.name}
				getItemKey={(f) => f.id}
				disabled
				minSearchLength={0}
			/>
		</div>
	);
}

export function Invalid() {
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<Fruit | null>(null);
	const filtered = useFiltered(search);
	return (
		<div className="flex flex-col gap-2 w-72">
			<EnhancedCombobox
				items={filtered}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValue={selected}
				onSelectedValueChange={setSelected}
				getItemLabel={(f) => f.name}
				getItemKey={(f) => f.id}
				minSearchLength={0}
				required
				error="A selection is required"
			/>
		</div>
	);
}

export function MinSearchLength() {
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<typeof MOCK_CUSTOMERS[number] | null>(null);
	const filtered = useMemo(() => {
		const q = search.toLowerCase().trim();
		if (q.length < 2) return [];
		return MOCK_CUSTOMERS.filter((c) => c.name.toLowerCase().includes(q));
	}, [search]);
	return (
		<div className="flex flex-col gap-2 w-80">
			<EnhancedCombobox
				items={filtered}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValue={selected}
				onSelectedValueChange={setSelected}
				getItemLabel={(c) => c.name}
				getItemKey={(c) => c.id}
				minSearchLength={2}
				strings={{ placeholder: 'Type to search…', typeMore: 'Type at least 2 characters' }}
			/>
		</div>
	);
}

// =====================================================================
// Realistic
// =====================================================================

export function RealisticCustomerPicker() {
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<typeof MOCK_CUSTOMERS[number] | null>(null);
	const filtered = useMemo(() => {
		const q = search.toLowerCase().trim();
		if (!q) return MOCK_CUSTOMERS;
		return MOCK_CUSTOMERS.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
	}, [search]);
	return (
		<div className="flex flex-col gap-2 w-80">
			<EnhancedCombobox
				items={filtered}
				searchValue={search}
				onSearchValueChange={setSearch}
				selectedValue={selected}
				onSelectedValueChange={setSelected}
				getItemLabel={(c) => `${c.name} — ${c.email}`}
				getItemKey={(c) => c.id}
				minSearchLength={0}
				strings={{ placeholder: 'Search customers…' }}
			/>
		</div>
	);
}
```

## Example exports

- `Default`
- `SingleSelect`
- `SingleHighlightMatch`
- `SingleCreatable`
- `MultipleSelect`
- `MultipleApplyButton`
- `MultipleCloseOnSelect`
- `MultipleGrouped`
- `GroupedTeamByRole`
- `AsyncCustomers`
- `AsyncDebouncedSearch`
- `AsyncWithLoadMore`
- `CustomItemRendering`
- `CustomGroupLabels`
- `SizeSm`
- `SizeMd`
- `SizeLg`
- `Disabled`
- `Invalid`
- `MinSearchLength`
- `RealisticCustomerPicker`

