---
id: features/global-search
title: "GlobalSearch"
description: "Async search palette with slots, render-props, and a headless useGlobalSearch hook."
layer: features
family: "Search & filter"
sourcePath: src/components/features/global-search
examples:
  - Default
imports:
  - @/components/features/global-search
  - @/preview/_mocks
tags:
  - features
  - search
  - filter
  - global-search
  - globalsearch
  - async
  - palette
  - slots
---

# GlobalSearch

Async search palette with slots, render-props, and a headless useGlobalSearch hook.

**Layer:** `features`  
**Source:** `src/components/features/global-search`

## Examples

```tsx
import { Briefcase, FileText, Ticket, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import {
	GlobalSearch,
	type GlobalSearchResult,
} from '@/components/features/global-search';
import { mockSearch, type MockSearchResult } from '@/preview/_mocks';

type ResultGroup = MockSearchResult['type'];

const GROUP_LABEL: Record<ResultGroup, string> = {
	customer: 'Customers',
	order: 'Orders',
	voucher: 'Vouchers',
	team: 'Team',
};

const GROUP_ICON = {
	customer: User,
	order: FileText,
	voucher: Ticket,
	team: Briefcase,
} as const;

const GROUP_TONE = {
	customer: 'primary',
	order: 'info',
	voucher: 'success',
	team: 'warning',
} as const;

function toResult(r: MockSearchResult): GlobalSearchResult<ResultGroup> {
	return {
		id: r.id,
		title: r.title,
		subtitle: r.subtitle,
		group: r.type,
		thumbnail: { icon: GROUP_ICON[r.type], tone: GROUP_TONE[r.type] },
	};
}

export function Default() {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<Array<GlobalSearchResult<ResultGroup>>>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const q = query.trim();
		if (q.length <= 1) {
			setResults([]);
			setLoading(false);
			return;
		}
		let cancelled = false;
		setLoading(true);
		mockSearch(q).then((rows) => {
			if (cancelled) return;
			setResults(rows.map(toResult));
			setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [query]);

	const groupLabels = useMemo(() => GROUP_LABEL, []);

	return (
		<div className="w-full">
			<GlobalSearch<ResultGroup>
				query={query}
				onQueryChange={setQuery}
				results={results}
				loading={loading}
				groupLabels={groupLabels}
				onResultSelect={(result) => {
					if (import.meta.env?.DEV) {
						console.info('selected', result);
					}
				}}
				onClose={() => setQuery('')}
			/>
		</div>
	);
}
```

## Example exports

- `Default`

